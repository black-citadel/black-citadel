import { Container } from "@components/base/container";
import { V1EphemeralVolumeSource } from "@utils/k8s-types";
import { PersistentVolumeClaimTemplateDetails } from "../V1PersistentVolumeClaimTemplate/details";

export const EphemeralVolumeSourceDetails = ({ resourceData }: { resourceData: V1EphemeralVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.volumeClaimTemplate].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.volumeClaimTemplate && (
                <Container title="Volume Claim Template">
                    <PersistentVolumeClaimTemplateDetails resourceData={ resourceData.volumeClaimTemplate } />
                </Container>
            )}

        </>
    )
}