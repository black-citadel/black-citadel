import { BrowserWindow, ipcMain } from 'electron';

/**
 * Development utilities for Chrome DevTools Protocol
 * Only available in development mode
 */
export class CDPDevUtils {
  private window: BrowserWindow;
  private isAttached: boolean = false;

  constructor(window: BrowserWindow) {
    this.window = window;
    this.setupDevHandlers();
  }

  private setupDevHandlers() {
    // Only set up in development
    if (process.env.NODE_ENV !== 'development' && this.window.webContents.session.defaultSession) {
      return;
    }

    // IPC handlers for CDP commands from renderer (for development tools)
    ipcMain.handle('cdp:sendCommand', async (event, method: string, params?: any) => {
      if (!this.isAttached) {
        await this.attach();
      }
      try {
        return await this.window.webContents.debugger.sendCommand(method, params);
      } catch (error) {
        console.error('CDP command error:', error);
        throw error;
      }
    });

    ipcMain.handle('cdp:evaluate', async (event, expression: string) => {
      if (!this.isAttached) {
        await this.attach();
      }
      try {
        const result = await this.window.webContents.debugger.sendCommand('Runtime.evaluate', {
          expression,
          returnByValue: true,
        });
        return result;
      } catch (error) {
        console.error('CDP evaluate error:', error);
        throw error;
      }
    });

    ipcMain.handle('cdp:getInfo', async () => {
      return {
        isAttached: this.isAttached,
        debugUrl: `http://localhost:9223`,
        webContentsId: this.window.webContents.id,
      };
    });
  }

  async attach() {
    if (this.isAttached) return;
    
    try {
      await this.window.webContents.debugger.attach('1.3');
      this.isAttached = true;
      
      // Enable necessary domains
      await this.window.webContents.debugger.sendCommand('Runtime.enable');
      await this.window.webContents.debugger.sendCommand('Network.enable');
      await this.window.webContents.debugger.sendCommand('Page.enable');
      
      console.log('CDP attached and domains enabled');
    } catch (error) {
      console.error('Failed to attach CDP:', error);
      throw error;
    }
  }

  async detach() {
    if (!this.isAttached) return;
    
    try {
      this.window.webContents.debugger.detach();
      this.isAttached = false;
      console.log('CDP detached');
    } catch (error) {
      console.error('Failed to detach CDP:', error);
    }
  }

  // Helper method to capture network traffic
  async captureNetworkTraffic(duration: number = 5000): Promise<any[]> {
    const requests: any[] = [];
    
    const handler = (event: any, method: string, params: any) => {
      if (method.startsWith('Network.')) {
        requests.push({ method, params, timestamp: Date.now() });
      }
    };

    this.window.webContents.debugger.on('message', handler);
    
    await new Promise(resolve => setTimeout(resolve, duration));
    
    this.window.webContents.debugger.off('message', handler);
    
    return requests;
  }

  // Helper method to get performance metrics
  async getPerformanceMetrics() {
    if (!this.isAttached) {
      await this.attach();
    }
    
    try {
      const metrics = await this.window.webContents.debugger.sendCommand('Performance.getMetrics');
      return metrics;
    } catch (error) {
      console.error('Failed to get performance metrics:', error);
      throw error;
    }
  }

  // Helper method to take heap snapshot
  async takeHeapSnapshot(): Promise<string> {
    if (!this.isAttached) {
      await this.attach();
    }
    
    const chunks: string[] = [];
    
    const handler = (event: any, method: string, params: any) => {
      if (method === 'HeapProfiler.addHeapSnapshotChunk') {
        chunks.push(params.chunk);
      }
    };

    this.window.webContents.debugger.on('message', handler);
    
    try {
      await this.window.webContents.debugger.sendCommand('HeapProfiler.enable');
      await this.window.webContents.debugger.sendCommand('HeapProfiler.takeHeapSnapshot');
      
      // Wait a bit for all chunks to arrive
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.window.webContents.debugger.off('message', handler);
      await this.window.webContents.debugger.sendCommand('HeapProfiler.disable');
      
      return chunks.join('');
    } catch (error) {
      console.error('Failed to take heap snapshot:', error);
      throw error;
    }
  }
}