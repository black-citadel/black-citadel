import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V2ResourceMetricSource, V2MetricTarget } from "@utils/k8s-types";
import { MetricTargetDetails } from "../V2MetricTarget/details";

export const ResourceMetricSourceDetails = ({ resourceData }: { resourceData: V2ResourceMetricSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.name].some(v => v !== undefined && v !== null));
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