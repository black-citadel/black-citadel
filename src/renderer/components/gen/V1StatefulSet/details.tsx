import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1StatefulSet } from "@kubernetes/client-node";
import { StatefulSetSpecDetails } from "../V1StatefulSetSpec/details";
import { StatefulSetStatusDetails } from "../V1StatefulSetStatus/details";

export const StatefulSetDetails = ({ resourceData }: { resourceData: V1StatefulSet }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <StatefulSetSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <StatefulSetStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
