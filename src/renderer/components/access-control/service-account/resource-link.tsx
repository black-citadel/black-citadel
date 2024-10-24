import { Resources } from "@utils/enums";
import { ServiceAccountBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const ServiceAccountResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <ServiceAccountBadge />
      <ResourceLink resource={Resources.ServiceAccounts} name={name} namespace={namespace} />
    </>
  )
}