import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1PodDNSConfig, V1PodDNSConfigOption } from "@utils/k8s-types";
import { PodDNSConfigOptionDetails } from "../V1PodDNSConfigOption/details";

export const PodDNSConfigDetails = ({ resourceData }: { resourceData: V1PodDNSConfig }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.options].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.options && (
                <Container title="Options">
                    {resourceData.options.map((item, index) => (
                        <PodDNSConfigOptionDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}