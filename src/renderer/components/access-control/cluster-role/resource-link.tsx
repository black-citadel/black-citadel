import { Resources } from "@utils/enums";
import { ClusterRoleBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const ClusterRoleResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <ClusterRoleBadge />
      <ResourceLink resource={Resources.ClusterRoles} name={name} />
    </>
  )
}