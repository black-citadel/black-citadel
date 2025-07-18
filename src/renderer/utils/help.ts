import { Resources } from "./enums";

export const ResourceHelp: { [key in Resources]: string } = {
    // General
    Welcome: "Welcome to Black Citadel - a modern Kubernetes GUI for managing your clusters.",
    
    // Cluster
    Contexts: "Defines a cluster, user, and namespace for the kubectl command-line tool to interact with the Kubernetes cluster.",
    Preferences: "Specifies user preferences for the kubectl command-line tool.",
    License: "Describes the licensing information for the cluster.",
    Nodes: "Represents a worker node in the Kubernetes cluster.",
    Events: "Provides a record of events that occur within the cluster.",
    "Custom Resource Definitions": "Allows you to define custom resources in Kubernetes.",
    Lease: "Represents a lease for a resource in the cluster.",
    Namespaces: "Provides a way to divide cluster resources between multiple users or projects.",
    
    // Workloads
    Deployments: "Manages a set of identical pods, ensuring your application runs consistently.",
    Pods: "The smallest and simplest unit in Kubernetes, representing a single instance of a running process.",
    ReplicaSets: "Maintains a stable set of replica Pods running at any given time.",
    StatefulSets: "Manages stateful applications, providing unique network identities to its Pods.",
    DaemonSets: "Ensures all (or some) nodes run a copy of a Pod.",
    Jobs: "Creates one or more Pods to perform a task and terminates once completed.",
    CronJobs: "Creates Jobs on a repeating schedule.",
  
    // Networking
    Services: "Exposes an application running on a set of Pods as a network service.",
    Ingresses: "Manages external access to services in a cluster, typically HTTP.",
    "Ingress Classes": "Specifies how different Ingress controllers should be configured.",
    Endpoints: "Defines where network traffic for a Service should be sent.",
    "Endpoint Slices": "A more scalable alternative to Endpoints for tracking Service endpoints.",
    "Network Policies": "Specifies how groups of Pods are allowed to communicate with each other.",
  
    // Configuration
    ConfigMaps: "Stores non-confidential data in key-value pairs for use by other resources.",
    Secrets: "Stores and manages sensitive information, such as passwords or API keys.",
    "Resource Quotas": "Provides constraints that limit aggregate resource consumption per namespace.",
    "Limit Ranges": "Specifies min/max compute resources usage per Pod or Container in a namespace.",
    "Horizontal Pod Autoscalers": "Automatically scales the number of Pods based on CPU utilization or custom metrics.",
    "Pod Disruption Budgets": "Ensures a minimum number of Pods are available during voluntary disruptions.",
  
    // Storage
    "Persistent Volume Claims": "Requests a specific size and access mode for storage.",
    "Persistent Volumes": "Represents a piece of storage in the cluster provisioned by an administrator.",
    "Volume Attachments": "Records the intent to attach or detach a volume to/from a node.",
    "Storage Classes": "Describes the different 'classes' of storage offered by the cluster.",
    "CSI Drivers": "Provides information about a Container Storage Interface (CSI) driver.",
    "CSI Nodes": "Contains information about which CSI drivers are running on a node.",
  
    // Access Control
    "Service Accounts": "Provides an identity for processes running in a Pod to interact with the cluster.",
    Roles: "Defines a set of permissions within a specific namespace.",
    "Role Bindings": "Grants the permissions defined in a Role to users or groups within a namespace.",
    "Cluster Roles": "Defines a set of permissions that apply across the entire cluster.",
    "Cluster Role Bindings": "Grants the permissions defined in a ClusterRole to users or groups cluster-wide.",
  
    // Administration
    "Priority Classes": "Defines the relative importance of Pods to influence scheduling and eviction decisions.",
    "Runtime Classes": "Selects the container runtime configuration to use for Pods.",
    "Mutating Webhook Configurations": "Defines webhooks that can modify objects sent to the API server.",
    "Validating Webhook Configurations": "Defines webhooks that can validate objects sent to the API server.",
    
    // Operations
    "Port Forwards": "Active port forwarding connections from local ports to Pods or Services in the cluster.",
    "MCP Server": "Model Context Protocol server that exposes Kubernetes operations as tools for AI agents.",
    Helm: "Manages Helm charts and releases for deploying applications to Kubernetes.",
    
    // Custom Resources
    "Custom Resources": "Instances of custom resource definitions that extend the Kubernetes API."
  };
