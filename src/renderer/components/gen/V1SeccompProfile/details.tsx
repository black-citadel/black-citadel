import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1SeccompProfile } from "@kubernetes/client-node";

export const SeccompProfileDetails = ({ resourceData }: { resourceData: V1SeccompProfile }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.localhostProfile),
        hasValue(resourceData.type),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Localhost Profile", value: resourceData.localhostProfile, description: "localhostProfile indicates a profile defined in a file on the node should be used." },
                    { label: "Type", value: resourceData.type, description: "type indicates which kind of seccomp profile will be applied." },
                ]}
            />

        </>
    )
}
