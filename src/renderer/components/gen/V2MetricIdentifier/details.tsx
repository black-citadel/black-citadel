import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V2MetricIdentifier, V1LabelSelector } from "@utils/k8s-types";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const MetricIdentifierDetails = ({ resourceData }: { resourceData: V2MetricIdentifier }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.name].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.selector].some(v => v !== undefined && v !== null));
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

            {resourceData.selector && (
                <Container title="Selector">
                    <LabelSelectorDetails resourceData={ resourceData.selector } />
                </Container>
            )}

        </>
    )
}