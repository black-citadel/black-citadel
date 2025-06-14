import { PortForwardStatus } from './enums';

export interface PortForwardInfo {
  id: string;
  resourceType: 'pod' | 'service';
  resourceName: string;
  namespace: string;
  localPort: number;
  remotePort: number;
  localAddress: string;
  status: PortForwardStatus;
  startTime: Date;
  error?: string;
  bytesTransferred?: {
    sent: number;
    received: number;
  };
}

export interface PortForwardRequest {
  resourceType: 'pod' | 'service';
  resourceName: string;
  namespace: string;
  localPort?: number; // Optional, will auto-assign if not provided
  remotePort: number;
  localAddress?: string; // Optional, defaults to 127.0.0.1
}

export interface PortOption {
  name?: string;
  port: number;
  protocol: string;
  targetPort?: number | string;
}