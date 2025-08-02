import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ClusterTrustBundleProjection, V1LabelSelector } from "@utils/k8s-types";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const ClusterTrustBundleProjectionDetails = ({ resourceData }: { resourceData: V1ClusterTrustBundleProjection }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.name, resourceData.path, resourceData.signerName].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.labelSelector].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Name", value: resourceData.name || '-' },
                    { label: "Path", value: resourceData.path },
                    { label: "Signer Name", value: resourceData.signerName || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Optional", value: resourceData.optional ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.labelSelector && (
                <Container title="Label Selector">
                    <LabelSelectorDetails resourceData={ resourceData.labelSelector } />
                </Container>
            )}

        </>
    )
}