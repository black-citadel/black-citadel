import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1EphemeralVolumeSource } from "@kubernetes/client-node";
import { PersistentVolumeClaimTemplateDetails } from "../V1PersistentVolumeClaimTemplate/details";

export const EphemeralVolumeSourceDetails = ({ resourceData }: { resourceData: V1EphemeralVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.volumeClaimTemplate),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.volumeClaimTemplate) && (
                <Container title="Volume Claim Template" collapsible defaultOpen={ true }>
                    <PersistentVolumeClaimTemplateDetails resourceData={resourceData.volumeClaimTemplate } />
                </Container>
            )}

        </>
    )
}
