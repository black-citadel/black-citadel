import { metadataHelp } from './metadata';
import { namespaceHelp } from './namespace';
import { podHelp } from './pod';
import { serviceHelp } from './service';

const helpObjects = {
  metadata: metadataHelp,
  namespace: namespaceHelp,
  pod: podHelp,
  service: serviceHelp
};

export default helpObjects;