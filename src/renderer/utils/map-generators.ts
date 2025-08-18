import { V1Service, V1Pod } from '@utils/k8s-types';
import { MapNode, MapEdge } from '@components/map';
import { Position } from '@xyflow/react';

export function generateServiceMap(service?: V1Service, pods?: V1Pod[]): { nodes: MapNode[]; edges: MapEdge[] } {
  const nodes: MapNode[] = [];
  const edges: MapEdge[] = [];

  if (!service) {
    return { nodes, edges };
  }


  // Add service node
  nodes.push({
    id: 'service',
    position: { x: 0, y: 50 },
    data: { 
      label: service.metadata?.name || 'Unknown Service',
      type: 'service'
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
      backgroundColor: '#1e40af',
      color: '#ffffff',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      padding: '10px',
      fontWeight: 'bold'
    }
  });

  // Add pod nodes
  if (pods && pods.length > 0) {
    const podSpacing = 120;
    const startY = (pods.length - 1) * podSpacing / -2;

    pods.forEach((pod, index) => {
      const podId = `pod-${index}`;
      
      nodes.push({
        id: podId,
        position: { x: 400, y: startY + (index * podSpacing) },
        data: { 
          label: pod.metadata?.name || 'Unknown Pod',
          type: 'pod',
          status: pod.status?.phase
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          backgroundColor: pod.status?.phase === 'Running' ? '#16a34a' : '#dc2626',
          color: '#ffffff',
          border: `2px solid ${pod.status?.phase === 'Running' ? '#22c55e' : '#ef4444'}`,
          borderRadius: '8px',
          padding: '8px'
        }
      });

      // Create edge from service to pod
      const selector = service.spec?.selector || {};
      const selectorLabel = Object.entries(selector)
        .map(([key, value]) => `${key}:${value}`)
        .join(', ');

      edges.push({
        id: `service-${podId}`,
        source: 'service',
        target: podId,
        animated: true,
        type: 'smoothstep',
        label: selectorLabel || 'No selector',
        style: {
          stroke: '#94a3b8',
          strokeWidth: 2
        },
        labelStyle: {
          fill: '#cbd5e1',
          fontWeight: 500,
          fontSize: 12
        }
      });
    });
  } else if (!service.spec?.selector || Object.keys(service.spec.selector).length === 0) {
    // Service has no selector - show a message node
    nodes.push({
      id: 'no-selector',
      position: { x: 400, y: 50 },
      data: { 
        label: 'No pod selector defined',
        type: 'message'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        backgroundColor: '#475569',
        color: '#e2e8f0',
        border: '2px solid #64748b',
        borderRadius: '8px',
        padding: '8px',
        fontStyle: 'italic'
      }
    });
  }

  return { nodes, edges };
}