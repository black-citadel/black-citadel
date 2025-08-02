import { useEffect, useState } from 'react';
import { V1Secret } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar';
import { useView } from '@context/viewProvider';
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { SecretBadge } from '@components/configuration/secret/badge';
import { Heading } from '@components/base/heading';
import { ResourceActions } from '@components/resources/ResourceActions';
import { SecretDetails } from '@components/gen/V1Secret/details';

export const SecretsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details);
  const [secret, setSecret] = useState<V1Secret>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedSecret(viewContext.name, viewContext.namespace);
      setSecret(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch secret:", e);
      setError("Failed to fetch secret.");
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(secret);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedSecret(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.Secrets, action: ResourceAction.List });
  };


  const handleEdit = () => {
    setViewContext({
      resource: Resources.Secrets,
      action: ResourceAction.Edit,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.Secrets}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={secret}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <SecretBadge />{viewContext.name}
        </Heading>

        <Navbar>
        <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && secret && <SecretDetails resourceData={secret} />}
      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};