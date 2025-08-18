import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1WeightedPodAffinityTerm } from "@utils/k8s-types";
import { PodAffinityTermDetails } from "../V1PodAffinityTerm/details";

export const WeightedPodAffinityTermDetails = ({ resourceData }: { resourceData: V1WeightedPodAffinityTerm }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.weight].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.podAffinityTerm].some(v => v !== undefined && v !== null));
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
                    { label: "Weight", value: resourceData.weight }
                ]}
                columns={1}
            />

            <Container title="Pod Affinity Term">
                <PodAffinityTermDetails resourceData={ resourceData.podAffinityTerm } />
            </Container>

        </>
    )
}