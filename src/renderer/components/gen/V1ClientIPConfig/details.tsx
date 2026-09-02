import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ClientIPConfig } from "@kubernetes/client-node";

export const ClientIPConfigDetails = ({ resourceData }: { resourceData: V1ClientIPConfig }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.timeoutSeconds),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Timeout Seconds", value: resourceData.timeoutSeconds, description: "timeoutSeconds specifies the seconds of ClientIP type session sticky time." },
                ]}
            />

        </>
    )
}
