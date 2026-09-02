import { Subheading } from "./heading"

interface Props {
	title?: string,
	children: React.ReactNode,
	/** Number of entries, shown next to the title. */
	count?: number,
	/** Render as a disclosure the user can fold away. */
	collapsible?: boolean,
	/** Initial state of a collapsible container. */
	defaultOpen?: boolean,
}

export const Container = ({ title, children, count, collapsible = false, defaultOpen = true }: Props): JSX.Element => {
	const heading = title && (
		<span className='inline-flex items-center gap-2'>
			<Subheading>{title}</Subheading>
			{count !== undefined && (
				<span className='rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300'>{count}</span>
			)}
		</span>
	)

	if (!collapsible) {
		return (
			<>
				{heading && (<div className='mt-4'>{heading}</div>)}

				<div className='border border-dotted border-neutral-800 p-4 mt-2 mb-4'>
					{children}
				</div>
			</>
		)
	}

	return (
		<details className='group mt-4 mb-4' open={defaultOpen}>
			<summary className='flex cursor-pointer select-none list-none items-center gap-2 [&::-webkit-details-marker]:hidden'>
				<svg
					className='size-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-90'
					viewBox='0 0 16 16'
					fill='none'
					aria-hidden='true'
				>
					<path d='M6 4l4 4-4 4' stroke='currentColor' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' />
				</svg>
				{heading}
			</summary>

			<div className='border border-dotted border-neutral-800 p-4 mt-2'>
				{children}
			</div>
		</details>
	)
}
