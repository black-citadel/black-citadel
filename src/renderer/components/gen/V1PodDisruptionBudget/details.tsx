import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1PodDisruptionBudget } from "@utils/k8s-types";
import { PodDisruptionBudgetSpecDetails } from "../V1PodDisruptionBudgetSpec/details";
import { PodDisruptionBudgetStatusDetails } from "../V1PodDisruptionBudgetStatus/details";

export const PodDisruptionBudgetDetails = ({ resourceData }: { resourceData: V1PodDisruptionBudget }): JSX.Element => {

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
            {resourceData.spec && <PodDisruptionBudgetSpecDetails resourceData={ resourceData.spec } />}

            {resourceData.status && (
                <Container title="Status">
                    <PodDisruptionBudgetStatusDetails resourceData={ resourceData.status } />
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}