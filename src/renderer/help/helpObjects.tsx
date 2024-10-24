import React from 'react';
import { Text, TextLink } from '@components/base/text';

export interface HelpObject {
  help: React.ReactNode;
}

const helpObjects: Record<string, Record<string, HelpObject>> = {
  metadata: {
    name: {
      help: (
        <Text>
          Name must be unique within a namespace. Is required when creating resources, although some resources may allow a 
          client to request the generation of an appropriate name automatically. Name is primarily intended for creation 
          idempotence and configuration definition. Cannot be updated.<br /><br />
          More info: <TextLink href="https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names</TextLink>
        </Text>
      ),
    },
    labels: {
      help: (
        <Text>
          Map of string keys and values that can be used to organize and categorize (scope and select) objects. 
          May match selectors of replication controllers and services.<br /><br />
          More info: <TextLink href="https://kubernetes.io/docs/concepts/overview/working-with-objects/labels">https://kubernetes.io/docs/concepts/overview/working-with-objects/labels</TextLink>
        </Text>
      ),
    },
    annotations: {
      help: (
        <Text>
          Annotations is an unstructured key value map stored with a resource that may be set by external tools 
          to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects.<br /><br />
          More info: <TextLink href="https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations">https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations</TextLink>
        </Text>
      ),
    },
  },
  namespace: {
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
      ),
    },
  },
  pod: {
    phase: {
      help: <Text>
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
    }
  },
  service: {
    selector: {
      title: "Selector",
      help: <Text>
        Route service traffic to pods with label keys and values matching this selector. 
        If empty or not present, the service is assumed to have an external process managing its endpoints, 
        which Kubernetes will not modify. Only applies to types ClusterIP, NodePort, and 
        LoadBalancer. Ignored if type is ExternalName. 
        <br /><br />
        More info: <TextLink href="https://kubernetes.io/docs/concepts/services-networking/service/">https://kubernetes.io/docs/concepts/services-networking/service/</TextLink>
      </Text>
    }
  }
};

export default helpObjects;
