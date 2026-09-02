import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1EnvFromSource } from "@kubernetes/client-node";
import { ConfigMapEnvSourceDetails } from "../V1ConfigMapEnvSource/details";
import { SecretEnvSourceDetails } from "../V1SecretEnvSource/details";

export const EnvFromSourceDetails = ({ resourceData }: { resourceData: V1EnvFromSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.prefix),
        hasValue(resourceData.configMapRef),
        hasValue(resourceData.secretRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Prefix", value: resourceData.prefix, description: "An optional identifier to prepend to each key in the ConfigMap." },
                ]}
            />

            {hasValue(resourceData.configMapRef) && (
                <Container title="Config Map Ref" collapsible defaultOpen={ true }>
                    <ConfigMapEnvSourceDetails resourceData={resourceData.configMapRef } />
                </Container>
            )}

            {hasValue(resourceData.secretRef) && (
                <Container title="Secret Ref" collapsible defaultOpen={ true }>
                    <SecretEnvSourceDetails resourceData={resourceData.secretRef } />
                </Container>
            )}

        </>
    )
}
