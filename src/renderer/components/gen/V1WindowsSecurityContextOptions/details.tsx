import { PanelGrid } from "@components/layout/panel";
import type { V1WindowsSecurityContextOptions } from "@kubernetes/client-node";

export const WindowsSecurityContextOptionsDetails = ({ resourceData }: { resourceData: V1WindowsSecurityContextOptions }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.gmsaCredentialSpec, resourceData.gmsaCredentialSpecName, resourceData.runAsUserName].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
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
                    { label: "Gmsa Credential Spec", value: resourceData.gmsaCredentialSpec || '-' },
                    { label: "Gmsa Credential Spec Name", value: resourceData.gmsaCredentialSpecName || '-' },
                    { label: "Run As User Name", value: resourceData.runAsUserName || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Host Process", value: resourceData.hostProcess ? "Yes" : "No" }
                ]}
                columns={1}
            />

        </>
    )
}