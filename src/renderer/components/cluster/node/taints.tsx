import k8s from '@kubernetes/client-node';
import { Badge } from '@components/base/badge';
import { calculateAge } from '@utils/helpers';

interface Props {
    taints?: k8s.V1Taint[];
}

export const NodeTaints = ({ taints }: Props): JSX.Element => {
    if (!taints || taints.length === 0) {
        return (
            <div className="p-4 bg-green-800/20 border border-green-500 rounded-md">
                <p className="text-sm text-green-500">No taints - All pods can be scheduled on this node</p>
            </div>
        );
    }

    const getTaintVariant = (effect?: string): "error" | "warning" | "secondary" => {
        switch (effect) {
            case 'NoSchedule':
                return 'error';
            case 'PreferNoSchedule':
                return 'warning';
            case 'NoExecute':
                return 'error';
            default:
                return 'secondary';
        }
    };

    const getTaintDescription = (effect?: string): string => {
        switch (effect) {
            case 'NoSchedule':
                return 'New pods without this toleration will not be scheduled here';
            case 'PreferNoSchedule':
                return 'Scheduler will try to avoid placing pods without this toleration here';
            case 'NoExecute':
                return 'Existing pods without this toleration will be evicted';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-3">
            {taints.map((taint, index) => (
                <div key={index} className="p-4 bg-neutral-900 border border-neutral-700 rounded-md">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Badge variant={getTaintVariant(taint.effect)} className="text-sm">
                                {taint.effect}
                            </Badge>
                            <code className="text-sm font-mono bg-black/50 px-2 py-1 rounded">
                                {taint.key}{taint.value ? `=${taint.value}` : ''}
                            </code>
                        </div>
                        {taint.timeAdded && (
                            <span className="text-xs text-zinc-500">
                                Added {calculateAge(new Date(taint.timeAdded))} ago
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">
                        {getTaintDescription(taint.effect)}
                    </p>
                </div>
            ))}
        </div>
    );
};