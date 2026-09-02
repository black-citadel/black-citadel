import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CronJobSpec } from "@kubernetes/client-node";
import { JobTemplateSpecDetails } from "../V1JobTemplateSpec/details";

export const CronJobSpecDetails = ({ resourceData }: { resourceData: V1CronJobSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.schedule),
        hasValue(resourceData.timeZone),
        hasValue(resourceData.concurrencyPolicy),
        hasValue(resourceData.startingDeadlineSeconds),
        hasValue(resourceData.successfulJobsHistoryLimit),
        hasValue(resourceData.failedJobsHistoryLimit),
        resourceData.suspend === true,
        hasValue(resourceData.jobTemplate),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Schedule", value: resourceData.schedule, description: "The schedule in Cron format, see https://en.wikipedia.org/wiki/Cron." },
                    { label: "Time Zone", value: resourceData.timeZone, description: "The time zone name for the given schedule, see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones." },
                    { label: "Concurrency Policy", value: resourceData.concurrencyPolicy, description: "Specifies how to treat concurrent executions of a Job." },
                    { label: "Starting Deadline Seconds", value: resourceData.startingDeadlineSeconds, description: "Optional deadline in seconds for starting the job if it misses scheduled time for any reason." },
                    { label: "Successful Jobs History Limit", value: resourceData.successfulJobsHistoryLimit, description: "The number of successful finished jobs to retain." },
                    { label: "Failed Jobs History Limit", value: resourceData.failedJobsHistoryLimit, description: "The number of failed finished jobs to retain." },
                ]}
                flags={[
                    { label: "Suspend", value: resourceData.suspend, description: "This flag tells the controller to suspend subsequent executions, it does not apply to already started executions." },
                ]}
            />

            {hasValue(resourceData.jobTemplate) && (
                <Container title="Job Template" collapsible defaultOpen={ true }>
                    <JobTemplateSpecDetails resourceData={resourceData.jobTemplate } />
                </Container>
            )}

        </>
    )
}
