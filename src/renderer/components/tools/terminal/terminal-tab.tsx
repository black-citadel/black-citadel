import React, { useState, useEffect } from 'react';
import { PodTerminal } from './pod-terminal';
import { V1Pod } from '@kubernetes/client-node';

interface TerminalTabProps {
  pod: V1Pod;
  namespace: string;
}

export const TerminalTab: React.FC<TerminalTabProps> = ({
  pod,
  namespace
}) => {
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const containers = pod.spec?.containers || [];
  
  useEffect(() => {
    // Auto-select the first container if there's only one
    if (containers.length === 1 && !selectedContainer) {
      setSelectedContainer(containers[0].name);
    }
  }, [containers, selectedContainer]);

  const handleContainerSelect = (containerName: string) => {
    setSelectedContainer(containerName);
  };

  const showContainerSelection = containers.length > 1 && !selectedContainer;

  if (showContainerSelection) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Select Container
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This pod has multiple containers. Please select which container to connect to:
        </p>
        <div className="space-y-2">
          {containers.map((container) => (
            <button
              key={container.name}
              onClick={() => handleContainerSelect(container.name)}
              className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">{container.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Image: {container.image}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-300px)] min-h-[500px]">
      <PodTerminal
        podName={pod.metadata?.name || ''}
        namespace={namespace}
        containerName={selectedContainer || undefined}
      />
    </div>
  );
};