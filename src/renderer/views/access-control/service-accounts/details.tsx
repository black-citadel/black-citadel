import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { ServiceAccountBadge } from '@components/access-control/service-account/badge';
import { ImagePullSecretList } from '@components/access-control/service-account/image-pull-secret-list';
import { SecretList } from '@components/access-control/service-account/secret-list';
import { MetadataDetails } from '@components/metadata';
import { Subheading } from '@components/base/heading';
import { DetailsItem } from '@components/details-item';


export const ServiceAccountsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [serviceAccount, setServiceAccount] = useState<k8s.V1ServiceAccount>();
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

  return (
    <>
      <DetailsHeader error={error}><ServiceAccountBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && serviceAccount && (
        <div className='m-2'>
          <MetadataDetails metadata={serviceAccount.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <DetailsItem label="Automount Service Account Token">
            {serviceAccount.automountServiceAccountToken === undefined ? 'Default (true)' : serviceAccount.automountServiceAccountToken.toString()}
          </DetailsItem>
          <SecretList secrets={serviceAccount.secrets} />
          <ImagePullSecretList imagePullSecrets={serviceAccount.imagePullSecrets} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};