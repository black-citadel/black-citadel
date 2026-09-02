import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1FlexPersistentVolumeSource } from "@kubernetes/client-node";
import { SecretReferenceDetails } from "../V1SecretReference/details";

export const FlexPersistentVolumeSourceDetails = ({ resourceData }: { resourceData: V1FlexPersistentVolumeSource }): JSX.Element => {
    // Transform the Options object into an array of PanelGridItem objects
    const optionsItems = resourceData.options
        ? Object.entries(resourceData.options).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check object properties
        checks.push(optionsItems.length > 0);
        // Check simple properties
        checks.push([resourceData.driver, resourceData.fsType].some(v => v !== undefined && v !== null));
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
                title="Options"
                items={ optionsItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Driver", value: resourceData.driver },
                    { label: "Fs Type", value: resourceData.fsType || '-' }
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
                    <SecretReferenceDetails resourceData={ resourceData.secretRef } />
                </Container>
            )}

        </>
    )
}