import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1ReplicaSet } from "@kubernetes/client-node";
import { ReplicaSetSpecDetails } from "../V1ReplicaSetSpec/details";
import { ReplicaSetStatusDetails } from "../V1ReplicaSetStatus/details";

export const ReplicaSetDetails = ({ resourceData }: { resourceData: V1ReplicaSet }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <ReplicaSetSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <ReplicaSetStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
