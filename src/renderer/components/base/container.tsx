import { Subheading } from "./heading"

interface Props {
	title?: string,
	children: React.ReactNode,
}

export const Container = ({ title, children }: Props): JSX.Element => {

	return (
		<>
			{title && (<Subheading className='mt-8 mb-4'>{ title }</Subheading>)}

			<div className='border border-dotted border-neutral-800 pt-4 pb-8 px-4 mt-4'>
				{children}
			</div>
		</>
	)
}