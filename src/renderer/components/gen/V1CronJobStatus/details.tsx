import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CronJobStatus } from "@kubernetes/client-node";
import { ObjectReferenceDetails } from "../V1ObjectReference/details";

export const CronJobStatusDetails = ({ resourceData }: { resourceData: V1CronJobStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.lastScheduleTime),
        hasValue(resourceData.lastSuccessfulTime),
        hasValue(resourceData.active),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Last Schedule Time", value: resourceData.lastScheduleTime, description: "Information when was the last time the job was successfully scheduled." },
                    { label: "Last Successful Time", value: resourceData.lastSuccessfulTime, description: "Information when was the last time the job successfully completed." },
                ]}
            />

            {hasValue(resourceData.active) && (
                <Container title="Active" count={resourceData.active.length} collapsible defaultOpen={ true }>
                    {resourceData.active.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <ObjectReferenceDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
