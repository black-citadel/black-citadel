import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1SecurityContext, V1AppArmorProfile, V1Capabilities, V1SELinuxOptions, V1SeccompProfile, V1WindowsSecurityContextOptions } from "@utils/k8s-types";
import { AppArmorProfileDetails } from "../V1AppArmorProfile/details";
import { CapabilitiesDetails } from "../V1Capabilities/details";
import { SELinuxOptionsDetails } from "../V1SELinuxOptions/details";
import { SeccompProfileDetails } from "../V1SeccompProfile/details";
import { WindowsSecurityContextOptionsDetails } from "../V1WindowsSecurityContextOptions/details";

export const SecurityContextDetails = ({ resourceData }: { resourceData: V1SecurityContext }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.procMount, resourceData.runAsGroup, resourceData.runAsUser].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.appArmorProfile, resourceData.capabilities, resourceData.seLinuxOptions, resourceData.seccompProfile, resourceData.windowsOptions].some(v => v !== undefined && v !== null));
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
                    { label: "Proc Mount", value: resourceData.procMount || '-' },
                    { label: "Run As Group", value: resourceData.runAsGroup || '-' },
                    { label: "Run As User", value: resourceData.runAsUser || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Allow Privilege Escalation", value: resourceData.allowPrivilegeEscalation ? "Yes" : "No" },
                    { label: "Privileged", value: resourceData.privileged ? "Yes" : "No" },
                    { label: "Read Only Root Filesystem", value: resourceData.readOnlyRootFilesystem ? "Yes" : "No" },
                    { label: "Run As Non Root", value: resourceData.runAsNonRoot ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.appArmorProfile && (
                <Container title="App Armor Profile">
                    <AppArmorProfileDetails resourceData={ resourceData.appArmorProfile } />
                </Container>
            )}

            {resourceData.capabilities && (
                <Container title="Capabilities">
                    <CapabilitiesDetails resourceData={ resourceData.capabilities } />
                </Container>
            )}

            {resourceData.seLinuxOptions && (
                <Container title="Se Linux Options">
                    <SELinuxOptionsDetails resourceData={ resourceData.seLinuxOptions } />
                </Container>
            )}

            {resourceData.seccompProfile && (
                <Container title="Seccomp Profile">
                    <SeccompProfileDetails resourceData={ resourceData.seccompProfile } />
                </Container>
            )}

            {resourceData.windowsOptions && (
                <Container title="Windows Options">
                    <WindowsSecurityContextOptionsDetails resourceData={ resourceData.windowsOptions } />
                </Container>
            )}

        </>
    )
}