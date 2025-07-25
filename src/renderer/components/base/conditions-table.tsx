import { Status } from '@protoku/design-system';
import { calculateAge } from '@utils/helpers';
import { Container } from '@components/base/container';

interface Condition {
  type: string;
  status: string;
  lastTransitionTime?: string | Date;
  lastUpdateTime?: string | Date;
  lastHeartbeatTime?: string | Date;
  reason?: string;
  message?: string;
}

interface Props {
  conditions: Condition[];
  title?: string;
}

export const ConditionsTable = ({ conditions, title = "Conditions" }: Props): JSX.Element => {
  if (!conditions || conditions.length === 0) return <></>;

  return (
    <Container title={title}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left font-medium text-zinc-400 py-2 pr-4">Condition</th>
              <th className="text-left font-medium text-zinc-400 py-2 pr-4">Status</th>
              <th className="text-left font-medium text-zinc-400 py-2 pr-4">Last Transition</th>
              <th className="text-left font-medium text-zinc-400 py-2 pr-4">Last Update</th>
              <th className="text-left font-medium text-zinc-400 py-2 pr-4">Reason</th>
              <th className="text-left font-medium text-zinc-400 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {conditions.map((condition, index) => (
              <tr key={index} className="border-b border-neutral-800 last:border-0">
                <td className="py-2 pr-4">{condition.type}</td>
                <td className="py-2 pr-4">
                  <Status variant={condition.status === 'True' ? 'success' : 'default'}>
                    {condition.status}
                  </Status>
                </td>
                <td className="py-2 pr-4 text-zinc-500">
                  {condition.lastTransitionTime ? calculateAge(new Date(condition.lastTransitionTime)) : '-'}
                </td>
                <td className="py-2 pr-4 text-zinc-500">
                  {(condition.lastUpdateTime || condition.lastHeartbeatTime) 
                    ? calculateAge(new Date((condition.lastUpdateTime || condition.lastHeartbeatTime)!)) 
                    : '-'}
                </td>
                <td className="py-2 pr-4 text-zinc-500">
                  {condition.reason || '-'}
                </td>
                <td className="py-2 text-zinc-500 text-xs">
                  {condition.message || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};