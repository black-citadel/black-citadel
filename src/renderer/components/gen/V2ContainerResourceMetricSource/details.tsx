import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V2ContainerResourceMetricSource } from "@utils/k8s-types";
import { MetricTargetDetails } from "../V2MetricTarget/details";

export const ContainerResourceMetricSourceDetails = ({ resourceData }: { resourceData: V2ContainerResourceMetricSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.container, resourceData.name].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.target].some(v => v !== undefined && v !== null));
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

            <Container title="Target">
                <MetricTargetDetails resourceData={ resourceData.target } />
            </Container>

        </>
    )
}