import { Resources } from "@utils/enums";
import { NetworkPolicyBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const NetworkPolicyResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <NetworkPolicyBadge />
      <ResourceLink resource={Resources.NetworkPolicies} name={name} namespace={namespace} />
    </>
  )
}