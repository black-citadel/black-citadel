import { Resources } from "@utils/enums";
import { PortForwardBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  id: string;
}

export const PortForwardResourceLink = ({ id }: Props): JSX.Element => {
  return (
    <>
      <PortForwardBadge />
      <ResourceLink resource={Resources.PortForwards} name={id} />
    </>
  )
}