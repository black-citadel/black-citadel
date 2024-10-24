import { Resources } from "@utils/enums";
import { IngressClassBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const IngressClassResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <IngressClassBadge />
      <ResourceLink resource={Resources.IngressClasses} name={name} namespace={namespace} />
    </>
  )
}