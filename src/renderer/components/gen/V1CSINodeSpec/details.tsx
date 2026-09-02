import { Container } from "@components/base/container";
import type { V1CSINodeSpec } from "@kubernetes/client-node";
import { CSINodeDriverDetails } from "../V1CSINodeDriver/details";

export const CSINodeSpecDetails = ({ resourceData }: { resourceData: V1CSINodeSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.drivers].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.drivers && (
                <Container title="Drivers">
                    {resourceData.drivers.map((item, index) => (
                        <CSINodeDriverDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}