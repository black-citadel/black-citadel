import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ContainerUser, V1LinuxContainerUser } from "@utils/k8s-types";
import { LinuxContainerUserDetails } from "../V1LinuxContainerUser/details";

export const ContainerUserDetails = ({ resourceData }: { resourceData: V1ContainerUser }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.linux].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.linux && (
                <Container title="Linux">
                    <LinuxContainerUserDetails resourceData={ resourceData.linux } />
                </Container>
            )}

        </>
    )
}