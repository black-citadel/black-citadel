import { Resources } from "@utils/enums";
import { IngressBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const IngressResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <IngressBadge />
      <ResourceLink resource={Resources.Ingresses} name={name} namespace={namespace} />
    </>
  )
}