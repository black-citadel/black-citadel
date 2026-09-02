import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1EnvVarSource } from "@kubernetes/client-node";
import { ConfigMapKeySelectorDetails } from "../V1ConfigMapKeySelector/details";
import { ObjectFieldSelectorDetails } from "../V1ObjectFieldSelector/details";
import { ResourceFieldSelectorDetails } from "../V1ResourceFieldSelector/details";
import { SecretKeySelectorDetails } from "../V1SecretKeySelector/details";

export const EnvVarSourceDetails = ({ resourceData }: { resourceData: V1EnvVarSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.configMapKeyRef),
        hasValue(resourceData.fieldRef),
        hasValue(resourceData.resourceFieldRef),
        hasValue(resourceData.secretKeyRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.configMapKeyRef) && (
                <Container title="Config Map Key Ref" collapsible defaultOpen={ true }>
                    <ConfigMapKeySelectorDetails resourceData={resourceData.configMapKeyRef } />
                </Container>
            )}

            {hasValue(resourceData.fieldRef) && (
                <Container title="Field Ref" collapsible defaultOpen={ true }>
                    <ObjectFieldSelectorDetails resourceData={resourceData.fieldRef } />
                </Container>
            )}

            {hasValue(resourceData.resourceFieldRef) && (
                <Container title="Resource Field Ref" collapsible defaultOpen={ true }>
                    <ResourceFieldSelectorDetails resourceData={resourceData.resourceFieldRef } />
                </Container>
            )}

            {hasValue(resourceData.secretKeyRef) && (
                <Container title="Secret Key Ref" collapsible defaultOpen={ true }>
                    <SecretKeySelectorDetails resourceData={resourceData.secretKeyRef } />
                </Container>
            )}

        </>
    )
}
