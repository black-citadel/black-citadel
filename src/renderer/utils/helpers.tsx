import React from "react";
import k8s = require('@kubernetes/client-node');
import { Status } from "@protoku-bv/design-system";


export function calculateAge(timestamp: Date | string): string {
  if (!timestamp) return 'N/A';

  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (isNaN(date.getTime())) return 'N/A';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
}

export const getReplicaStatus = (readyReplicas: number, totalReplicas: number): React.ReactNode => {
  const status = `${readyReplicas}/${totalReplicas}`;

  if (readyReplicas === totalReplicas && totalReplicas > 0) {
    return <span>{status}</span>;
  } else {
    return <span className="text-red-500">{status}</span>;
  }
};

export const getCompletions = (succeeded: number, completions: number): string => {
  return `${succeeded}/${completions}`;
};

export const getDuration = (startTime: string | Date, completionTime?: string | Date): string => {
  if (!startTime) return 'N/A';
  
  const start = new Date(startTime);
  const end = completionTime ? new Date(completionTime) : new Date();
  const durationMs = end.getTime() - start.getTime();
  
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  let result = '';
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    result += `${minutes % 60}m `;
  }
  result += `${seconds % 60}s`;

  return result.trim();
};



export const getStatus = (daemonSet: k8s.V1DaemonSet): string => {
  return `${daemonSet.status.numberReady}/${daemonSet.status.desiredNumberScheduled}`;
};

export const getHosts = (ingress: k8s.V1Ingress): string => {
  if (!ingress.spec || !ingress.spec.rules) {
    return '-';
  }
  
  const hosts = ingress.spec.rules
    .map(rule => rule.host)
    .filter(host => host !== undefined && host !== '')
    .join(', ');
  
  return hosts || '-';
};

export const getPaths = (ingress: k8s.V1Ingress): string => {
  if (!ingress.spec || !ingress.spec.rules) {
    return '-';
  }
  
  const paths = ingress.spec.rules
    .flatMap(rule => rule.http?.paths || [])
    .map(path => path.path)
    .filter(path => path !== undefined && path !== '')
    .join(', ');
  
  return paths || '-';
};

export const getTLS = (ingress: k8s.V1Ingress): string => {
  if (!ingress.spec || !ingress.spec.tls || ingress.spec.tls.length === 0) {
    return 'None';
  }
  
  const tlsHosts = ingress.spec.tls
    .flatMap(tls => tls.hosts || [])
    .join(', ');
  
  return tlsHosts || 'Configured';
};

export const formatPodStatus = (status: k8s.V1PodStatus): JSX.Element => {
  const phase = status.phase || 'Unknown';
  
  // Map pod phases to Status variants
  switch (phase) {
    case 'Running':
      return <Status variant="success">{phase}</Status>;
    case 'Succeeded':
      return <Status variant="success">{phase}</Status>;
    case 'Failed':
      return <Status variant="error">{phase}</Status>;
    case 'Pending':
      return <Status variant="warning">{phase}</Status>;
    case 'Unknown':
      return <Status variant="default">{phase}</Status>;
    default:
      return <Status variant="default">{phase}</Status>;
  }
};