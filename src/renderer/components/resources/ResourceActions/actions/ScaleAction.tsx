import React, { useState } from 'react';
import { Button } from '@protoku/design-system';
import { ScaleDeploymentDialog } from '@components/dialogs/ScaleDeploymentDialog';

interface ScaleActionProps {
  resourceName: string;
  namespace: string;
  currentReplicas: number;
  onScale: (replicas: number) => Promise<void>;
  onActionComplete?: (action: string, success: boolean) => void;
  disabled?: boolean;
  showLabel?: boolean;
  variant?: 'header' | 'inline' | 'compact';
}

export const ScaleAction: React.FC<ScaleActionProps> = ({
  resourceName,
  namespace,
  currentReplicas,
  onScale,
  onActionComplete,
  disabled = false,
  _showLabel = true,
  variant = 'header',
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleScale = async (replicas: number) => {
    try {
      await onScale(replicas);
      onActionComplete?.('scale', true);
    } catch (error) {
      console.error('Scale failed:', error);
      onActionComplete?.('scale', false);
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
        variant="secondary"
        onClick={() => setShowDialog(true)}
        disabled={disabled}
        className={getButtonClass()}
        aria-label={`Scale deployment ${resourceName}`}
      >
        Scale
      </Button>

      <ScaleDeploymentDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleScale}
        resourceName={resourceName}
        namespace={namespace}
        currentReplicas={currentReplicas}
      />
    </>
  );
};