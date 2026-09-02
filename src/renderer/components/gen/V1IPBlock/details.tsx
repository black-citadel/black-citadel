import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1IPBlock } from "@kubernetes/client-node";

export const IPBlockDetails = ({ resourceData }: { resourceData: V1IPBlock }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.cidr),
        hasValue(resourceData.except),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Cidr", value: resourceData.cidr, description: "cidr is a string representing the IPBlock Valid examples are \"192.168.1.0/24\" or \"2001:db8::/64\"" },
                    { label: "Except", value: resourceData.except, description: "except is a slice of CIDRs that should not be included within an IPBlock Valid examples are \"192.168.1.0/24\" or \"2001:db8::/64\" Except values will be rejected…" },
                ]}
            />

        </>
    )
}
