import { Container } from "@components/base/container";
import { V1DownwardAPIProjection } from "@utils/k8s-types";
import { DownwardAPIVolumeFileDetails } from "../V1DownwardAPIVolumeFile/details";

export const DownwardAPIProjectionDetails = ({ resourceData }: { resourceData: V1DownwardAPIProjection }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.items].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.items && (
                <Container title="Items">
                    {resourceData.items.map((item, index) => (
                        <DownwardAPIVolumeFileDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}