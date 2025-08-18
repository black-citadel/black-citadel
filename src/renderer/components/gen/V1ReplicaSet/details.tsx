import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ReplicaSet } from "@utils/k8s-types";
import { ReplicaSetSpecDetails } from "../V1ReplicaSetSpec/details";
import { ReplicaSetStatusDetails } from "../V1ReplicaSetStatus/details";

export const ReplicaSetDetails = ({ resourceData }: { resourceData: V1ReplicaSet }): JSX.Element => {

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
            {resourceData.spec && <ReplicaSetSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <ReplicaSetStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}