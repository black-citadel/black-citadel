import React from 'react';
import k8s from '@kubernetes/client-node';
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@components/base/description-list';
import { Badge } from '@components/base/badge';
import { calculateAge } from '@utils/helpers';

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
                        <DescriptionDetails>{capacity.cpu || 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Memory</DescriptionTerm>
                        <DescriptionDetails>{capacity.memory || 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Pods</DescriptionTerm>
                        <DescriptionDetails>{capacity.pods || 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Ephemeral Storage</DescriptionTerm>
                        <DescriptionDetails>{capacity['ephemeral-storage'] || 'N/A'}</DescriptionDetails>
                    </DescriptionList>
                </div>

                <div className="border p-4 rounded-md border-neutral-800">
                    <h3 className="text-sm font-medium mb-3">Allocatable</h3>
                    <DescriptionList>
                        <DescriptionTerm>CPU</DescriptionTerm>
                        <DescriptionDetails>{allocatable.cpu || 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Memory</DescriptionTerm>
                        <DescriptionDetails>{allocatable.memory || 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Pods</DescriptionTerm>
                        <DescriptionDetails>{allocatable.pods || 'N/A'}</DescriptionDetails>
                        <DescriptionTerm>Ephemeral Storage</DescriptionTerm>
                        <DescriptionDetails>{allocatable['ephemeral-storage'] || 'N/A'}</DescriptionDetails>
                    </DescriptionList>
                </div>
            </div>

            {/* Resource Usage (if metrics available) */}
            {nodeMetrics && (
                <div className="border p-4 rounded-md border-neutral-800">
                    <h3 className="text-sm font-medium mb-3">Resource Usage</h3>
                    <DescriptionList>
                        <DescriptionTerm>CPU Usage</DescriptionTerm>
                        <DescriptionDetails>
                            <div className="space-y-1">
                                <div className="text-sm">
                                    Limits: {nodeMetrics.CPU.LimitTotal} / Requests: {nodeMetrics.CPU.RequestTotal} / Capacity: {nodeMetrics.CPU.Capacity}
                                </div>
                                <div className="text-sm text-zinc-500">
                                    {((Number(nodeMetrics.CPU.RequestTotal) / Number(nodeMetrics.CPU.Capacity)) * 100).toFixed(2)}% of capacity requested
                                </div>
                            </div>
                        </DescriptionDetails>
                        <DescriptionTerm>Memory Usage</DescriptionTerm>
                        <DescriptionDetails>
                            <div className="space-y-1">
                                <div className="text-sm">
                                    Requests: {nodeMetrics.Memory.RequestTotal} / Capacity: {nodeMetrics.Memory.Capacity}
                                </div>
                                <div className="text-sm text-zinc-500">
                                    {((Number(nodeMetrics.Memory.RequestTotal) / Number(nodeMetrics.Memory.Capacity)) * 100).toFixed(2)}% of capacity requested
                                </div>
                            </div>
                        </DescriptionDetails>
                    </DescriptionList>
                </div>
            )}

            {/* Conditions */}
            <div className="border p-4 rounded-md border-neutral-800">
                <h3 className="text-sm font-medium mb-3">Conditions</h3>
                <div className="space-y-2">
                    {conditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
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