import { Container } from "@components/base/container";
import type { V1CronJobStatus } from "@kubernetes/client-node";
import { ObjectReferenceDetails } from "../V1ObjectReference/details";

export const CronJobStatusDetails = ({ resourceData }: { resourceData: V1CronJobStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.active].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.active && (
                <Container title="Active">
                    {resourceData.active.map((item, index) => (
                        <ObjectReferenceDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}