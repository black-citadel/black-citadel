import { Resources } from "@utils/enums";
import { ResourceQuotaBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const ResourceQuotaResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <ResourceQuotaBadge />
      <ResourceLink resource={Resources.ResourceQuotas} name={name} namespace={namespace} />
    </>
  )
}