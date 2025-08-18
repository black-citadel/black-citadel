import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1EnvFromSource } from "@utils/k8s-types";
import { ConfigMapEnvSourceDetails } from "../V1ConfigMapEnvSource/details";
import { SecretEnvSourceDetails } from "../V1SecretEnvSource/details";

export const EnvFromSourceDetails = ({ resourceData }: { resourceData: V1EnvFromSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.prefix].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.configMapRef, resourceData.secretRef].some(v => v !== undefined && v !== null));
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
                    { label: "Prefix", value: resourceData.prefix || '-' }
                ]}
                columns={1}
            />

            {resourceData.configMapRef && (
                <Container title="Config Map Ref">
                    <ConfigMapEnvSourceDetails resourceData={ resourceData.configMapRef } />
                </Container>
            )}

            {resourceData.secretRef && (
                <Container title="Secret Ref">
                    <SecretEnvSourceDetails resourceData={ resourceData.secretRef } />
                </Container>
            )}

        </>
    )
}