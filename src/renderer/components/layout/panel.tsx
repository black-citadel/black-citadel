import { Subheading } from "../base/heading"
import { DetailsItem } from "../details-item"

interface PanelProps {
	title?: string,
	children: React.ReactNode,
}

export const Panel = ({ title, children }: PanelProps): JSX.Element => {

	return (
		<>
			{title && (<Subheading className='mt-8 mb-4'>{ title }</Subheading>)}

			<div className='border border-dotted border-neutral-800 p-4 mt-4'>
				{children}
			</div>
		</>
	)
}


interface PanelGridItem {
	label: string;
	value: React.ReactNode;
}

interface PanelGridProps {
	title?: string;
	items: PanelGridItem[];
	columns?: number;
}

export const PanelGrid = ({ title, items, columns = 3 }: PanelGridProps): JSX.Element => {
	const gridColsClass = columns === 2 ? 'grid-cols-2' : 
	                     columns === 4 ? 'grid-cols-4' : 
	                     columns === 5 ? 'grid-cols-5' : 'grid-cols-3';
	
	return (
		<>
			{title && (<Subheading className='mb-4'>{title}</Subheading>)}

			<div className='border border-dotted border-neutral-800 p-4 mt-4 mb-4 font-titillium'>
				{items.length === 0 ? (
					<div className='italic text-neutral-400 text-sm'>No data</div>
				) : (
					<div className={`grid ${gridColsClass} gap-4`}>
						{items.map((item, index) => (
							<DetailsItem key={index} label={item.label}>
								{item.value}
							</DetailsItem>
						))}
					</div>
				)}
			</div>
		</>
	)
}