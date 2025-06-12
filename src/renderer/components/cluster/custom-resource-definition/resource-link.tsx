import { Resources } from "@utils/enums";
import { CustomResourceDefinitionBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name?: string;
}

export const CustomResourceDefinitionResourceLink = ({ name }: Props): JSX.Element => {
  if (!name) return <></>;
  
  return (
    <>
      <CustomResourceDefinitionBadge />
      <ResourceLink resource={Resources.CustomResourceDefinitions} name={name} />
    </>
  )
}