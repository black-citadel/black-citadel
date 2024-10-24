import { Resources } from "@utils/enums";
import { MutatingWebhookConfigurationBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const MutatingWebhookConfigurationResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <MutatingWebhookConfigurationBadge />
      <ResourceLink resource={Resources.MutatingWebhookConfigurations} name={name} />
    </>
  )
}