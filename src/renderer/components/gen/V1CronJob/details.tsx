import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1CronJob } from "@kubernetes/client-node";
import { CronJobSpecDetails } from "../V1CronJobSpec/details";
import { CronJobStatusDetails } from "../V1CronJobStatus/details";

export const CronJobDetails = ({ resourceData }: { resourceData: V1CronJob }): JSX.Element => {

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

            {hasValue(resourceData.spec) && <CronJobSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <CronJobStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
