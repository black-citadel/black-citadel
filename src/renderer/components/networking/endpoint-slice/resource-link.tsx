import { Resources } from "@utils/enums";
import { EndpointSliceBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const EndpointSliceResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <EndpointSliceBadge />
      <ResourceLink resource={Resources.EndpointSlices} name={name} namespace={namespace} />
    </>
  )
}