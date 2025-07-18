export enum Resources {
    // General
    Welcome = 'Welcome',
    
    // Settings
    Contexts = "Contexts",
    Preferences = 'Preferences',
    License = 'License',

    // Cluster
    Nodes = "Nodes",
    Namespaces = 'Namespaces',
    Events = 'Events',
    CustomResourceDefinitions = 'Custom Resource Definitions',
    CustomResources = 'Custom Resources',
    Lease = 'Lease',

    // Workloads
    Deployments = 'Deployments',
    Pods = 'Pods',
    ReplicaSets = 'ReplicaSets',
    StatefulSets = 'StatefulSets',
    DaemonSets = 'DaemonSets',
    Jobs = 'Jobs',
    CronJobs = 'CronJobs',

    // Networking
    Services = 'Services',
    Ingresses = 'Ingresses',
    IngressClasses = 'Ingress Classes',
    Endpoints = 'Endpoints',
    EndpointSlices = 'Endpoint Slices',
    NetworkPolicies = 'Network Policies',

    // Configuration
    ConfigMaps = 'ConfigMaps',
    Secrets = 'Secrets',
    ResourceQuotas = 'Resource Quotas',
    LimitRanges = 'Limit Ranges',
    HorizontalPodAutoscalers = 'Horizontal Pod Autoscalers',
    PodDisruptionBudgets = 'Pod Disruption Budgets',

    // Storage
    PersistentVolumeClaims = 'Persistent Volume Claims',
    PersistentVolumes = 'Persistent Volumes',
    VolumeAttachments = 'Volume Attachments',
    StorageClasses = 'Storage Classes',
    CSIDrivers = 'CSI Drivers',
    CSINodes = 'CSI Nodes',

    // Access Control
    ServiceAccounts = 'Service Accounts',
    Roles = 'Roles',
    RoleBindings = 'Role Bindings',
    ClusterRoles = 'Cluster Roles',
    ClusterRoleBindings = 'Cluster Role Bindings',

    // Administration
    PriorityClasses = 'Priority Classes',
    RuntimeClasses = 'Runtime Classes',
    MutatingWebhookConfigurations = 'Mutating Webhook Configurations',
    ValidatingWebhookConfigurations = 'Validating Webhook Configurations',
    
    // Operations
    PortForwards = 'Port Forwards',
    MCPServer = 'MCP Server',
    Helm = 'Helm'
}

export enum ResourceAction {
    List,
    Details,
    Create
}

export enum ResourceTabs {
    Details = 'Details',
    Environment = 'Environment',
    Logs = 'Logs',
    Terminal = 'Terminal',
    Events = 'Events',
    YAML = 'YAML',
    Pods = 'Pods',
    Images = 'Images'
}

export enum PortForwardStatus {
    Connecting = 'Connecting',
    Active = 'Active',
    Failed = 'Failed',
    Stopping = 'Stopping'
}