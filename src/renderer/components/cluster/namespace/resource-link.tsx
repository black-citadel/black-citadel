import { Resources } from "@utils/enums";
import { NamespaceBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const NamespaceResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <NamespaceBadge />
      <ResourceLink resource={Resources.Namespaces} name={name} />
    </>
  )
}