import { Resources } from "@utils/enums";
import { CSINodeBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const CSINodeResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <CSINodeBadge />
      <ResourceLink resource={Resources.CSINodes} name={name} />
    </>
  )
}