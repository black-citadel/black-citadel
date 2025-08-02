import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1Service, V1ServiceSpec, V1ServiceStatus } from "@utils/k8s-types";
import { ServiceSpecDetails } from "../V1ServiceSpec/details";
import { ServiceStatusDetails } from "../V1ServiceStatus/details";

export const ServiceDetails = ({ resourceData }: { resourceData: V1Service }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.spec, resourceData.status].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.spec && <ServiceSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <ServiceStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}