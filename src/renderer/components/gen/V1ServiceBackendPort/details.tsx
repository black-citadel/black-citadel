import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ServiceBackendPort } from "@kubernetes/client-node";

export const ServiceBackendPortDetails = ({ resourceData }: { resourceData: V1ServiceBackendPort }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.number),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "name is the name of the port on the Service." },
                    { label: "Number", value: resourceData.number, description: "number is the numerical port number (e.g." },
                ]}
            />

        </>
    )
}
