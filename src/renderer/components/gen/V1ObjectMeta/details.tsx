import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ObjectMeta } from "@kubernetes/client-node";
import { ManagedFieldsEntryDetails } from "../V1ManagedFieldsEntry/details";
import { OwnerReferenceDetails } from "../V1OwnerReference/details";

export const ObjectMetaDetails = ({ resourceData }: { resourceData: V1ObjectMeta }): JSX.Element => {
    const annotationsItems = Object.entries(resourceData.annotations ?? {}).map(([key, value]) => ({ label: key, value }));
    const labelsItems = Object.entries(resourceData.labels ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        annotationsItems.length > 0,
        labelsItems.length > 0,
        hasValue(resourceData.creationTimestamp),
        hasValue(resourceData.deletionGracePeriodSeconds),
        hasValue(resourceData.deletionTimestamp),
        hasValue(resourceData.finalizers),
        hasValue(resourceData.generateName),
        hasValue(resourceData.generation),
        hasValue(resourceData.name),
        hasValue(resourceData.namespace),
        hasValue(resourceData.resourceVersion),
        hasValue(resourceData.selfLink),
        hasValue(resourceData.uid),
        hasValue(resourceData.managedFields),
        hasValue(resourceData.ownerReferences),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Creation Timestamp", value: resourceData.creationTimestamp, description: "CreationTimestamp is a timestamp representing the server time when this object was created." },
                    { label: "Deletion Grace Period Seconds", value: resourceData.deletionGracePeriodSeconds, description: "Number of seconds allowed for this object to gracefully terminate before it will be removed from the system." },
                    { label: "Deletion Timestamp", value: resourceData.deletionTimestamp, description: "DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted." },
                    { label: "Finalizers", value: resourceData.finalizers, description: "Must be empty before the object is deleted from the registry." },
                    { label: "Generate Name", value: resourceData.generateName, description: "GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided." },
                    { label: "Generation", value: resourceData.generation, description: "A sequence number representing a specific generation of the desired state." },
                    { label: "Name", value: resourceData.name, description: "Name must be unique within a namespace." },
                    { label: "Namespace", value: resourceData.namespace, description: "Namespace defines the space within which each name must be unique." },
                    { label: "Resource Version", value: resourceData.resourceVersion, description: "An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed." },
                    { label: "Self Link", value: resourceData.selfLink, description: "Deprecated: selfLink is a legacy read-only field that is no longer populated by the system." },
                    { label: "Uid", value: resourceData.uid, description: "UID is the unique in time and space value for this object." },
                ]}
            />

            <PanelGrid title="Annotations" items={ annotationsItems } />

            <PanelGrid title="Labels" items={ labelsItems } />

            {hasValue(resourceData.managedFields) && (
                <Container title="Managed Fields" count={resourceData.managedFields.length} collapsible defaultOpen={ false }>
                    {resourceData.managedFields.map((item, index) => (
                        <PanelListItem key={index}>
                            <ManagedFieldsEntryDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.ownerReferences) && (
                <Container title="Owner References" count={resourceData.ownerReferences.length} collapsible defaultOpen={ false }>
                    {resourceData.ownerReferences.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <OwnerReferenceDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
