import { PanelGrid } from "@components/layout/panel";
import type { V1IPBlock } from "@kubernetes/client-node";

export const IPBlockDetails = ({ resourceData }: { resourceData: V1IPBlock }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.cidr].some(v => v !== undefined && v !== null));
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
                    { label: "Cidr", value: resourceData.cidr }
                ]}
                columns={1}
            />

        </>
    )
}