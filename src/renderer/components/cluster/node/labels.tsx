import { Badge } from '@protoku/design-system';

interface Props {
    labels?: { [key: string]: string };
}

export const NodeLabels = ({ labels }: Props): JSX.Element => {
    if (!labels || Object.keys(labels).length === 0) {
        return <div className="text-sm text-gray-500">No labels</div>;
    }

    // Categorize labels
    const roleLabels: [string, string][] = [];
    const kubernetesLabels: [string, string][] = [];
    const customLabels: [string, string][] = [];

    Object.entries(labels).forEach(([key, value]) => {
        if (key.includes('role')) {
            roleLabels.push([key, value]);
        } else if (key.startsWith('kubernetes.io/') || key.startsWith('node.kubernetes.io/')) {
            kubernetesLabels.push([key, value]);
        } else {
            customLabels.push([key, value]);
        }
    });

    return (
        <div className="space-y-4">
            {/* Role Labels - Most prominent */}
            {roleLabels.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-2 text-zinc-300">Roles</h4>
                    <div className="flex flex-wrap gap-2">
                        {roleLabels.map(([key, _value]) => (
                            <Badge key={key} variant="blue" className="text-sm">
                                {key.replace('node-role.kubernetes.io/', '')}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Labels - Important for node selectors */}
            {customLabels.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-2 text-zinc-300">Custom Labels (Node Selectors)</h4>
                    <div className="flex flex-wrap gap-2">
                        {customLabels.map(([key, value]) => (
                            <Badge key={key} variant="gray" className="text-sm">
                                {key}{value && value !== 'true' ? `=${value}` : ''}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Kubernetes System Labels */}
            {kubernetesLabels.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium mb-2 text-zinc-400">System Labels</h4>
                    <div className="flex flex-wrap gap-2">
                        {kubernetesLabels.map(([key, value]) => (
                            <Badge key={key} variant="gray" className="text-xs">
                                {key}={value}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};