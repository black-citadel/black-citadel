import { Resources } from "@utils/enums";
import { SecretBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const SecretResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <SecretBadge />
      <ResourceLink resource={Resources.Secrets} name={name} namespace={namespace} />
    </>
  )
}