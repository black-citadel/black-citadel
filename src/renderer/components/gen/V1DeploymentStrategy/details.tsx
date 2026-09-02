import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DeploymentStrategy } from "@kubernetes/client-node";
import { RollingUpdateDeploymentDetails } from "../V1RollingUpdateDeployment/details";

export const DeploymentStrategyDetails = ({ resourceData }: { resourceData: V1DeploymentStrategy }): JSX.Element => {

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
                    { label: "Type", value: resourceData.type, description: "Type of deployment." },
                ]}
            />

            {hasValue(resourceData.rollingUpdate) && (
                <Container title="Rolling Update" collapsible defaultOpen={ true }>
                    <RollingUpdateDeploymentDetails resourceData={resourceData.rollingUpdate } />
                </Container>
            )}

        </>
    )
}
