import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V2ContainerResourceMetricStatus, V2MetricValueStatus } from "@utils/k8s-types";
import { MetricValueStatusDetails } from "../V2MetricValueStatus/details";

export const ContainerResourceMetricStatusDetails = ({ resourceData }: { resourceData: V2ContainerResourceMetricStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.container, resourceData.name].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.current].some(v => v !== undefined && v !== null));
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
                    { label: "Container", value: resourceData.container },
                    { label: "Name", value: resourceData.name }
                ]}
                columns={1}
            />

            <Container title="Current">
                <MetricValueStatusDetails resourceData={ resourceData.current } />
            </Container>

        </>
    )
}