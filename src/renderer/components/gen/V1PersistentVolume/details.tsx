import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1PersistentVolume } from "@kubernetes/client-node";
import { PersistentVolumeSpecDetails } from "../V1PersistentVolumeSpec/details";
import { PersistentVolumeStatusDetails } from "../V1PersistentVolumeStatus/details";

export const PersistentVolumeDetails = ({ resourceData }: { resourceData: V1PersistentVolume }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.spec, resourceData.status].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.spec && <PersistentVolumeSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <PersistentVolumeStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}