import { PanelGrid, hasValue } from "@components/layout/panel";
import type { StorageV1TokenRequest } from "@kubernetes/client-node";

export const StorageV1TokenRequestDetails = ({ resourceData }: { resourceData: StorageV1TokenRequest }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.audience),
        hasValue(resourceData.expirationSeconds),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Audience", value: resourceData.audience, description: "audience is the intended audience of the token in \"TokenRequestSpec\"." },
                    { label: "Expiration Seconds", value: resourceData.expirationSeconds, description: "expirationSeconds is the duration of validity of the token in \"TokenRequestSpec\"." },
                ]}
            />

        </>
    )
}
