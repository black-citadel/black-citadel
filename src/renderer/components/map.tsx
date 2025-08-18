import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Background, BackgroundVariant, Node, Edge, Controls } from '@xyflow/react';

export interface MapNode extends Node {
  data: {
    label: string;
    type?: string;
    status?: string;
    [key: string]: any;
  };
}

export interface MapEdge extends Edge {
  label?: string;
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

interface MapProps {
  nodes: MapNode[];
  edges: MapEdge[];
  height?: string;
  fitViewPadding?: number;
}

export const Map = ({ nodes: initialNodes, edges: initialEdges, height = '400px', fitViewPadding = 0.2 }: MapProps): JSX.Element => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange<MapNode>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<MapEdge>[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const proOptions = { hideAttribution: true };

  // Update nodes and edges when props change - use useEffect instead of useMemo
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  return (
    <div style={{ width: '100%', height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
		colorMode="dark"
		nodesDraggable={false}
		nodesConnectable={false}
		proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: fitViewPadding }}
      >
		<Background color="#414141" bgColor='#0a0a0a' variant={BackgroundVariant.Dots} />
		<Controls />
</ReactFlow>

    </div>
  );
}