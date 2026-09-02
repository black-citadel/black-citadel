import { Container } from "@components/base/container";
import type { V1LimitRangeSpec } from "@kubernetes/client-node";
import { LimitRangeItemDetails } from "../V1LimitRangeItem/details";

export const LimitRangeSpecDetails = ({ resourceData }: { resourceData: V1LimitRangeSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.limits].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.limits && (
                <Container title="Limits">
                    {resourceData.limits.map((item, index) => (
                        <LimitRangeItemDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}