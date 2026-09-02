import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1VolumeProjection } from "@kubernetes/client-node";
import { ClusterTrustBundleProjectionDetails } from "../V1ClusterTrustBundleProjection/details";
import { ConfigMapProjectionDetails } from "../V1ConfigMapProjection/details";
import { DownwardAPIProjectionDetails } from "../V1DownwardAPIProjection/details";
import { SecretProjectionDetails } from "../V1SecretProjection/details";
import { ServiceAccountTokenProjectionDetails } from "../V1ServiceAccountTokenProjection/details";

export const VolumeProjectionDetails = ({ resourceData }: { resourceData: V1VolumeProjection }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.clusterTrustBundle),
        hasValue(resourceData.configMap),
        hasValue(resourceData.downwardAPI),
        hasValue(resourceData.secret),
        hasValue(resourceData.serviceAccountToken),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.clusterTrustBundle) && (
                <Container title="Cluster Trust Bundle" collapsible defaultOpen={ true }>
                    <ClusterTrustBundleProjectionDetails resourceData={resourceData.clusterTrustBundle } />
                </Container>
            )}

            {hasValue(resourceData.configMap) && (
                <Container title="Config Map" collapsible defaultOpen={ true }>
                    <ConfigMapProjectionDetails resourceData={resourceData.configMap } />
                </Container>
            )}

            {hasValue(resourceData.downwardAPI) && (
                <Container title="Downward API" collapsible defaultOpen={ true }>
                    <DownwardAPIProjectionDetails resourceData={resourceData.downwardAPI } />
                </Container>
            )}

            {hasValue(resourceData.secret) && (
                <Container title="Secret" collapsible defaultOpen={ true }>
                    <SecretProjectionDetails resourceData={resourceData.secret } />
                </Container>
            )}

            {hasValue(resourceData.serviceAccountToken) && (
                <Container title="Service Account Token" collapsible defaultOpen={ true }>
                    <ServiceAccountTokenProjectionDetails resourceData={resourceData.serviceAccountToken } />
                </Container>
            )}

        </>
    )
}
