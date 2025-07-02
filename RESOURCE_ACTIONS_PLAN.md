# ResourceActions Component - Detailed Implementation Plan

## Overview
The ResourceActions component will standardize action buttons across all Kubernetes resource views in Black Citadel, providing a consistent interface for common operations like delete, port forward, and resource-specific actions.

## Component Architecture

### 1. Core ResourceActions Component

```typescript
interface ResourceActionsProps {
  // Resource identification
  resourceType: KubernetesResourceType;
  resourceName: string;
  namespace?: string;
  
  // Resource state
  resource?: any; // The full resource object
  isLoading?: boolean;
  
  // Callbacks
  onDelete?: () => Promise<void>;
  onActionComplete?: (action: string, success: boolean) => void;
  onNavigate?: (path: string) => void;
  
  // UI customization
  variant?: 'header' | 'inline' | 'compact';
  showLabels?: boolean;
  className?: string;
  
  // Feature flags
  disableDelete?: boolean;
  customActions?: CustomAction[];
}

interface CustomAction {
  id: string;
  label: string;
  icon?: React.ComponentType;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  hidden?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
}
```

### 2. Built-in Actions

#### Delete Action
- Shows delete button with trash icon
- Opens DeleteConfirmationDialog
- Handles cascading deletes for applicable resources
- Navigates to list view on success

#### Port Forward Action
- Available for Pods and Services
- Shows only when resource has exposed ports
- Opens PortForwardDialog component
- Maintains active port forward sessions

#### Edit Action (Future)
- Opens inline YAML editor
- Validates changes before applying
- Shows diff preview
- Handles apply errors gracefully

#### Scale Action (Future)
- For Deployments, ReplicaSets, StatefulSets
- Quick scale with +/- buttons
- Custom replica count input
- Shows current vs desired replicas

### 3. Resource-Specific Actions

#### Pod Actions
- Port Forward (if ports available)
- View Logs (opens logs tab)
- Execute Shell (future)
- Delete

#### Deployment Actions
- Scale
- Restart Rollout (future)
- View Pods
- Edit
- Delete

#### Service Actions
- Port Forward (if applicable)
- Edit Endpoints (future)
- Delete

#### Node Actions
- Cordon/Uncordon
- Drain (future)
- View Events
- Delete (if not master)

#### Secret Actions
- Reveal/Hide Values
- Copy to Clipboard (future)
- Edit
- Delete

### 4. Component Structure

```
components/
├── resources/
│   ├── ResourceActions/
│   │   ├── index.tsx                 # Main component
│   │   ├── ResourceActions.tsx       # Core logic
│   │   ├── ResourceActions.types.ts  # TypeScript interfaces
│   │   ├── ResourceActions.test.tsx  # Unit tests
│   │   ├── actions/
│   │   │   ├── DeleteAction.tsx      # Delete button and logic
│   │   │   ├── PortForwardAction.tsx # Port forward button
│   │   │   ├── ScaleAction.tsx       # Scale controls
│   │   │   └── CordonAction.tsx      # Node-specific action
│   │   └── utils/
│   │       ├── actionConfig.ts       # Resource type configurations
│   │       └── permissions.ts        # Action permission checks
│   └── dialogs/
│       ├── DeleteConfirmationDialog/
│       │   ├── index.tsx
│       │   └── DeleteConfirmationDialog.tsx
│       └── PortForwardDialog/
│           ├── index.tsx
│           └── PortForwardDialog.tsx
```

### 5. Implementation Phases

#### Phase 1: Core Component & Delete Action
1. Create ResourceActions component structure
2. Implement DeleteConfirmationDialog
3. Add delete action with proper callbacks
4. Test with Pod details view

#### Phase 2: Port Forward Action
1. Create PortForwardDialog component
2. Implement port detection logic
3. Add port forward action for Pods/Services
4. Handle active session management

#### Phase 3: Resource-Specific Actions
1. Add Cordon/Uncordon for Nodes
2. Add reveal/hide for Secrets
3. Implement action visibility logic
4. Add permission checks

#### Phase 4: Advanced Actions
1. Add scale action for workloads
2. Implement edit capability
3. Add restart/rollout actions
4. Create exec/attach for Pods

#### Phase 5: Polish & Integration
1. Add keyboard shortcuts
2. Implement loading states
3. Add action tooltips
4. Create comprehensive tests

### 6. Usage Examples

#### Basic Usage in Details View
```tsx
<DetailsHeader
  title={pod.metadata.name}
  resource={Resources.Pod}
  namespace={pod.metadata.namespace}
  error={error}
  tabs={[/* ... */]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
>
  <ResourceActions
    resourceType={KubernetesResourceType.Pod}
    resourceName={pod.metadata.name}
    namespace={pod.metadata.namespace}
    resource={pod}
    onDelete={handleDelete}
    onNavigate={viewProvider.navigate}
  />
</DetailsHeader>
```

#### Inline Usage in Table
```tsx
<ResourceActions
  resourceType={KubernetesResourceType.Deployment}
  resourceName={deployment.metadata.name}
  namespace={deployment.metadata.namespace}
  variant="compact"
  customActions={[
    {
      id: 'scale',
      label: 'Scale',
      onClick: () => openScaleDialog(deployment),
    }
  ]}
/>
```

### 7. Benefits

1. **Consistency**: Same actions look and behave identically everywhere
2. **Maintainability**: Single source of truth for action logic
3. **Extensibility**: Easy to add new actions or resource types
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Accessibility**: Built-in keyboard navigation and ARIA labels
6. **Permission Aware**: Can check RBAC permissions before showing actions

### 8. Migration Strategy

1. Start with new ResourceActions in one view (Pod details)
2. Gradually replace existing action implementations
3. Remove duplicate code from individual views
4. Update all views to use centralized component
5. Deprecate old patterns

### 9. Success Metrics

- Reduced code duplication (80% less action-related code)
- Consistent UX across all resource types
- Faster development of new resource views
- Easier to add new actions globally
- Better test coverage for actions

### 10. Future Enhancements

- Bulk actions for list views
- Undo/redo functionality
- Action history tracking
- Custom action plugins
- Keyboard shortcut customization
- Role-based action visibility