import { Container } from "@components/base/container";
import { V1ContainerUser } from "@utils/k8s-types";
import { LinuxContainerUserDetails } from "../V1LinuxContainerUser/details";

export const ContainerUserDetails = ({ resourceData }: { resourceData: V1ContainerUser }): JSX.Element => {

    // V1ContainerUser is a stub type - no content to display
    return <div className="italic text-neutral-400 text-sm">No data</div>;
}