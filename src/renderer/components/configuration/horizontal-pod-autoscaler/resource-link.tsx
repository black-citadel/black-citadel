import { Resources } from "@utils/enums";
import { HorizontalPodAutoscalerBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
  namespace: string;
}

export const HorizontalPodAutoscalerResourceLink = ({ name, namespace }: Props): JSX.Element => {
  return (
    <>
      <HorizontalPodAutoscalerBadge />
      <ResourceLink resource={Resources.HorizontalPodAutoscalers} name={name} namespace={namespace} />
    </>
  )
}