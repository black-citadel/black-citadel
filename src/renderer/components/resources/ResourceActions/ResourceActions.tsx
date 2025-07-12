import React from 'react';
import { Button } from '@protoku/design-system';
import { DeleteAction } from './actions/DeleteAction';
import { getResourceActionConfig } from './utils/actionConfig';
import { getResourceTypeName } from './utils/resourceTypeNames';
import { ResourceActionsProps } from './ResourceActions.types';

export const ResourceActions: React.FC<ResourceActionsProps> = ({
  resourceType,
  resourceName,
  namespace,
  resource,
  isLoading = false,
  onDelete,
  onActionComplete,
  onNavigate,
  variant = 'header',
  showLabels = true,
  className = '',
  disableDelete = false,
  customActions = [],
}) => {
  const config = getResourceActionConfig(resourceType);
  
  const handleActionClick = async (action: typeof customActions[0]) => {
    if (action.requiresConfirmation && action.confirmationMessage) {
      if (!confirm(action.confirmationMessage)) {
        return;
      }
    }
    
    try {
      await action.onClick();
      onActionComplete?.(action.id, true);
    } catch (error) {
      console.error(`Action ${action.id} failed:`, error);
      onActionComplete?.(action.id, false);
    }
  };

  const getButtonVariantClass = (_actionVariant?: string) => {
    if (variant === 'compact') return 'p-1';
    if (variant === 'inline') return 'px-2 py-1 text-sm';
    return '';
  };

  const getResourceCustomActions = () => {
    if (config.customActions && resource) {
      return config.customActions(resource);
    }
    return [];
  };

  const allCustomActions = [...getResourceCustomActions(), ...customActions];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Custom Actions */}
      {allCustomActions.map((action) => {
        if (action.hidden) return null;
        
        const isPrimary = action.variant === 'primary';
        
        return (
          <Button
            key={action.id}
            variant={isPrimary ? 'primary' : 'secondary'}
            onClick={() => handleActionClick(action)}
            disabled={action.disabled || isLoading}
            className={getButtonVariantClass(action.variant)}
            aria-label={action.label}
          >
            {action.label}
          </Button>
        );
      })}

      {/* Delete Action */}
      {config.supportsDelete && !disableDelete && onDelete && (
        <DeleteAction
          resourceType={getResourceTypeName(resourceType)}
          resourceName={resourceName}
          namespace={namespace}
          onDelete={onDelete}
          onActionComplete={onActionComplete}
          disabled={isLoading}
          showLabel={showLabels}
          variant={variant}
        />
      )}
    </div>
  );
};