import { Badge } from "@components/base/badge";

interface Props {
  plural?: string;
  group?: string;
  kind?: string;
}

export const CustomResourceBadge = ({ plural, group, kind }: Props): JSX.Element => {
  const badgeText = plural && group 
    ? `${plural}.${group}` 
    : kind?.toLowerCase() || 'custom';
    
  return <Badge color="purple" className='mr-2'>{badgeText}</Badge>
}