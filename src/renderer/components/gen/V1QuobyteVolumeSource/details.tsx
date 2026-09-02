import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1QuobyteVolumeSource } from "@kubernetes/client-node";

export const QuobyteVolumeSourceDetails = ({ resourceData }: { resourceData: V1QuobyteVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.group),
        hasValue(resourceData.registry),
        hasValue(resourceData.tenant),
        hasValue(resourceData.user),
        hasValue(resourceData.volume),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Group", value: resourceData.group, description: "group to map volume access to Default is no group" },
                    { label: "Registry", value: resourceData.registry, description: "registry represents a single or multiple Quobyte Registry services specified as a string as host:port pair (multiple entries are separated with commas) which a…" },
                    { label: "Tenant", value: resourceData.tenant, description: "tenant owning the given Quobyte volume in the Backend Used with dynamically provisioned Quobyte volumes, value is set by the plugin" },
                    { label: "User", value: resourceData.user, description: "user to map volume access to Defaults to serivceaccount user" },
                    { label: "Volume", value: resourceData.volume, description: "volume is a string that references an already created Quobyte volume by name." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly here will force the Quobyte volume to be mounted with read-only permissions." },
                ]}
            />

        </>
    )
}
