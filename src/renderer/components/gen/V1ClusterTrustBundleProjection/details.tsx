import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ClusterTrustBundleProjection } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const ClusterTrustBundleProjectionDetails = ({ resourceData }: { resourceData: V1ClusterTrustBundleProjection }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.path),
        hasValue(resourceData.signerName),
        resourceData.optional === true,
        hasValue(resourceData.labelSelector),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Select a single ClusterTrustBundle by object name." },
                    { label: "Path", value: resourceData.path, description: "Relative path from the volume root to write the bundle." },
                    { label: "Signer Name", value: resourceData.signerName, description: "Select all ClusterTrustBundles that match this signer name." },
                ]}
                flags={[
                    { label: "Optional", value: resourceData.optional, description: "If true, don't block pod startup if the referenced ClusterTrustBundle(s) aren't available." },
                ]}
            />

            {hasValue(resourceData.labelSelector) && (
                <Container title="Label Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.labelSelector } />
                </Container>
            )}

        </>
    )
}
