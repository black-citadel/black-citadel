import { Resources } from "@utils/enums";
import { NodeBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const NodeResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <NodeBadge />
      <ResourceLink resource={Resources.Nodes} name={name} />
    </>
  )
}
