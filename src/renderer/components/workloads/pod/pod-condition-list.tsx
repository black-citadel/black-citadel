import { V1PodCondition } from '@utils/k8s-types';
import { Status } from '@protoku-bv/design-system';

interface PodConditionListProps {
	conditions: V1PodCondition[];
}

export const PodConditionList = ({ conditions }: PodConditionListProps): JSX.Element => {
	const getConditionStatus = (type: string): boolean => {
		const condition = conditions.find(c => c.type === type);
		return condition?.status === 'True';
	};

	const conditionTypes = [
		{ type: 'PodScheduled', label: 'Pod Scheduled' },
		{ type: 'PodReadyToStartContainers', label: 'Pod Ready To Start Containers' },
		{ type: 'ContainersReady', label: 'Containers Ready' },
		{ type: 'Initialized', label: 'Initialized' },
		{ type: 'Ready', label: 'Ready' },
		{ type: 'DisruptionTarget', label: 'Disruption Target' },
		{ type: 'PodResizePending', label: 'Pod Resize Pending' },
		{ type: 'PodResizeInProgress', label: 'Pod Resize In Progress' }
	];

	return (
		<div className="grid grid-cols-4 gap-4">
			{conditionTypes.map(({ type, label }) => {
				const isTrue = getConditionStatus(type);
				return (
					<Status
						key={type}
						variant={isTrue ? 'success' : 'default'}
					>
						{label}
					</Status>
				);
			})}
		</div>
	);
};