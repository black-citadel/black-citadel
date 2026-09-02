import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DaemonSetUpdateStrategy } from "@kubernetes/client-node";
import { RollingUpdateDaemonSetDetails } from "../V1RollingUpdateDaemonSet/details";

export const DaemonSetUpdateStrategyDetails = ({ resourceData }: { resourceData: V1DaemonSetUpdateStrategy }): JSX.Element => {

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
                    { label: "Type", value: resourceData.type, description: "Type of daemon set update." },
                ]}
            />

            {hasValue(resourceData.rollingUpdate) && (
                <Container title="Rolling Update" collapsible defaultOpen={ true }>
                    <RollingUpdateDaemonSetDetails resourceData={resourceData.rollingUpdate } />
                </Container>
            )}

        </>
    )
}
