import { Resources } from "@utils/enums";
import { ClusterRoleBindingBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const ClusterRoleBindingResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <ClusterRoleBindingBadge />
      <ResourceLink resource={Resources.ClusterRoleBindings} name={name} />
    </>
  )
}