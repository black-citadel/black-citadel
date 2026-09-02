import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1CronJob } from "@kubernetes/client-node";
import { CronJobSpecDetails } from "../V1CronJobSpec/details";
import { CronJobStatusDetails } from "../V1CronJobStatus/details";

export const CronJobDetails = ({ resourceData }: { resourceData: V1CronJob }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.spec, resourceData.status].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.spec && <CronJobSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <CronJobStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}