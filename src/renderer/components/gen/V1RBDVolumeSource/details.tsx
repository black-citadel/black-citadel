import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1RBDVolumeSource } from "@utils/k8s-types";
import { LocalObjectReferenceDetails } from "../V1LocalObjectReference/details";

export const RBDVolumeSourceDetails = ({ resourceData }: { resourceData: V1RBDVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.fsType, resourceData.image, resourceData.keyring, resourceData.pool, resourceData.user].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.secretRef].some(v => v !== undefined && v !== null));
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
                    { label: "Fs Type", value: resourceData.fsType || '-' },
                    { label: "Image", value: resourceData.image },
                    { label: "Keyring", value: resourceData.keyring || '-' },
                    { label: "Pool", value: resourceData.pool || '-' },
                    { label: "User", value: resourceData.user || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Read Only", value: resourceData.readOnly ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.secretRef && (
                <Container title="Secret Ref">
                    <LocalObjectReferenceDetails resourceData={ resourceData.secretRef } />
                </Container>
            )}

        </>
    )
}