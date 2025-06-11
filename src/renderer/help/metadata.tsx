import { Text, TextLink } from '../components/base/text';
import { HelpObjectMap } from './types';

export const metadataHelp: HelpObjectMap = {
  name: {
    help: (
      <Text>
        Name must be unique within a namespace. Is required when creating resources, although some resources may allow a 
        client to request the generation of an appropriate name automatically. Name is primarily intended for creation 
        idempotence and configuration definition. Cannot be updated.<br /><br />
        More info: <TextLink href="https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names</TextLink>
      </Text>
    )
  },
  labels: {
    help: (
      <Text>
        Map of string keys and values that can be used to organize and categorize (scope and select) objects. 
        May match selectors of replication controllers and services.<br /><br />
        More info: <TextLink href="https://kubernetes.io/docs/concepts/overview/working-with-objects/labels">https://kubernetes.io/docs/concepts/overview/working-with-objects/labels</TextLink>
      </Text>
    )
  },
  annotations: {
    help: (
      <Text>
        Annotations is an unstructured key value map stored with a resource that may be set by external tools 
        to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects.<br /><br />
        More info: <TextLink href="https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations">https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations</TextLink>
      </Text>
    )
  }
};