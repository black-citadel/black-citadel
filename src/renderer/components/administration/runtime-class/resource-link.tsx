import { Resources } from "@utils/enums";
import { RuntimeClassBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const RuntimeClassResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <RuntimeClassBadge />
      <ResourceLink resource={Resources.RuntimeClasses} name={name} />
    </>
  )
}