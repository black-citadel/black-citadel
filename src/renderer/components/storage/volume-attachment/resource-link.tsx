import { Resources } from "@utils/enums";
import { VolumeAttachmentBadge } from "./badge"
import { ResourceLink } from "@components/base/resource-link";

interface Props {
  name: string;
}

export const VolumeAttachmentResourceLink = ({ name }: Props): JSX.Element => {
  return (
    <>
      <VolumeAttachmentBadge />
      <ResourceLink resource={Resources.VolumeAttachments} name={name} />
    </>
  )
}