import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1DaemonSet } from "@kubernetes/client-node";
import { DaemonSetSpecDetails } from "../V1DaemonSetSpec/details";
import { DaemonSetStatusDetails } from "../V1DaemonSetStatus/details";

export const DaemonSetDetails = ({ resourceData }: { resourceData: V1DaemonSet }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <DaemonSetSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <DaemonSetStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
