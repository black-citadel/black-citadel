import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogActions } from '@components/base/dialog';
import { Button } from '@protoku/design-system';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  resourceType: string;
  resourceName: string;
  namespace?: string;
  cascadeDelete?: boolean;
  onCascadeDeleteChange?: (cascade: boolean) => void;
  customMessage?: string;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  resourceType,
  resourceName,
  namespace,
  cascadeDelete = false,
  onCascadeDeleteChange,
  customMessage,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource');
    } finally {
      setIsDeleting(false);
    }
  };

  const defaultMessage = namespace
    ? `Are you sure you want to delete ${resourceType} "${resourceName}" in namespace "${namespace}"?`
    : `Are you sure you want to delete ${resourceType} "${resourceName}"?`;

  const showCascadeOption = ['Namespace', 'Deployment', 'StatefulSet', 'DaemonSet'].includes(resourceType);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="mb-4">
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {customMessage || defaultMessage}
            </DialogDescription>
              
              {resourceType === 'Namespace' && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Warning:</strong> Deleting a namespace will delete all resources within it.
                  </p>
                </div>
              )}

              {showCascadeOption && onCascadeDeleteChange && (
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={cascadeDelete}
                      onChange={(e) => onCascadeDeleteChange(e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Cascade delete (delete all dependent resources)
                    </span>
                  </label>
                </div>
              )}

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
              variant="secondary"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="caution"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
    </Dialog>
  );
};