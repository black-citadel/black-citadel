import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogActions } from '@components/base/dialog';
import { Button } from '@components/base/button';

interface ScaleDeploymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (replicas: number) => Promise<void>;
  resourceName: string;
  namespace: string;
  currentReplicas: number;
}

export const ScaleDeploymentDialog: React.FC<ScaleDeploymentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  resourceName,
  namespace,
  currentReplicas,
}) => {
  const [replicas, setReplicas] = useState(currentReplicas);
  const [isScaling, setIsScaling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsScaling(true);
    setError(null);
    
    try {
      await onConfirm(replicas);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scale deployment');
    } finally {
      setIsScaling(false);
    }
  };

  const handleReplicasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setReplicas(value);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="mb-4">
        <DialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Scale Deployment
        </DialogTitle>
        <DialogDescription className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Scale deployment "{resourceName}" in namespace "{namespace}"
        </DialogDescription>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Number of replicas
          </label>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setReplicas(Math.max(0, replicas - 1))}
              disabled={isScaling || replicas === 0}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <input
              type="number"
              min="0"
              value={replicas}
              onChange={handleReplicasChange}
              disabled={isScaling}
              className="w-20 text-center rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            
            <button
              type="button"
              onClick={() => setReplicas(replicas + 1)}
              disabled={isScaling}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Current replicas: {currentReplicas}
          </p>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">
              Error: {error}
            </p>
          </div>
        )}
      </div>

      <DialogActions className="flex justify-end gap-3">
        <Button
          onClick={onClose}
          disabled={isScaling}
          outline
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isScaling || replicas === currentReplicas}
        >
          {isScaling ? 'Scaling...' : 'Scale'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};