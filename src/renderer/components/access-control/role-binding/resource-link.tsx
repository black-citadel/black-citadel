import { Resources } from "@utils/enums";
import { RoleBindingBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const RoleBindingResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <RoleBindingBadge />
      <ResourceLink resource={Resources.RoleBindings} name={name} namespace={namespace} />
    </>
  )
}