import { Text, TextLink } from '../components/base/text';
import { HelpObjectMap } from './types';

export const namespaceHelp: HelpObjectMap = {
  status: {
    help: (
      <Text>
        Phase is the current lifecycle phase of the namespace.<br /><br />
        A namespace can be in one of two phases:<br />
        <ul>
          <li className='my-4'><span className='font-bold text-green-600'>Active:</span> the namespace is in use</li>
          <li className='my-4'><span className='font-bold text-red-600'>Terminating:</span> the namespace is being deleted, and can not be used for new objects</li>
        </ul>
        <br />
        More info: <TextLink href="https://kubernetes.io/docs/tasks/administer-cluster/namespaces/">https://kubernetes.io/docs/tasks/administer-cluster/namespaces/</TextLink>
      </Text>
    )
  }
};