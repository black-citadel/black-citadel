import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1DaemonSet } from "@utils/k8s-types";
import { DaemonSetSpecDetails } from "../V1DaemonSetSpec/details";
import { DaemonSetStatusDetails } from "../V1DaemonSetStatus/details";

export const DaemonSetDetails = ({ resourceData }: { resourceData: V1DaemonSet }): JSX.Element => {

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
            {resourceData.spec && <DaemonSetSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <DaemonSetStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}