import { PanelGrid } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import { V1ConfigMap } from "@utils/k8s-types";

export const ConfigMapDetails = ({ resourceData }: { resourceData: V1ConfigMap }): JSX.Element => {
    // Transform the Data object into an array of PanelGridItem objects
    const dataItems = resourceData.data
        ? Object.entries(resourceData.data).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Binary Data object into an array of PanelGridItem objects
    const binaryDataItems = resourceData.binaryData
        ? Object.entries(resourceData.binaryData).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    return (
        <div className='m-2'>
            <PanelGrid
                title="Data"
                items={ dataItems }
                columns={1}
            />

            <PanelGrid
                title="Binary Data"
                items={ binaryDataItems }
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Immutable", value: resourceData.immutable ? "Yes" : "No" }
                ]}
                columns={1}
            />

            <MetadataDetails metadata={resourceData.metadata} />
        </div>
    )
}