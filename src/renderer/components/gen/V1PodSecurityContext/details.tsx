import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1PodSecurityContext } from "@utils/k8s-types";
import { AppArmorProfileDetails } from "../V1AppArmorProfile/details";
import { SELinuxOptionsDetails } from "../V1SELinuxOptions/details";
import { SeccompProfileDetails } from "../V1SeccompProfile/details";
import { SysctlDetails } from "../V1Sysctl/details";
import { WindowsSecurityContextOptionsDetails } from "../V1WindowsSecurityContextOptions/details";

export const PodSecurityContextDetails = ({ resourceData }: { resourceData: V1PodSecurityContext }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.fsGroup, resourceData.fsGroupChangePolicy, resourceData.runAsGroup, resourceData.runAsUser, resourceData.supplementalGroups].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.appArmorProfile, resourceData.seLinuxOptions, resourceData.seccompProfile, resourceData.sysctls, resourceData.windowsOptions].some(v => v !== undefined && v !== null));
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
                    { label: "Fs Group", value: resourceData.fsGroup || '-' },
                    { label: "Fs Group Change Policy", value: resourceData.fsGroupChangePolicy || '-' },
                    { label: "Run As Group", value: resourceData.runAsGroup || '-' },
                    { label: "Run As User", value: resourceData.runAsUser || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Run As Non Root", value: resourceData.runAsNonRoot ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.appArmorProfile && (
                <Container title="App Armor Profile">
                    <AppArmorProfileDetails resourceData={ resourceData.appArmorProfile } />
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

            {resourceData.sysctls && (
                <Container title="Sysctls">
                    {resourceData.sysctls.map((item, index) => (
                        <SysctlDetails key={index} resourceData={item} />
                    ))}
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