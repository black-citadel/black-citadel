import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1GitRepoVolumeSource } from "@kubernetes/client-node";

export const GitRepoVolumeSourceDetails = ({ resourceData }: { resourceData: V1GitRepoVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.directory),
        hasValue(resourceData.repository),
        hasValue(resourceData.revision),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Directory", value: resourceData.directory, description: "directory is the target directory name." },
                    { label: "Repository", value: resourceData.repository, description: "repository is the URL" },
                    { label: "Revision", value: resourceData.revision, description: "revision is the commit hash for the specified revision." },
                ]}
            />

        </>
    )
}
