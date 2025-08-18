import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1Deployment } from "@utils/k8s-types";
import { DeploymentSpecDetails } from "../V1DeploymentSpec/details";
import { DeploymentStatusDetails } from "../V1DeploymentStatus/details";

export const DeploymentDetails = ({ resourceData }: { resourceData: V1Deployment }): JSX.Element => {

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
            {resourceData.spec && <DeploymentSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <DeploymentStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}