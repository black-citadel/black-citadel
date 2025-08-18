import { Container } from "@components/base/container";
import { V1EndpointHints } from "@utils/k8s-types";
import { ForNodeDetails } from "../V1ForNode/details";
import { ForZoneDetails } from "../V1ForZone/details";

export const EndpointHintsDetails = ({ resourceData }: { resourceData: V1EndpointHints }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.forZones].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.forZones && (
                <Container title="For Zones">
                    {resourceData.forZones.map((item, index) => (
                        <ForZoneDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}