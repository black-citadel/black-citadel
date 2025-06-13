import React from 'react';
import k8s from '@kubernetes/client-node';
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@components/base/description-list';
import { Badge } from '@components/base/badge';
import { calculateAge } from '@utils/helpers';
import { ResourceUsageBar } from '@components/base/resource-usage-bar';
import { parseCPU, parseBytes, formatCPU, formatBytes } from '@utils/resource-parser';

interface Props {
    node?: k8s.V1Node;
    nodeMetrics?: any;
}

export const NodeStatus = ({ node, nodeMetrics }: Props): JSX.Element => {
    if (!node?.status) return <></>;

    const conditions = node.status.conditions || [];
    const addresses = node.status.addresses || [];
    const nodeInfo = node.status.nodeInfo;
    const capacity = node.status.capacity || {};
    const allocatable = node.status.allocatable || {};

    return (
        <div className="space-y-6">
            {/* Node Information */}
            <div className="border p-4 rounded-md border-neutral-800">
                <h3 className="text-sm font-medium mb-3">Node Information</h3>
                <DescriptionList>
                    {nodeInfo?.kubeletVersion && (
                        <>
                            <DescriptionTerm>Kubelet Version</DescriptionTerm>
                            <DescriptionDetails>{nodeInfo.kubeletVersion}</DescriptionDetails>
                        </>
                    )}
                    {nodeInfo?.containerRuntimeVersion && (
                        <>
                            <DescriptionTerm>Container Runtime</DescriptionTerm>
                            <DescriptionDetails>{nodeInfo.containerRuntimeVersion}</DescriptionDetails>
                        </>
                    )}
                    {nodeInfo?.osImage && (
                        <>
                            <DescriptionTerm>OS Image</DescriptionTerm>
                            <DescriptionDetails>{nodeInfo.osImage}</DescriptionDetails>
                        </>
                    )}
                    {nodeInfo?.kernelVersion && (
                        <>
                            <DescriptionTerm>Kernel Version</DescriptionTerm>
                            <DescriptionDetails>{nodeInfo.kernelVersion}</DescriptionDetails>
                        </>
                    )}
                    {nodeInfo?.architecture && (
                        <>
                            <DescriptionTerm>Architecture</DescriptionTerm>
                            <DescriptionDetails>{nodeInfo.architecture}</DescriptionDetails>
                        </>
                    )}
                </DescriptionList>
            </div>

            {/* Addresses */}
            {addresses.length > 0 && (
                <div className="border p-4 rounded-md border-neutral-800">
                    <h3 className="text-sm font-medium mb-3">Addresses</h3>
                    <DescriptionList>
                        {addresses.map((address, index) => (
                            <React.Fragment key={index}>
                                <DescriptionTerm>{address.type || 'Unknown'}</DescriptionTerm>
                                <DescriptionDetails>{address.address}</DescriptionDetails>
                            </React.Fragment>
                        ))}
                    </DescriptionList>
                </div>
            )}

            {/* Resource Capacity & Allocatable */}
            <div className="grid grid-cols-2 gap-4">
                <div className="border p-4 rounded-md border-neutral-800">
                    <h3 className="text-sm font-medium mb-3">Capacity</h3>
                    <DescriptionList>
                        <DescriptionTerm>CPU</DescriptionTerm>
                        <DescriptionDetails>{capacity.cpu ? formatCPU(parseCPU(capacity.cpu)) : 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Memory</DescriptionTerm>
                        <DescriptionDetails>{capacity.memory ? formatBytes(parseBytes(capacity.memory)) : 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Pods</DescriptionTerm>
                        <DescriptionDetails>{capacity.pods || 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Ephemeral Storage</DescriptionTerm>
                        <DescriptionDetails>{capacity['ephemeral-storage'] ? formatBytes(parseBytes(capacity['ephemeral-storage'])) : 'N/A'}</DescriptionDetails>
                    </DescriptionList>
                </div>

                <div className="border p-4 rounded-md border-neutral-800">
                    <h3 className="text-sm font-medium mb-3">Allocatable</h3>
                    <DescriptionList>
                        <DescriptionTerm>CPU</DescriptionTerm>
                        <DescriptionDetails>{allocatable.cpu ? formatCPU(parseCPU(allocatable.cpu)) : 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Memory</DescriptionTerm>
                        <DescriptionDetails>{allocatable.memory ? formatBytes(parseBytes(allocatable.memory)) : 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Pods</DescriptionTerm>
                        <DescriptionDetails>{allocatable.pods || 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Ephemeral Storage</DescriptionTerm>
                        <DescriptionDetails>{allocatable['ephemeral-storage'] ? formatBytes(parseBytes(allocatable['ephemeral-storage'])) : 'N/A'}</DescriptionDetails>
                    </DescriptionList>
                </div>
            </div>

            {/* Resource Usage (if metrics available) */}
            {nodeMetrics && (
                <div className="border p-4 rounded-md border-neutral-800">
                    <h3 className="text-sm font-medium mb-3">Resource Usage</h3>
                    <div className="space-y-4">
                        {/* CPU Usage */}
                        <div>
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-sm font-medium">CPU</span>
                                <span className="text-xs text-zinc-500">
                                    Actual: {formatCPU(parseCPU(nodeMetrics.CPU.CurrentUsage || 0))} / 
                                    Requested: {formatCPU(parseCPU(nodeMetrics.CPU.RequestTotal))} / 
                                    Capacity: {formatCPU(parseCPU(nodeMetrics.CPU.Capacity))}
                                </span>
                            </div>
                            <ResourceUsageBar
                                actual={parseCPU(nodeMetrics.CPU.CurrentUsage || 0)}
                                requested={parseCPU(nodeMetrics.CPU.RequestTotal)}
                                capacity={parseCPU(nodeMetrics.CPU.Capacity)}
                                height={24}
                            />
                        </div>

                        {/* Memory Usage */}
                        <div>
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-sm font-medium">Memory</span>
                                <span className="text-xs text-zinc-500">
                                    Actual: {formatBytes(parseBytes(nodeMetrics.Memory.CurrentUsage || 0))} / 
                                    Requested: {formatBytes(parseBytes(nodeMetrics.Memory.RequestTotal))} / 
                                    Capacity: {formatBytes(parseBytes(nodeMetrics.Memory.Capacity))}
                                </span>
                            </div>
                            <ResourceUsageBar
                                actual={parseBytes(nodeMetrics.Memory.CurrentUsage || 0)}
                                requested={parseBytes(nodeMetrics.Memory.RequestTotal)}
                                capacity={parseBytes(nodeMetrics.Memory.Capacity)}
                                height={24}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Conditions */}
            <div className="border p-4 rounded-md border-neutral-800">
                <h3 className="text-sm font-medium mb-3">Conditions</h3>
                <div className="space-y-2">
                    {conditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-neutral-800 border-b last:border-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{condition.type}</span>
                                <Badge variant={condition.status === 'True' ? 'success' : 'secondary'}>
                                    {condition.status}
                                </Badge>
                            </div>
                            <div className="text-sm text-zinc-500">
                                {condition.lastTransitionTime && calculateAge(new Date(condition.lastTransitionTime))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};