import React, { useState, useEffect } from 'react';
import { Dialog } from '@components/base/dialog';
import { PodTerminal } from './pod-terminal';
import { V1Pod } from '@kubernetes/client-node';

interface TerminalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pod: V1Pod;
  namespace: string;
}

export const TerminalDialog: React.FC<TerminalDialogProps> = ({
  isOpen,
  onClose,
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

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="max-w-4xl w-full h-[80vh]"
    >
      <div className="flex flex-col h-full">
        {showContainerSelection ? (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Container
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This pod has multiple containers. Please select which container to connect to:
            </p>
            <div className="space-y-2">
              {containers.map((container) => (
                <button
                  key={container.name}
                  onClick={() => handleContainerSelect(container.name)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className="font-medium text-gray-900">{container.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Image: {container.image}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <PodTerminal
            podName={pod.metadata?.name || ''}
            namespace={namespace}
            containerName={selectedContainer || undefined}
            _onClose={onClose}
          />
        )}
      </div>
    </Dialog>
  );
};