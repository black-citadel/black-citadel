import { Resources } from '@utils/enums';

export interface ResourceActionsProps {
  resourceType: Resources;
  resourceName: string;
  namespace?: string;
  
  resource?: any;
  isLoading?: boolean;
  
  onDelete?: () => Promise<void>;
  onActionComplete?: (action: string, success: boolean) => void;
  onNavigate?: (path: string) => void;
  
  variant?: 'header' | 'inline' | 'compact';
  showLabels?: boolean;
  className?: string;
  
  disableDelete?: boolean;
  customActions?: CustomAction[];
}

export interface CustomAction {
  id: string;
  label: string;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  hidden?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}

export interface ResourceActionConfig {
  supportsDelete: boolean;
  supportsEdit: boolean;
  supportsPortForward: boolean;
  supportsScale: boolean;
  supportsLogs: boolean;
  supportsTerminal: boolean;
  customActions?: (resource: any) => CustomAction[];
}

export type ResourceActionConfigs = {
  [key in Resources]?: ResourceActionConfig;
};