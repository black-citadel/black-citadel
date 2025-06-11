import { Text, TextLink } from '../components/base/text';
import { HelpObjectMap } from './types';

export const serviceHelp: HelpObjectMap = {
  selector: {
    help: (
      <Text>
        Route service traffic to pods with label keys and values matching this selector. 
        If empty or not present, the service is assumed to have an external process managing its endpoints, 
        which Kubernetes will not modify. Only applies to types ClusterIP, NodePort, and 
        LoadBalancer. Ignored if type is ExternalName. 
        <br /><br />
        More info: <TextLink href="https://kubernetes.io/docs/concepts/services-networking/service/">https://kubernetes.io/docs/concepts/services-networking/service/</TextLink>
      </Text>
    )
  }
};