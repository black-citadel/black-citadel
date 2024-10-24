import { Resources } from "@utils/enums";
import { ServiceBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const ServiceResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <ServiceBadge />
      <ResourceLink resource={Resources.Services} name={name} namespace={namespace} />
    </>
  )
}