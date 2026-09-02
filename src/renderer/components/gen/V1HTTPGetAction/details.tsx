import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1HTTPGetAction } from "@kubernetes/client-node";
import { HTTPHeaderDetails } from "../V1HTTPHeader/details";

export const HTTPGetActionDetails = ({ resourceData }: { resourceData: V1HTTPGetAction }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.host),
        hasValue(resourceData.path),
        hasValue(resourceData.port),
        hasValue(resourceData.scheme),
        hasValue(resourceData.httpHeaders),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Host", value: resourceData.host, description: "Host name to connect to, defaults to the pod IP." },
                    { label: "Path", value: resourceData.path, description: "Path to access on the HTTP server." },
                    { label: "Port", value: resourceData.port, description: "IntOrString is a type that can hold an int32 or a string." },
                    { label: "Scheme", value: resourceData.scheme, description: "Scheme to use for connecting to the host." },
                ]}
            />

            {hasValue(resourceData.httpHeaders) && (
                <Container title="Http Headers" count={resourceData.httpHeaders.length} collapsible defaultOpen={ true }>
                    {resourceData.httpHeaders.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <HTTPHeaderDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
