import React from 'react';
import k8s from '@kubernetes/client-node';
import { ResourceUsageBar } from './resource-usage-bar';
import { parseCPU, parseBytes, formatCPU, formatBytes } from '@utils/resource-parser';

interface ContainerResourcesProps {
    container: k8s.V1Container;
    containerStatus?: k8s.V1ContainerStatus;
    containerMetrics?: any; // Metrics from metrics-server if available
}

export const ContainerResources: React.FC<ContainerResourcesProps> = ({
    container,
    containerStatus: _containerStatus,
    containerMetrics
}) => {
    // Get resource requests and limits
    const cpuRequest = parseCPU(container.resources?.requests?.cpu);
    const cpuLimit = parseCPU(container.resources?.limits?.cpu);
    const memoryRequest = parseBytes(container.resources?.requests?.memory);
    const memoryLimit = parseBytes(container.resources?.limits?.memory);

    // Get actual usage from metrics if available
    const cpuUsage = containerMetrics ? parseCPU(containerMetrics.cpu) : 0;
    const memoryUsage = containerMetrics ? parseBytes(containerMetrics.memory) : 0;

    // If no limits are set, use requests as the capacity for visualization
    const cpuCapacity = cpuLimit || cpuRequest || 1;
    const memoryCapacity = memoryLimit || memoryRequest || 1073741824; // 1Gi default

    return (
        <div className="space-y-4">
            {/* CPU */}
            {(cpuRequest > 0 || cpuLimit > 0) && (
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm font-medium">CPU</span>
                        <span className="text-xs text-zinc-500">
                            {cpuUsage > 0 && `Actual: ${formatCPU(cpuUsage)} / `}
                            {cpuRequest > 0 && `Request: ${formatCPU(cpuRequest)}`}
                            {cpuLimit > 0 && ` / Limit: ${formatCPU(cpuLimit)}`}
                        </span>
                    </div>
                    <ResourceUsageBar
                        actual={cpuUsage}
                        requested={cpuRequest}
                        capacity={cpuCapacity}
                        height={20}
                        showPercentages={true}
                    />
                </div>
            )}

            {/* Memory */}
            {(memoryRequest > 0 || memoryLimit > 0) && (
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm font-medium">Memory</span>
                        <span className="text-xs text-zinc-500">
                            {memoryUsage > 0 && `Actual: ${formatBytes(memoryUsage)} / `}
                            {memoryRequest > 0 && `Request: ${formatBytes(memoryRequest)}`}
                            {memoryLimit > 0 && ` / Limit: ${formatBytes(memoryLimit)}`}
                        </span>
                    </div>
                    <ResourceUsageBar
                        actual={memoryUsage}
                        requested={memoryRequest}
                        capacity={memoryCapacity}
                        height={20}
                        showPercentages={true}
                    />
                </div>
            )}

            {/* Show message if no resources are defined */}
            {cpuRequest === 0 && cpuLimit === 0 && memoryRequest === 0 && memoryLimit === 0 && (
                <div className="text-sm text-zinc-500">
                    No resource requests or limits defined
                </div>
            )}
        </div>
    );
};