import { PanelGrid } from "@components/layout/panel";
import type { V1ServiceAccountTokenProjection } from "@kubernetes/client-node";

export const ServiceAccountTokenProjectionDetails = ({ resourceData }: { resourceData: V1ServiceAccountTokenProjection }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.audience, resourceData.expirationSeconds, resourceData.path].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Audience", value: resourceData.audience || '-' },
                    { label: "Expiration Seconds", value: resourceData.expirationSeconds || '-' },
                    { label: "Path", value: resourceData.path }
                ]}
                columns={1}
            />

        </>
    )
}