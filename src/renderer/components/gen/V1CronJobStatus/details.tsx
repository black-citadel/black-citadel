import { Container } from "@components/base/container";
import { V1CronJobStatus } from "@utils/k8s-types";
import { ObjectReferenceDetails } from "../V1ObjectReference/details";

export const CronJobStatusDetails = ({ resourceData }: { resourceData: V1CronJobStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
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