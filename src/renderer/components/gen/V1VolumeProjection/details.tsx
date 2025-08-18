import { Container } from "@components/base/container";
import { V1VolumeProjection } from "@utils/k8s-types";
import { ClusterTrustBundleProjectionDetails } from "../V1ClusterTrustBundleProjection/details";
import { ConfigMapProjectionDetails } from "../V1ConfigMapProjection/details";
import { DownwardAPIProjectionDetails } from "../V1DownwardAPIProjection/details";
import { SecretProjectionDetails } from "../V1SecretProjection/details";
import { ServiceAccountTokenProjectionDetails } from "../V1ServiceAccountTokenProjection/details";

export const VolumeProjectionDetails = ({ resourceData }: { resourceData: V1VolumeProjection }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.clusterTrustBundle, resourceData.configMap, resourceData.downwardAPI, resourceData.secret, resourceData.serviceAccountToken].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.clusterTrustBundle && (
                <Container title="Cluster Trust Bundle">
                    <ClusterTrustBundleProjectionDetails resourceData={ resourceData.clusterTrustBundle } />
                </Container>
            )}

            {resourceData.configMap && (
                <Container title="Config Map">
                    <ConfigMapProjectionDetails resourceData={ resourceData.configMap } />
                </Container>
            )}

            {resourceData.downwardAPI && (
                <Container title="Downward API">
                    <DownwardAPIProjectionDetails resourceData={ resourceData.downwardAPI } />
                </Container>
            )}

            {resourceData.secret && (
                <Container title="Secret">
                    <SecretProjectionDetails resourceData={ resourceData.secret } />
                </Container>
            )}

            {resourceData.serviceAccountToken && (
                <Container title="Service Account Token">
                    <ServiceAccountTokenProjectionDetails resourceData={ resourceData.serviceAccountToken } />
                </Container>
            )}

        </>
    )
}