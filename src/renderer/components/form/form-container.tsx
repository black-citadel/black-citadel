import { Container } from '@components/base/container';
import { Dropdown, DropdownOption } from '@components/base/dropdown';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { InputArray } from '@components/base/input-array';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';

export function FormContainer() {
	return (
		<>
			<Field>
				<Label>Container Name</Label>
				<Description>
					Name for the container (optional, defaults to pod name).
				</Description>
				<Input
					name="containerName"
					placeholder="e.g., nginx"
				/>
			</Field>

			<Container title='Image'>
				<Field>
					<Label>Image name <HelpButton title="Image" content={helpObjects.pod.image.help} /></Label>
					<Description>
						Docker image to use for the container.
					</Description>
					<Input
						name="image"
						placeholder="e.g., nginx:latest"
					/>
				</Field>

				<Field>
					<Label>Image pull policy</Label>
					<Description>
						Policy for pulling the image. If not set, defaults to 'IfNotPresent'.
					</Description>
					<Dropdown
						name="pullPolicy"
						options={[
							{ value: 'IfNotPresent', label: 'IfNotPresent' },
							{ value: 'Always', label: 'Always' },
							{ value: 'Never', label: 'Never' },

						] as DropdownOption<'IfNotPresent' | 'Always' | 'Never'>[]} value={'IfNotPresent'}
						onChange={function (value: 'None' | 'ClientIP'): void {
							throw new Error('Function not implemented.');
						}} />
				</Field>
			</Container>

			<Container title='Entrypoint'>
				<Field>
					<Label>Command</Label>
					<Description>
						Command to run in the container (optional).
					</Description>
					<InputArray values={['sh', '-c', 'while true; do echo sidecar; sleep 30; done']} onChange={function (values: string[]): void {
						throw new Error('Function not implemented.');
					} } />
				</Field>

				<Field>
					<Label>Arguments</Label>
					<Description>
						Arguments to pass to the command (optional).
					</Description>
					<InputArray values={[]} onChange={function (values: string[]): void {
						throw new Error('Function not implemented.');
					} } />
				</Field>

				<Field>
					<Label>Working Direrctory</Label>
					<Description>
						Working directory for the command (optional).
					</Description>
					<Input
						name="workingDir"
						placeholder="e.g., /app"
					/>
				</Field>
			</Container>
		</>
	);
}