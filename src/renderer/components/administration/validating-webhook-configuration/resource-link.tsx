import { Resources } from "@utils/enums";
import { ValidatingWebhookConfigurationBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const ValidatingWebhookConfigurationResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <ValidatingWebhookConfigurationBadge />
      <ResourceLink resource={Resources.ValidatingWebhookConfigurations} name={name} />
    </>
  )
}