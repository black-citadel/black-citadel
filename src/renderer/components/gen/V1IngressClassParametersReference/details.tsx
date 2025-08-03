import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1IngressClassParametersReference } from "@utils/k8s-types";

export const IngressClassParametersReferenceDetails = ({ resourceData }: { resourceData: V1IngressClassParametersReference }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.apiGroup, resourceData.name, resourceData.namespace, resourceData.scope, resourceData.kind].some(v => v !== undefined && v !== null));
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
                    { label: "Api Group", value: resourceData.apiGroup || '-' },
                    { label: "Name", value: resourceData.name },
                    { label: "Namespace", value: resourceData.namespace || '-' },
                    { label: "Scope", value: resourceData.scope || '-' },
                    { label: "Kind", value: resourceData.kind }
                ]}
                columns={1}
            />

        </>
    )
}