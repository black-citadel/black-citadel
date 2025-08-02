import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1Lifecycle, V1LifecycleHandler } from "@utils/k8s-types";
import { LifecycleHandlerDetails } from "../V1LifecycleHandler/details";

export const LifecycleDetails = ({ resourceData }: { resourceData: V1Lifecycle }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.stopSignal].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.postStart, resourceData.preStop].some(v => v !== undefined && v !== null));
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
                    { label: "Stop Signal", value: resourceData.stopSignal || '-' }
                ]}
                columns={1}
            />

            {resourceData.postStart && (
                <Container title="Post Start">
                    <LifecycleHandlerDetails resourceData={ resourceData.postStart } />
                </Container>
            )}

            {resourceData.preStop && (
                <Container title="Pre Stop">
                    <LifecycleHandlerDetails resourceData={ resourceData.preStop } />
                </Container>
            )}

        </>
    )
}