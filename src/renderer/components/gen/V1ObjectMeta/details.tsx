import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1ObjectMeta } from "@utils/k8s-types";
import { ManagedFieldsEntryDetails } from "../V1ManagedFieldsEntry/details";
import { OwnerReferenceDetails } from "../V1OwnerReference/details";

export const ObjectMetaDetails = ({ resourceData }: { resourceData: V1ObjectMeta }): JSX.Element => {
    // Transform the Annotations object into an array of PanelGridItem objects
    const annotationsItems = resourceData.annotations
        ? Object.entries(resourceData.annotations).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Labels object into an array of PanelGridItem objects
    const labelsItems = resourceData.labels
        ? Object.entries(resourceData.labels).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check object properties
        checks.push(annotationsItems.length > 0 || labelsItems.length > 0);
        // Check simple properties
        checks.push([resourceData.deletionGracePeriodSeconds, resourceData.generateName, resourceData.generation, resourceData.name, resourceData.namespace, resourceData.resourceVersion, resourceData.selfLink, resourceData.uid].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.managedFields, resourceData.ownerReferences].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Annotations"
                items={ annotationsItems }
                columns={1}
            />

            <PanelGrid
                title="Labels"
                items={ labelsItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Deletion Grace Period Seconds", value: resourceData.deletionGracePeriodSeconds || '-' },
                    { label: "Generate Name", value: resourceData.generateName || '-' },
                    { label: "Generation", value: resourceData.generation || '-' },
                    { label: "Name", value: resourceData.name || '-' },
                    { label: "Namespace", value: resourceData.namespace || '-' },
                    { label: "Resource Version", value: resourceData.resourceVersion || '-' },
                    { label: "Self Link", value: resourceData.selfLink || '-' },
                    { label: "Uid", value: resourceData.uid || '-' }
                ]}
                columns={1}
            />

            {resourceData.managedFields && (
                <Container title="Managed Fields">
                    {resourceData.managedFields.map((item, index) => (
                        <ManagedFieldsEntryDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.ownerReferences && (
                <Container title="Owner References">
                    {resourceData.ownerReferences.map((item, index) => (
                        <OwnerReferenceDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}