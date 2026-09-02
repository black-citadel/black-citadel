import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1SecurityContext } from "@kubernetes/client-node";
import { AppArmorProfileDetails } from "../V1AppArmorProfile/details";
import { CapabilitiesDetails } from "../V1Capabilities/details";
import { SELinuxOptionsDetails } from "../V1SELinuxOptions/details";
import { SeccompProfileDetails } from "../V1SeccompProfile/details";
import { WindowsSecurityContextOptionsDetails } from "../V1WindowsSecurityContextOptions/details";

export const SecurityContextDetails = ({ resourceData }: { resourceData: V1SecurityContext }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.procMount),
        hasValue(resourceData.runAsGroup),
        hasValue(resourceData.runAsUser),
        resourceData.allowPrivilegeEscalation === true,
        resourceData.privileged === true,
        resourceData.readOnlyRootFilesystem === true,
        resourceData.runAsNonRoot === true,
        hasValue(resourceData.appArmorProfile),
        hasValue(resourceData.capabilities),
        hasValue(resourceData.seLinuxOptions),
        hasValue(resourceData.seccompProfile),
        hasValue(resourceData.windowsOptions),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Proc Mount", value: resourceData.procMount, description: "procMount denotes the type of proc mount to use for the containers." },
                    { label: "Run As Group", value: resourceData.runAsGroup, description: "The GID to run the entrypoint of the container process." },
                    { label: "Run As User", value: resourceData.runAsUser, description: "The UID to run the entrypoint of the container process." },
                ]}
                flags={[
                    { label: "Allow Privilege Escalation", value: resourceData.allowPrivilegeEscalation, description: "AllowPrivilegeEscalation controls whether a process can gain more privileges than its parent process." },
                    { label: "Privileged", value: resourceData.privileged, description: "Run container in privileged mode." },
                    { label: "Read Only Root Filesystem", value: resourceData.readOnlyRootFilesystem, description: "Whether this container has a read-only root filesystem." },
                    { label: "Run As Non Root", value: resourceData.runAsNonRoot, description: "Indicates that the container must run as a non-root user." },
                ]}
            />

            {hasValue(resourceData.appArmorProfile) && (
                <Container title="App Armor Profile" collapsible defaultOpen={ true }>
                    <AppArmorProfileDetails resourceData={resourceData.appArmorProfile } />
                </Container>
            )}

            {hasValue(resourceData.capabilities) && (
                <Container title="Capabilities" collapsible defaultOpen={ true }>
                    <CapabilitiesDetails resourceData={resourceData.capabilities } />
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

            {hasValue(resourceData.windowsOptions) && (
                <Container title="Windows Options" collapsible defaultOpen={ true }>
                    <WindowsSecurityContextOptionsDetails resourceData={resourceData.windowsOptions } />
                </Container>
            )}

        </>
    )
}
