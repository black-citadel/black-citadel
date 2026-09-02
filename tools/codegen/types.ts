export interface PropertyInfo {
  type: string;
  optional?: boolean;
  description?: string;
}

export interface ResourceMetaConfig {
  resourceName: string;
  description?: string;
  properties: Record<string, PropertyInfo>;
}

export interface K8sResource {
  type: string;
  order?: string[];
  electronAPI?: {
    read: string;
    delete: string;
  };
}

export interface K8sResourceConfig {
  [key: string]: K8sResource;
}