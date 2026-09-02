import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2MetricIdentifier } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";

export const MetricIdentifierDetails = ({ resourceData }: { resourceData: V2MetricIdentifier }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.selector),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "name is the name of the given metric" },
                ]}
            />

            {hasValue(resourceData.selector) && (
                <Container title="Selector" collapsible defaultOpen={ true }>
                    <LabelSelectorDetails resourceData={resourceData.selector } />
                </Container>
            )}

        </>
    )
}
