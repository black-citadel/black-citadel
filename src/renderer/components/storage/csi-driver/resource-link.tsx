import { Resources } from "@utils/enums";
import { CSIDriverBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const CSIDriverResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <CSIDriverBadge />
      <ResourceLink resource={Resources.CSIDrivers} name={name} />
    </>
  )
}