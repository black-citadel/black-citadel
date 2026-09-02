import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DownwardAPIVolumeFile } from "@kubernetes/client-node";
import { ObjectFieldSelectorDetails } from "../V1ObjectFieldSelector/details";
import { ResourceFieldSelectorDetails } from "../V1ResourceFieldSelector/details";

export const DownwardAPIVolumeFileDetails = ({ resourceData }: { resourceData: V1DownwardAPIVolumeFile }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.mode),
        hasValue(resourceData.path),
        hasValue(resourceData.fieldRef),
        hasValue(resourceData.resourceFieldRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Mode", value: resourceData.mode, description: "Optional: mode bits used to set permissions on this file, must be an octal value between 0000 and 0777 or a decimal value between 0 and 511." },
                    { label: "Path", value: resourceData.path, description: "Required: Path is the relative path name of the file to be created." },
                ]}
            />

            {hasValue(resourceData.fieldRef) && (
                <Container title="Field Ref" collapsible defaultOpen={ true }>
                    <ObjectFieldSelectorDetails resourceData={resourceData.fieldRef } />
                </Container>
            )}

            {hasValue(resourceData.resourceFieldRef) && (
                <Container title="Resource Field Ref" collapsible defaultOpen={ true }>
                    <ResourceFieldSelectorDetails resourceData={resourceData.resourceFieldRef } />
                </Container>
            )}

        </>
    )
}
