# Black Citadel Components Guide

This document outlines reusable components in the Black Citadel Kubernetes GUI, both existing and proposed, to maintain UI consistency and improve code reusability.

## Existing Reusable Components

### Base Components (`src/renderer/components/base/`)
These foundational components are already extracted and widely used:

- **Form Elements**: `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Listbox`
- **Layout**: `SidebarLayout`, `StackedLayout`, `Sidebar`, `Navbar`
- **UI Elements**: `Button`, `Badge`, `Alert`, `Dialog`, `Drawer`, `EmptyState`
- **Data Display**: `Table`, `DescriptionList`, `Pagination`, `ResourceUsageBar`
- **Typography**: `Heading`, `Text`, `Link`
- **Structural**: `Fieldset`, `Divider`, `Avatar`, `Logo`

### Common Components (`src/renderer/components/common/`)
- **Headers**: `ListHeader`, `DetailsHeader`, `CreateHeader`
- **Dropdowns**: `NamespaceDropdown`, `ContextDropdown`
- **Editor**: YAML/JSON editor
- **Metadata**: `MetadataDetails`
- **Help**: `HelpButton`

### Form Components (`src/renderer/components/form/`)
- `FieldLabels` - Key-value editor for labels
- `FieldAnnotations` - Key-value editor for annotations
- `FieldData` - Key-value editor for ConfigMap/Secret data
- `FieldNamespaceSelect` - Namespace selection dropdown

## Proposed Components for Extraction

### High Priority

#### 1. **useResourceData Hook**
Standardize data fetching across all views:
- Unified error handling
- Automatic polling with configurable intervals
- Loading states
- Caching support

#### 2. **ResourceActions Component**
Consolidate common resource actions:
- Edit/Apply button
- Delete button with confirmation
- Port forward button (when applicable)
- Custom actions per resource type

#### 3. **StatusBadge Component**
Unified status indicator for all resources:
- Pod phases (Running, Pending, Failed, etc.)
- Deployment conditions
- Service types
- Generic status states with color coding

#### 4. **LoadingState & SkeletonLoader Components**
Consistent loading experiences:
- Full-page loading spinner
- Inline loading indicators
- Skeleton screens for tables and details
- Refresh indicators

#### 5. **TabNavigation Component**
Reusable tab navigation for details views:
- Consistent styling
- Keyboard navigation support
- Active state management
- Lazy loading of tab content

#### 6. **DeleteConfirmationDialog Component**
Standardized delete flow:
- Resource type and name display
- Cascade deletion warnings
- Force deletion option
- Consistent messaging

### Medium Priority

#### 7. **ResourceListLayout Component**
Template for all list views:
- Header with title, help, namespace dropdown, create button
- Table with pagination
- Error and empty states
- Loading states

#### 8. **ResourceDetailsLayout Component**
Template for all details views:
- Header with resource info and actions
- Tab navigation
- Content area management
- Consistent spacing and layout

#### 9. **ResourceCreateLayout Component**
Template for all create views:
- Header
- Two-column layout (form + YAML preview)
- Validation messaging
- Submit/cancel actions

#### 10. **ValidationMessage Component**
Form validation display:
- Field-level errors
- Form-level errors
- Warning messages
- Success feedback

#### 11. **ResourceMetric Component**
Display metrics consistently:
- Ready/Desired replicas
- Resource usage (CPU/Memory)
- Quota usage
- Progress indicators

### Low Priority

#### 12. **ResourceIcon Component**
Centralized icon management:
- Resource type icons
- Status icons
- Action icons
- Consistent sizing

#### 13. **ToastNotification System**
User feedback for actions:
- Success messages
- Error notifications
- Progress indicators
- Dismissible alerts

#### 14. **KeyboardShortcuts Component**
Keyboard navigation helper:
- Display available shortcuts
- Context-aware shortcuts
- Customizable bindings

#### 15. **BreadcrumbNavigation Component**
Navigation context display:
- Current location
- Parent resources
- Quick navigation

## Common Patterns to Componentize

### Error Handling Pattern
Currently duplicated in 84+ files. Create a unified approach:
```typescript
// Current pattern (repeated everywhere)
try {
  const data = await window.electronAPI.someMethod();
  setData(data);
  setError(null);
} catch (e) {
  console.error("Failed to fetch:", e);
  setError("Failed to fetch resource.");
}
```

### Polling Pattern
Used in all list and details views:
```typescript
// Current pattern (repeated everywhere)
useEffect(() => {
  fetchData();
  const intervalId = setInterval(fetchData, 5000);
  return () => clearInterval(intervalId);
}, []);
```

### Resource Link Pattern
Every resource has its own link component with similar structure:
- Icon
- Resource name
- Namespace (if applicable)
- Navigation logic

## Implementation Guidelines

### Component Structure
```
components/
├── base/          # Foundational UI components
├── common/        # Shared components across features
├── form/          # Form-specific components
├── layouts/       # Page layout templates
├── patterns/      # Common UI patterns
└── resources/     # Resource-specific components
```

### Best Practices
1. **Type Safety**: Define clear TypeScript interfaces for all components
2. **Accessibility**: Follow ARIA guidelines, support keyboard navigation
3. **Performance**: Use React.memo for frequently re-rendered components
4. **Documentation**: Include JSDoc comments and usage examples
5. **Testing**: Write unit tests for all new components
6. **Flexibility**: Design components to be customizable via props
7. **Consistency**: Follow existing naming conventions and patterns

## Migration Strategy

1. **Phase 1**: Extract high-priority components without breaking existing code
2. **Phase 2**: Gradually migrate existing views to use new components
3. **Phase 3**: Remove duplicated code and patterns
4. **Phase 4**: Add tests and documentation
5. **Phase 5**: Optimize and refine based on usage

## Benefits

- **Consistency**: Uniform UI/UX across all resource types
- **Maintainability**: Changes in one place affect all usages
- **Development Speed**: Faster to add new resource types
- **Code Quality**: Reduced duplication and bugs
- **Testing**: Easier to test isolated components