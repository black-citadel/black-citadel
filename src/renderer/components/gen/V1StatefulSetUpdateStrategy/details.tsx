import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1StatefulSetUpdateStrategy } from "@kubernetes/client-node";
import { RollingUpdateStatefulSetStrategyDetails } from "../V1RollingUpdateStatefulSetStrategy/details";

export const StatefulSetUpdateStrategyDetails = ({ resourceData }: { resourceData: V1StatefulSetUpdateStrategy }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.type),
        hasValue(resourceData.rollingUpdate),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Type", value: resourceData.type, description: "Type indicates the type of the StatefulSetUpdateStrategy." },
                ]}
            />

            {hasValue(resourceData.rollingUpdate) && (
                <Container title="Rolling Update" collapsible defaultOpen={ true }>
                    <RollingUpdateStatefulSetStrategyDetails resourceData={resourceData.rollingUpdate } />
                </Container>
            )}

        </>
    )
}
