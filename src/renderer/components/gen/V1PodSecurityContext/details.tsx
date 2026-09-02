import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodSecurityContext } from "@kubernetes/client-node";
import { AppArmorProfileDetails } from "../V1AppArmorProfile/details";
import { SELinuxOptionsDetails } from "../V1SELinuxOptions/details";
import { SeccompProfileDetails } from "../V1SeccompProfile/details";
import { SysctlDetails } from "../V1Sysctl/details";
import { WindowsSecurityContextOptionsDetails } from "../V1WindowsSecurityContextOptions/details";

export const PodSecurityContextDetails = ({ resourceData }: { resourceData: V1PodSecurityContext }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsGroup),
        hasValue(resourceData.fsGroupChangePolicy),
        hasValue(resourceData.runAsGroup),
        hasValue(resourceData.runAsUser),
        hasValue(resourceData.supplementalGroups),
        resourceData.runAsNonRoot === true,
        hasValue(resourceData.appArmorProfile),
        hasValue(resourceData.seLinuxOptions),
        hasValue(resourceData.seccompProfile),
        hasValue(resourceData.sysctls),
        hasValue(resourceData.windowsOptions),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Group", value: resourceData.fsGroup, description: "A special supplemental group that applies to all containers in a pod." },
                    { label: "Fs Group Change Policy", value: resourceData.fsGroupChangePolicy, description: "fsGroupChangePolicy defines behavior of changing ownership and permission of the volume before being exposed inside Pod." },
                    { label: "Run As Group", value: resourceData.runAsGroup, description: "The GID to run the entrypoint of the container process." },
                    { label: "Run As User", value: resourceData.runAsUser, description: "The UID to run the entrypoint of the container process." },
                    { label: "Supplemental Groups", value: resourceData.supplementalGroups, description: "A list of groups applied to the first process run in each container, in addition to the container's primary GID, the fsGroup (if specified), and group membersh…" },
                ]}
                flags={[
                    { label: "Run As Non Root", value: resourceData.runAsNonRoot, description: "Indicates that the container must run as a non-root user." },
                ]}
            />

            {hasValue(resourceData.appArmorProfile) && (
                <Container title="App Armor Profile" collapsible defaultOpen={ true }>
                    <AppArmorProfileDetails resourceData={resourceData.appArmorProfile } />
                </Container>
            )}

            {hasValue(resourceData.seLinuxOptions) && (
                <Container title="Se Linux Options" collapsible defaultOpen={ true }>
                    <SELinuxOptionsDetails resourceData={resourceData.seLinuxOptions } />
                </Container>
            )}

            {hasValue(resourceData.seccompProfile) && (
                <Container title="Seccomp Profile" collapsible defaultOpen={ true }>
                    <SeccompProfileDetails resourceData={resourceData.seccompProfile } />
                </Container>
            )}

            {hasValue(resourceData.sysctls) && (
                <Container title="Sysctls" count={resourceData.sysctls.length} collapsible defaultOpen={ true }>
                    {resourceData.sysctls.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <SysctlDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.windowsOptions) && (
                <Container title="Windows Options" collapsible defaultOpen={ true }>
                    <WindowsSecurityContextOptionsDetails resourceData={resourceData.windowsOptions } />
                </Container>
            )}

        </>
    )
}
