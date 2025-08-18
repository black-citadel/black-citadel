import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1CronJobSpec } from "@utils/k8s-types";
import { JobTemplateSpecDetails } from "../V1JobTemplateSpec/details";

export const CronJobSpecDetails = ({ resourceData }: { resourceData: V1CronJobSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.concurrencyPolicy, resourceData.failedJobsHistoryLimit, resourceData.schedule, resourceData.startingDeadlineSeconds, resourceData.successfulJobsHistoryLimit, resourceData.timeZone].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.jobTemplate].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Concurrency Policy", value: resourceData.concurrencyPolicy || '-' },
                    { label: "Failed Jobs History Limit", value: resourceData.failedJobsHistoryLimit || '-' },
                    { label: "Schedule", value: resourceData.schedule },
                    { label: "Starting Deadline Seconds", value: resourceData.startingDeadlineSeconds || '-' },
                    { label: "Successful Jobs History Limit", value: resourceData.successfulJobsHistoryLimit || '-' },
                    { label: "Time Zone", value: resourceData.timeZone || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Suspend", value: resourceData.suspend ? "Yes" : "No" }
                ]}
                columns={1}
            />

            <Container title="Job Template">
                <JobTemplateSpecDetails resourceData={ resourceData.jobTemplate } />
            </Container>

        </>
    )
}