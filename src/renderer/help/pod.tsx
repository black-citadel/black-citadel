import { Text, TextLink } from '../components/base/text';
import { HelpObjectMap } from './types';

export const podHelp: HelpObjectMap = {
  phase: {
    help: (
      <Text>
        The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle.<br />
        The conditions array, the reason and message fields, and the individual container status arrays contain more detail about the pod's status.<br /><br />
        There are five possible phase values:
        <br />
        <ul>
          <li className='my-4'>Pending: The pod has been accepted by the Kubernetes system, but one or more of the container images
          has not been created. This includes time before being scheduled as well as time spent downloading images over the network, which could take
          a while.</li>
          <li className='my-4'>Running: The pod has been bound to a node, and all of the containers have been created.
          At least one container is still running, or is in the process of starting or restarting.</li>
          <li className='my-4'>Succeeded: All containers in the pod have terminated in success, and will not be restarted.</li>
          <li className='my-4'>Failed: All containers in the pod have terminated, and at least one container has terminated in failure.
          The container either exited with non-zero status or was terminated by the system.</li>
          <li className='my-4'>Unknown: For some reason the state of the pod could not be obtained, typically due to an error in communicating with the host of the pod.</li>
        </ul>
        More info: <TextLink href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase">https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#pod-phase</TextLink>
      </Text>
    )
  },
  image: {
    help: (
      <Text>
        Container images are the basis of containers. An image is a read-only template with instructions for creating a container.
        Often, an image is based on another image, with some additional customization.<br /><br />
        You can specify the image in several ways:
        <ul>
          <li className='my-4'><span className='font-bold'>Registry/Name:Tag</span> - e.g., nginx:1.21</li>
          <li className='my-4'><span className='font-bold'>Full Registry Path</span> - e.g., docker.io/library/nginx:latest</li>
          <li className='my-4'><span className='font-bold'>Private Registry</span> - e.g., my-registry.com/my-app:v1.0.0</li>
        </ul>
        If you don't specify a tag, Kubernetes will try to pull the 'latest' tag.<br /><br />
        More info: <TextLink href="https://kubernetes.io/docs/concepts/containers/images/">https://kubernetes.io/docs/concepts/containers/images/</TextLink>
      </Text>
    )
  }
};