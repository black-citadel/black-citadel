import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1Job } from "@utils/k8s-types";
import { JobSpecDetails } from "../V1JobSpec/details";
import { JobStatusDetails } from "../V1JobStatus/details";

export const JobDetails = ({ resourceData }: { resourceData: V1Job }): JSX.Element => {

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
            {resourceData.spec && <JobSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <JobStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}