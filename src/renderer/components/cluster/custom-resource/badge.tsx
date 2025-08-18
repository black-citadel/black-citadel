import { Badge } from '@protoku-bv/design-system';

interface Props {
  plural?: string;
  group?: string;
  kind?: string;
}

export const CustomResourceBadge = ({ plural, group, kind }: Props): JSX.Element => {
  const badgeText = plural && group 
    ? `${plural}.${group}` 
    : kind?.toLowerCase() || 'custom';
    
  return <Badge variant="gray" className='mr-2'>{badgeText}</Badge>
}