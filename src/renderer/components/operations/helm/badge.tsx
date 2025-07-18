import { Badge } from '@protoku/design-system';

interface HelmStatusBadgeProps {
  status: string;
}

export const HelmStatusBadge = ({ status }: HelmStatusBadgeProps): JSX.Element => {
  const getVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'deployed':
        return 'green';
      case 'pending':
      case 'pending-install':
      case 'pending-upgrade':
      case 'pending-rollback':
        return 'yellow';
      case 'failed':
      case 'uninstalling':
        return 'red';
      case 'superseded':
      case 'uninstalled':
        return 'gray';
      default:
        return 'blue';
    }
  };

  return <Badge variant={getVariant(status)}>{status}</Badge>;
};