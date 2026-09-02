import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ServiceAccountTokenProjection } from "@kubernetes/client-node";

export const ServiceAccountTokenProjectionDetails = ({ resourceData }: { resourceData: V1ServiceAccountTokenProjection }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.audience),
        hasValue(resourceData.expirationSeconds),
        hasValue(resourceData.path),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Audience", value: resourceData.audience, description: "audience is the intended audience of the token." },
                    { label: "Expiration Seconds", value: resourceData.expirationSeconds, description: "expirationSeconds is the requested duration of validity of the service account token." },
                    { label: "Path", value: resourceData.path, description: "path is the path relative to the mount point of the file to project the token into." },
                ]}
            />

        </>
    )
}
