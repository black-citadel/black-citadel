import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import k8s = require('@kubernetes/client-node');
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import { Server } from 'http';
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

// Tool call history tracking
export interface ToolCallHistory {
  id: string;
  timestamp: Date;
  connectionId: string;
  toolName: string;
  input: any;
  output: any;
  duration: number;
  status: 'success' | 'error';
  error?: string;
}

// MCP connection info
export interface MCPConnection {
  id: string;
  connectedAt: Date;
  lastActivity: Date;
  toolsUsed: number;
  agentName?: string;
}

// Store for history and connections
export const toolCallHistory: ToolCallHistory[] = [];
export const activeConnections = new Map<string, MCPConnection>();

// Kubernetes config
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

// Helper to track tool calls
async function trackToolCall<T>(
  connectionId: string,
  toolName: string,
  input: any,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  const historyEntry: ToolCallHistory = {
    id: uuidv4(),
    timestamp: new Date(),
    connectionId,
    toolName,
    input,
    output: null,
    duration: 0,
    status: 'success'
  };

  try {
    const result = await fn();
    historyEntry.output = result;
    historyEntry.duration = Date.now() - startTime;
    toolCallHistory.push(historyEntry);
    
    // Update connection activity
    const connection = activeConnections.get(connectionId);
    if (connection) {
      connection.lastActivity = new Date();
      connection.toolsUsed++;
    }
    
    return result;
  } catch (error) {
    historyEntry.status = 'error';
    historyEntry.error = error instanceof Error ? error.message : String(error);
    historyEntry.duration = Date.now() - startTime;
    toolCallHistory.push(historyEntry);
    throw error;
  }
}

// Express app and HTTP server
let app: express.Application | null = null;
let httpServer: Server | null = null;
let cleanupInterval: NodeJS.Timeout | null = null;

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Start MCP server with HTTP transport
export async function startMCPServer(port: number = 3333): Promise<void> {
  console.log(`Starting MCP server on port ${port}...`);
  
  app = express();
  app.use(express.json());
  
  // Handle POST requests for client-to-server communication
  app.post('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;
    let connectionId: string;

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId];
      connectionId = sessionId;
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      connectionId = uuidv4();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => connectionId,
        onsessioninitialized: (sessionId) => {
          // Store the transport by session ID
          transports[sessionId] = transport;
          
          // Track new connection
          const agentName = req.body.params?.clientInfo?.name || 'Unknown Agent';
          activeConnections.set(sessionId, {
            id: sessionId,
            connectedAt: new Date(),
            lastActivity: new Date(),
            toolsUsed: 0,
            agentName
          });
          console.log(`MCP client connected: ${agentName} (${sessionId})`);
        }
      });

      // Clean up transport when closed
      transport.onclose = () => {
        if (transport.sessionId) {
          console.log(`MCP client disconnected: ${transport.sessionId}`);
          activeConnections.delete(transport.sessionId);
          delete transports[transport.sessionId];
        }
      };
      
      // Also handle connection errors
      transport.onerror = (error) => {
        console.error(`MCP connection error for ${connectionId}:`, error);
        if (transport.sessionId) {
          activeConnections.delete(transport.sessionId);
          delete transports[transport.sessionId];
        }
      };
      
      // Create new server instance for this connection
      const server = new McpServer({
        name: "Black Citadel MCP Server",
        version: "1.0.0",
        description: "MCP server for Kubernetes operations in Black Citadel"
      });
      
      // Register all tools with connection context
      registerTools(server, connectionId);
      
      // Connect to the MCP server
      await server.connect(transport);
    } else {
      // Invalid request
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      });
      return;
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  });

  // Handle GET requests for server-to-client notifications via SSE
  app.get('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }
    
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  });

  // Handle DELETE requests for session termination
  app.delete('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }
    
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  });
  
  // Start HTTP server
  httpServer = app.listen(port, () => {
    console.log(`MCP server listening on http://localhost:${port}`);
  });
  
  // Start periodic cleanup of stale connections
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    const staleTimeout = 3600000; // 1 hour
    
    for (const [sessionId, connection] of activeConnections.entries()) {
      const lastActivityTime = new Date(connection.lastActivity).getTime();
      if (now - lastActivityTime > staleTimeout) {
        console.log(`Cleaning up stale connection: ${sessionId}`);
        activeConnections.delete(sessionId);
        
        // Clean up transport if it exists
        if (transports[sessionId]) {
          transports[sessionId].close();
          delete transports[sessionId];
        }
      }
    }
  }, 300000); // Check every 5 minutes
}

// Stop MCP server
export async function stopMCPServer(): Promise<void> {
  if (httpServer) {
    httpServer.close();
    httpServer = null;
  }
  
  // Clear cleanup interval
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
  
  // Close all active transports
  for (const sessionId in transports) {
    const transport = transports[sessionId];
    transport.close();
  }
  
  // Clear connections
  activeConnections.clear();
  
  console.log("MCP server stopped");
}

// Helper to register tools with connection context
function registerTools(server: McpServer, connectionId: string) {
  // Tool: List Kubernetes contexts
  server.tool(
    "kubernetes_list_contexts",
    {},
    async () => {
      return trackToolCall(connectionId, "kubernetes_list_contexts", {}, async () => {
        const contexts = kc.getContexts();
        const currentContext = kc.getCurrentContext();
        
        const contextList = contexts.map(ctx => ({
          name: ctx.name,
          cluster: ctx.cluster,
          user: ctx.user,
          namespace: ctx.namespace || 'default',
          current: ctx.name === currentContext
        }));

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              contexts: contextList,
              currentContext
            }, null, 2)
          }]
        };
      });
    }
  );

  // Tool: List namespaces in current context
  server.tool(
    "kubernetes_list_namespaces",
    {},
    async () => {
      return trackToolCall(connectionId, "kubernetes_list_namespaces", {}, async () => {
        const k8sCoreV1Api = kc.makeApiClient(k8s.CoreV1Api);
        const currentContext = kc.getCurrentContext();
        
        try {
          const response = await k8sCoreV1Api.listNamespace();
          const namespaces = response.body.items.map(ns => ({
            name: ns.metadata?.name,
            status: ns.status?.phase,
            creationTimestamp: ns.metadata?.creationTimestamp,
            labels: ns.metadata?.labels || {},
            annotations: ns.metadata?.annotations || {}
          }));

          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                context: currentContext,
                namespaces,
                total: namespaces.length
              }, null, 2)
            }]
          };
        } catch (error) {
          throw new Error(`Failed to list namespaces: ${error}`);
        }
      });
    }
  );

  // Tool: Switch Kubernetes context
  server.tool(
    "kubernetes_switch_context",
    {
      contextName: z.string().describe("Name of the context to switch to")
    },
    async ({ contextName }) => {
      return trackToolCall(connectionId, "kubernetes_switch_context", { contextName }, async () => {
        try {
          // Check if context exists
          const contexts = kc.getContexts();
          const contextExists = contexts.some(ctx => ctx.name === contextName);
          
          if (!contextExists) {
            throw new Error(`Context '${contextName}' not found`);
          }
          
          // Switch context
          kc.setCurrentContext(contextName);
          
          // Reload the config to ensure APIs use new context
          kc.loadFromDefault();
          
          return {
            content: [{
              type: "text",
              text: `Successfully switched to context: ${contextName}`
            }]
          };
        } catch (error) {
          throw new Error(`Failed to switch context: ${error}`);
        }
      });
    }
  );

  // Tool: Get current namespace
  server.tool(
    "kubernetes_get_current_namespace",
    {},
    async () => {
      return trackToolCall(connectionId, "kubernetes_get_current_namespace", {}, async () => {
        const currentContext = kc.getCurrentContext();
        const context = kc.getContextObject(currentContext);
        const namespace = context?.namespace || 'default';
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              context: currentContext,
              namespace: namespace
            }, null, 2)
          }]
        };
      });
    }
  );
}

// Get tool call history (for IPC)
export function getToolCallHistory(limit?: number): ToolCallHistory[] {
  const history = [...toolCallHistory].reverse(); // Most recent first
  return limit ? history.slice(0, limit) : history;
}

// Get active connections (for IPC)
export function getActiveConnections(): MCPConnection[] {
  return Array.from(activeConnections.values());
}

// Clear history (for IPC)
export function clearToolCallHistory(): void {
  toolCallHistory.length = 0;
}