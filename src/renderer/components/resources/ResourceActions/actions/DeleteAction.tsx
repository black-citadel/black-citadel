import React, { useState } from 'react';
import { Button } from '@protoku/design-system';
import { DeleteConfirmationDialog } from '@components/dialogs/DeleteConfirmationDialog';

interface DeleteActionProps {
  resourceType: string;
  resourceName: string;
  namespace?: string;
  onDelete?: () => Promise<void>;
  onActionComplete?: (action: string, success: boolean) => void;
  disabled?: boolean;
  showLabel?: boolean;
  variant?: 'header' | 'inline' | 'compact';
  cascadeDelete?: boolean;
  onCascadeDeleteChange?: (cascade: boolean) => void;
}

export const DeleteAction: React.FC<DeleteActionProps> = ({
  resourceType,
  resourceName,
  namespace,
  onDelete,
  onActionComplete,
  disabled = false,
  showLabel: _showLabel = true,
  variant = 'header',
  cascadeDelete = false,
  onCascadeDeleteChange,
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete();
        onActionComplete?.('delete', true);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      onActionComplete?.('delete', false);
      throw error;
    }
  };

  const getButtonClass = () => {
    switch (variant) {
      case 'compact':
        return 'p-1';
      case 'inline':
        return 'px-2 py-1 text-sm';
      default:
        return '';
    }
  };

  return (
    <>
      <Button
        variant="caution"
        onClick={() => setShowDialog(true)}
        disabled={disabled}
        className={getButtonClass()}
        aria-label={`Delete ${resourceType} ${resourceName}`}
      >
        Delete
      </Button>

      <DeleteConfirmationDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDelete}
        resourceType={resourceType}
        resourceName={resourceName}
        namespace={namespace}
        cascadeDelete={cascadeDelete}
        onCascadeDeleteChange={onCascadeDeleteChange}
      />
    </>
  );
};