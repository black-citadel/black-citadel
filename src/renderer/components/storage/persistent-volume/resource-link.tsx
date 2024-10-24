import { Resources } from "@utils/enums";
import { PersistentVolumeBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const PersistentVolumeResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <PersistentVolumeBadge />
      <ResourceLink resource={Resources.PersistentVolumes} name={name} />
    </>
  )
}