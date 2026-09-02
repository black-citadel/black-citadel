import { Fragment, isValidElement } from "react"
import clsx from "clsx"
import { Subheading } from "../base/heading"
import { DescriptionList, DescriptionTerm, DescriptionDetails } from "../base/description-list"

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

// An unset field carries no information, so it is not shown. Empty strings, empty arrays and
// false booleans count as unset: Kubernetes omits them from the object in the same way.
export function hasValue<T>(value: T | null | undefined): value is T {
	if (value === undefined || value === null || value === '' || value === false) {
		return false
	}
	return !(Array.isArray(value) && value.length === 0)
}

const renderValue = (value: unknown): React.ReactNode => {
	if (value instanceof Date) {
		return value.toLocaleString()
	}
	if (value === true) {
		return 'Yes'
	}
	if (isValidElement(value)) {
		return value
	}
	if (Array.isArray(value)) {
		if (value.every((item) => isValidElement(item))) {
			return <>{value}</>
		}
		if (value.every((item) => typeof item === 'string' || typeof item === 'number')) {
			return (
				<ul className='font-mono text-xs leading-5'>
					{value.map((item, index) => <li key={index}>{String(item)}</li>)}
				</ul>
			)
		}
		return <pre className='font-mono text-xs whitespace-pre-wrap'>{JSON.stringify(value, null, 2)}</pre>
	}
	if (typeof value === 'object') {
		return <pre className='font-mono text-xs whitespace-pre-wrap'>{JSON.stringify(value, null, 2)}</pre>
	}
	return String(value)
}

export interface PanelGridItem {
	label: string;
	value: unknown;
	description?: string;
}

export interface PanelGridFlag {
	label: string;
	value?: boolean | null;
	description?: string;
}

interface PanelGridProps {
	title?: string;
	items: PanelGridItem[];
	/** Booleans; only the ones that are set are shown, as a single row of tags. */
	flags?: PanelGridFlag[];
	columns?: number;
}

const splitEvenly = <T,>(list: T[], parts: number): T[][] => {
	const size = Math.ceil(list.length / parts)
	return Array.from({ length: parts }, (_, index) => list.slice(index * size, (index + 1) * size))
		.filter((chunk) => chunk.length > 0)
}

export const PanelGrid = ({ title, items, flags = [], columns = 1 }: PanelGridProps): JSX.Element | null => {
	const visibleItems = items.filter((item) => hasValue(item.value))
	const activeFlags = flags.filter((flag) => flag.value === true)

	if (visibleItems.length === 0 && activeFlags.length === 0) {
		return null
	}

	if (activeFlags.length > 0) {
		visibleItems.push({
			label: 'Flags',
			value: (
				<span className='flex flex-wrap gap-1'>
					{activeFlags.map((flag) => (
						<span
							key={flag.label}
							title={flag.description}
							className='inline-flex items-center rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-200'
						>
							{flag.label}
						</span>
					))}
				</span>
			),
		})
	}

	const lists = splitEvenly(visibleItems, columns > 1 ? 2 : 1)

	return (
		<div className='mb-4'>
			{title && (<Subheading className='mb-2'>{title}</Subheading>)}

			<div className={clsx('grid gap-x-8', lists.length > 1 && 'xl:grid-cols-2')}>
				{lists.map((chunk, listIndex) => (
					<DescriptionList key={listIndex}>
						{chunk.map((item, index) => (
							<Fragment key={index}>
								<DescriptionTerm title={item.description}>{item.label}</DescriptionTerm>
								<DescriptionDetails>{renderValue(item.value)}</DescriptionDetails>
							</Fragment>
						))}
					</DescriptionList>
				))}
			</div>
		</div>
	)
}

interface PanelListItemProps {
	title?: string;
	children: React.ReactNode;
}

// One entry of an array of nested objects, separated from its siblings and titled when the
// object has a name.
export const PanelListItem = ({ title, children }: PanelListItemProps): JSX.Element => {
	return (
		<div className='[&:not(:first-child)]:mt-4 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-neutral-800 [&:not(:first-child)]:pt-4'>
			{title && (<Subheading className='mb-2 text-zinc-300'>{title}</Subheading>)}
			{children}
		</div>
	)
}
