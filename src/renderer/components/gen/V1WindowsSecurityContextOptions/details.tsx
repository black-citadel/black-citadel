import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1WindowsSecurityContextOptions } from "@kubernetes/client-node";

export const WindowsSecurityContextOptionsDetails = ({ resourceData }: { resourceData: V1WindowsSecurityContextOptions }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.gmsaCredentialSpec),
        hasValue(resourceData.gmsaCredentialSpecName),
        hasValue(resourceData.runAsUserName),
        resourceData.hostProcess === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Gmsa Credential Spec", value: resourceData.gmsaCredentialSpec, description: "GMSACredentialSpec is where the GMSA admission webhook (https://github.com/kubernetes-sigs/windows-gmsa) inlines the contents of the GMSA credential spec named…" },
                    { label: "Gmsa Credential Spec Name", value: resourceData.gmsaCredentialSpecName, description: "GMSACredentialSpecName is the name of the GMSA credential spec to use." },
                    { label: "Run As User Name", value: resourceData.runAsUserName, description: "The UserName in Windows to run the entrypoint of the container process." },
                ]}
                flags={[
                    { label: "Host Process", value: resourceData.hostProcess, description: "HostProcess determines if a container should be run as a 'Host Process' container." },
                ]}
            />

        </>
    )
}
