import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1ResourceStatus } from "@utils/k8s-types";
import { ResourceHealthDetails } from "../V1ResourceHealth/details";

export const ResourceStatusDetails = ({ resourceData }: { resourceData: V1ResourceStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.name].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.resources].some(v => v !== undefined && v !== null));
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
                    { label: "Name", value: resourceData.name }
                ]}
                columns={1}
            />

            {resourceData.resources && (
                <Container title="Resources">
                    {resourceData.resources.map((item: any, index: number) => (
                        <ResourceHealthDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}