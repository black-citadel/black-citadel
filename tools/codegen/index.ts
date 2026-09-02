import { K8sTypeDiscoveryGenerator } from './generators/K8sTypeDiscoveryGenerator';
import { MetaConfigGenerator } from './generators/MetaConfigGenerator';
import { DisplayResourceGenerator } from './generators/DisplayResourceGenerator';

async function main() {
  console.log('Running generators...\n');

  // First discover all nested types
  const discoveryGenerator = new K8sTypeDiscoveryGenerator();
  await discoveryGenerator.generate();

  const metaConfigGenerator = new MetaConfigGenerator();
  await metaConfigGenerator.generate();

  const displayResourceGenerator = new DisplayResourceGenerator();
  await displayResourceGenerator.generate();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
