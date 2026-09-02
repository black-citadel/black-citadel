import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1PersistentVolumeClaim } from "@kubernetes/client-node";
import { PersistentVolumeClaimSpecDetails } from "../V1PersistentVolumeClaimSpec/details";
import { PersistentVolumeClaimStatusDetails } from "../V1PersistentVolumeClaimStatus/details";

export const PersistentVolumeClaimDetails = ({ resourceData }: { resourceData: V1PersistentVolumeClaim }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <PersistentVolumeClaimSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <PersistentVolumeClaimStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
