import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1Deployment } from "@kubernetes/client-node";
import { DeploymentSpecDetails } from "../V1DeploymentSpec/details";
import { DeploymentStatusDetails } from "../V1DeploymentStatus/details";

export const DeploymentDetails = ({ resourceData }: { resourceData: V1Deployment }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <DeploymentSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <DeploymentStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
