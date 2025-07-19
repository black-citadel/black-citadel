import { V1ServiceAccount } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { ServiceAccountBadge } from '@components/access-control/service-account/badge';
import { ImagePullSecretList } from '@components/access-control/service-account/image-pull-secret-list';
import { SecretList } from '@components/access-control/service-account/secret-list';
import { MetadataDetails } from '@components/metadata';
import { Heading } from '@components/base/heading';
import { DetailsItem } from '@components/details-item';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Container } from '@components/base/container';


export const ServiceAccountsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [serviceAccount, setServiceAccount] = useState<V1ServiceAccount>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedServiceAccount(viewContext.name, viewContext.namespace);
      setServiceAccount(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch service account:", e);
      setError("Failed to fetch service account.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(serviceAccount);

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedServiceAccount(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.ServiceAccounts, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.ServiceAccounts}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={serviceAccount}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <ServiceAccountBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
            <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && serviceAccount && (
        <div className='m-2'>
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
              <DetailsItem label="Automount Service Account Token">
                {serviceAccount.automountServiceAccountToken === undefined ? 'Default (true)' : serviceAccount.automountServiceAccountToken.toString()}
              </DetailsItem>
              <SecretList secrets={serviceAccount.secrets} />
              <ImagePullSecretList imagePullSecrets={serviceAccount.imagePullSecrets} />
            </div>
          </Container>

          <MetadataDetails metadata={serviceAccount.metadata} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};