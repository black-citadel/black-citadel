import { Resources } from "@utils/enums";
import { RoleBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const RoleResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <RoleBadge />
      <ResourceLink resource={Resources.Roles} name={name} namespace={namespace} />
    </>
  )
}