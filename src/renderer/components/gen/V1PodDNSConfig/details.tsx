import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodDNSConfig } from "@kubernetes/client-node";
import { PodDNSConfigOptionDetails } from "../V1PodDNSConfigOption/details";

export const PodDNSConfigDetails = ({ resourceData }: { resourceData: V1PodDNSConfig }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.nameservers),
        hasValue(resourceData.searches),
        hasValue(resourceData.options),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Nameservers", value: resourceData.nameservers, description: "A list of DNS name server IP addresses." },
                    { label: "Searches", value: resourceData.searches, description: "A list of DNS search domains for host-name lookup." },
                ]}
            />

            {hasValue(resourceData.options) && (
                <Container title="Options" count={resourceData.options.length} collapsible defaultOpen={ true }>
                    {resourceData.options.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <PodDNSConfigOptionDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
