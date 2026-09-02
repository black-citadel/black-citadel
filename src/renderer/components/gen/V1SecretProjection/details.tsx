import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1SecretProjection } from "@kubernetes/client-node";
import { KeyToPathDetails } from "../V1KeyToPath/details";

export const SecretProjectionDetails = ({ resourceData }: { resourceData: V1SecretProjection }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        resourceData.optional === true,
        hasValue(resourceData.items),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Name of the referent." },
                ]}
                flags={[
                    { label: "Optional", value: resourceData.optional, description: "optional field specify whether the Secret or its key must be defined" },
                ]}
            />

            {hasValue(resourceData.items) && (
                <Container title="Items" count={resourceData.items.length} collapsible defaultOpen={ true }>
                    {resourceData.items.map((item, index) => (
                        <PanelListItem key={index}>
                            <KeyToPathDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
