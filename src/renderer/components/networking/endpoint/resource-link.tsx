import { Resources } from "@utils/enums";
import { EndpointBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const EndpointResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <EndpointBadge />
      <ResourceLink resource={Resources.Endpoints} name={name} namespace={namespace} />
    </>
  )
}