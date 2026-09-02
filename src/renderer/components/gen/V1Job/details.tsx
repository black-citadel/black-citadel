import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1Job } from "@kubernetes/client-node";
import { JobSpecDetails } from "../V1JobSpec/details";
import { JobStatusDetails } from "../V1JobStatus/details";

export const JobDetails = ({ resourceData }: { resourceData: V1Job }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <JobSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <JobStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
