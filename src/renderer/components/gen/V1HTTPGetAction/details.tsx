import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1HTTPGetAction, V1HTTPHeader } from "@utils/k8s-types";
import { HTTPHeaderDetails } from "../V1HTTPHeader/details";

export const HTTPGetActionDetails = ({ resourceData }: { resourceData: V1HTTPGetAction }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.host, resourceData.path, resourceData.port, resourceData.scheme].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.httpHeaders].some(v => v !== undefined && v !== null));
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
                    { label: "Host", value: resourceData.host || '-' },
                    { label: "Path", value: resourceData.path || '-' },
                    { label: "Port", value: resourceData.port },
                    { label: "Scheme", value: resourceData.scheme || '-' }
                ]}
                columns={1}
            />

            {resourceData.httpHeaders && (
                <Container title="Http Headers">
                    {resourceData.httpHeaders.map((item, index) => (
                        <HTTPHeaderDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}