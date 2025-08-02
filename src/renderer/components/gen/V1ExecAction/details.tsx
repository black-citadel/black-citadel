import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ExecAction } from "@utils/k8s-types";

export const ExecActionDetails = ({ resourceData }: { resourceData: V1ExecAction }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
        </>
    )
}