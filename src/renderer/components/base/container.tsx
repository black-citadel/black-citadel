import { Subheading } from "./heading"

interface Props {
	title?: string,
	children: React.ReactNode,
}

export const Container = ({ title, children }: Props): JSX.Element => {

	return (
		<>
			{title && (<Subheading className='mt-8'>{ title }</Subheading>)}

			<div className='border border-dotted border-neutral-800 p-4 mt-2'>
				{children}
			</div>
		</>
	)
}