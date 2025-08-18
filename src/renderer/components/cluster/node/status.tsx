import React from 'react';
import k8s from '@kubernetes/client-node';
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@components/base/description-list';
import { ResourceUsageBar } from '@components/base/resource-usage-bar';
import { parseCPU, parseBytes, formatCPU, formatBytes } from '@utils/resource-parser';
import { Container } from '@components/base/container';
import { ConditionsTable } from '@components/base/conditions-table';

interface Props {
    node?: k8s.V1Node;
    nodeMetrics?: any;
}

export const NodeStatus2 = ({ node, nodeMetrics }: Props): JSX.Element => {
    if (!node?.status) return <></>;

    const conditions = node.status.conditions || [];
    const addresses = node.status.addresses || [];
    const nodeInfo = node.status.nodeInfo;
    const capacity = node.status.capacity || {};
    const allocatable = node.status.allocatable || {};

    return (
        <>




            {/* Resource Capacity, Allocatable & Usage */}
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <Container title="Capacity">
                        <DescriptionList>
                            <DescriptionTerm>CPU</DescriptionTerm>
                            <DescriptionDetails>
                                {capacity.cpu ? (
                                    <>
                                        {capacity.cpu} cores ({formatCPU(parseCPU(capacity.cpu))})
                                    </>
                                ) : 'N/A'}
                            </DescriptionDetails>
                            <DescriptionTerm>Memory</DescriptionTerm>
                            <DescriptionDetails>{capacity.memory ? formatBytes(parseBytes(capacity.memory)) : 'N/A'}</DescriptionDetails>
                            <DescriptionTerm>Pods</DescriptionTerm>
                            <DescriptionDetails>{capacity.pods || 'N/A'}</DescriptionDetails>
                            <DescriptionTerm>Ephemeral Storage</DescriptionTerm>
                            <DescriptionDetails>{capacity['ephemeral-storage'] ? formatBytes(parseBytes(capacity['ephemeral-storage'])) : 'N/A'}</DescriptionDetails>
                        </DescriptionList>
                    </Container>
                </div>

                <div>
                    <Container title="Allocatable">
                        <DescriptionList>
                            <DescriptionTerm>CPU</DescriptionTerm>
                            <DescriptionDetails>
                                {allocatable.cpu ? (
                                    <>
                                        {allocatable.cpu} cores ({formatCPU(parseCPU(allocatable.cpu))})
                                    </>
                                ) : 'N/A'}
                            </DescriptionDetails>
                            <DescriptionTerm>Memory</DescriptionTerm>
                            <DescriptionDetails>{allocatable.memory ? formatBytes(parseBytes(allocatable.memory)) : 'N/A'}</DescriptionDetails>
                            <DescriptionTerm>Pods</DescriptionTerm>
                            <DescriptionDetails>{allocatable.pods || 'N/A'}</DescriptionDetails>
                            <DescriptionTerm>Ephemeral Storage</DescriptionTerm>
                            <DescriptionDetails>{allocatable['ephemeral-storage'] ? formatBytes(parseBytes(allocatable['ephemeral-storage'])) : 'N/A'}</DescriptionDetails>
                        </DescriptionList>
                    </Container>
                </div>

                <div>
                    {nodeMetrics && (
                        <Container title="Resource Usage">
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
                        </Container>
                    )}
                </div>
            </div>






            {/* Conditions - Full Width */}
            {conditions.length > 0 && <ConditionsTable conditions={conditions} />}





            <div className="grid grid-cols-2 gap-4">
            <div>
            <Container title="Node Information">
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
            </Container>
</div>
            <div>

            {/* Addresses */}
            {addresses.length > 0 && (
                <Container title="Addresses">
                    <DescriptionList>
                        {addresses.map((address, index) => (
                            <React.Fragment key={index}>
                                <DescriptionTerm>{address.type || 'Unknown'}</DescriptionTerm>
                                <DescriptionDetails>{address.address}</DescriptionDetails>
                            </React.Fragment>
                        ))}
                    </DescriptionList>
                </Container>
            )}

</div>
</div>

        </>
    );
};