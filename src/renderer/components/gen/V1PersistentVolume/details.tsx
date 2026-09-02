import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1PersistentVolume } from "@kubernetes/client-node";
import { PersistentVolumeSpecDetails } from "../V1PersistentVolumeSpec/details";
import { PersistentVolumeStatusDetails } from "../V1PersistentVolumeStatus/details";

export const PersistentVolumeDetails = ({ resourceData }: { resourceData: V1PersistentVolume }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
        hasValue(resourceData.status),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <PersistentVolumeSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <PersistentVolumeStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
