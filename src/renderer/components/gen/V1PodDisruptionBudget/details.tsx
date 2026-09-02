import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1PodDisruptionBudget } from "@kubernetes/client-node";
import { PodDisruptionBudgetSpecDetails } from "../V1PodDisruptionBudgetSpec/details";
import { PodDisruptionBudgetStatusDetails } from "../V1PodDisruptionBudgetStatus/details";

export const PodDisruptionBudgetDetails = ({ resourceData }: { resourceData: V1PodDisruptionBudget }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.spec),
        hasValue(resourceData.status),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.spec) && <PodDisruptionBudgetSpecDetails resourceData={resourceData.spec } />}

            {hasValue(resourceData.status) && (
                <Container title="Status" collapsible defaultOpen={ true }>
                    <PodDisruptionBudgetStatusDetails resourceData={resourceData.status } />
                </Container>
            )}

        </>
    )
}
