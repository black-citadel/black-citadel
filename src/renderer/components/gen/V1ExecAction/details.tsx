import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ExecAction } from "@kubernetes/client-node";

export const ExecActionDetails = ({ resourceData }: { resourceData: V1ExecAction }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.command),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Command", value: resourceData.command, description: "Command is the command line to execute inside the container, the working directory for the command is root ('/') in the container's filesystem." },
                ]}
            />

        </>
    )
}
