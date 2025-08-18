import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1PersistentVolumeClaim } from "@utils/k8s-types";
import { PersistentVolumeClaimSpecDetails } from "../V1PersistentVolumeClaimSpec/details";
import { PersistentVolumeClaimStatusDetails } from "../V1PersistentVolumeClaimStatus/details";

export const PersistentVolumeClaimDetails = ({ resourceData }: { resourceData: V1PersistentVolumeClaim }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.spec, resourceData.status].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.spec && <PersistentVolumeClaimSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <PersistentVolumeClaimStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}