import { Resources } from "@utils/enums";
import { StorageClassBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const StorageClassResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <StorageClassBadge />
      <ResourceLink resource={Resources.StorageClasses} name={name} />
    </>
  )
}