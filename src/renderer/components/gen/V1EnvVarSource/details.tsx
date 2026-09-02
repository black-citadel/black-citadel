import { Container } from "@components/base/container";
import type { V1EnvVarSource } from "@kubernetes/client-node";
import { ConfigMapKeySelectorDetails } from "../V1ConfigMapKeySelector/details";
import { ObjectFieldSelectorDetails } from "../V1ObjectFieldSelector/details";
import { ResourceFieldSelectorDetails } from "../V1ResourceFieldSelector/details";
import { SecretKeySelectorDetails } from "../V1SecretKeySelector/details";

export const EnvVarSourceDetails = ({ resourceData }: { resourceData: V1EnvVarSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.configMapKeyRef, resourceData.fieldRef, resourceData.resourceFieldRef, resourceData.secretKeyRef].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.configMapKeyRef && (
                <Container title="Config Map Key Ref">
                    <ConfigMapKeySelectorDetails resourceData={ resourceData.configMapKeyRef } />
                </Container>
            )}

            {resourceData.fieldRef && (
                <Container title="Field Ref">
                    <ObjectFieldSelectorDetails resourceData={ resourceData.fieldRef } />
                </Container>
            )}

            {resourceData.resourceFieldRef && (
                <Container title="Resource Field Ref">
                    <ResourceFieldSelectorDetails resourceData={ resourceData.resourceFieldRef } />
                </Container>
            )}

            {resourceData.secretKeyRef && (
                <Container title="Secret Key Ref">
                    <SecretKeySelectorDetails resourceData={ resourceData.secretKeyRef } />
                </Container>
            )}

        </>
    )
}