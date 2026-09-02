import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DeploymentStrategy } from "@kubernetes/client-node";
import { RollingUpdateDeploymentDetails } from "../V1RollingUpdateDeployment/details";

export const DeploymentStrategyDetails = ({ resourceData }: { resourceData: V1DeploymentStrategy }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.type].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.rollingUpdate].some(v => v !== undefined && v !== null));
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
                    { label: "Type", value: resourceData.type || '-' }
                ]}
                columns={1}
            />

            {resourceData.rollingUpdate && (
                <Container title="Rolling Update">
                    <RollingUpdateDeploymentDetails resourceData={ resourceData.rollingUpdate } />
                </Container>
            )}

        </>
    )
}