import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CSIDriverSpec } from "@kubernetes/client-node";
import { StorageV1TokenRequestDetails } from "../StorageV1TokenRequest/details";

export const CSIDriverSpecDetails = ({ resourceData }: { resourceData: V1CSIDriverSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsGroupPolicy),
        hasValue(resourceData.volumeLifecycleModes),
        resourceData.attachRequired === true,
        resourceData.podInfoOnMount === true,
        resourceData.requiresRepublish === true,
        resourceData.seLinuxMount === true,
        resourceData.storageCapacity === true,
        hasValue(resourceData.tokenRequests),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Group Policy", value: resourceData.fsGroupPolicy, description: "fsGroupPolicy defines if the underlying volume supports changing ownership and permission of the volume before being mounted." },
                    { label: "Volume Lifecycle Modes", value: resourceData.volumeLifecycleModes, description: "volumeLifecycleModes defines what kind of volumes this CSI volume driver supports." },
                ]}
                flags={[
                    { label: "Attach Required", value: resourceData.attachRequired, description: "attachRequired indicates this CSI volume driver requires an attach operation (because it implements the CSI ControllerPublishVolume() method), and that the Kub…" },
                    { label: "Pod Info On Mount", value: resourceData.podInfoOnMount, description: "podInfoOnMount indicates this CSI volume driver requires additional pod information (like podName, podUID, etc.) during mount operations, if set to true." },
                    { label: "Requires Republish", value: resourceData.requiresRepublish, description: "requiresRepublish indicates the CSI driver wants `NodePublishVolume` being periodically called to reflect any possible change in the mounted volume." },
                    { label: "Se Linux Mount", value: resourceData.seLinuxMount, description: "seLinuxMount specifies if the CSI driver supports \"-o context\" mount option." },
                    { label: "Storage Capacity", value: resourceData.storageCapacity, description: "storageCapacity indicates that the CSI volume driver wants pod scheduling to consider the storage capacity that the driver deployment will report by creating C…" },
                ]}
            />

            {hasValue(resourceData.tokenRequests) && (
                <Container title="Token Requests" count={resourceData.tokenRequests.length} collapsible defaultOpen={ true }>
                    {resourceData.tokenRequests.map((item, index) => (
                        <PanelListItem key={index}>
                            <StorageV1TokenRequestDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
