import { V1MutatingWebhookConfiguration } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { MutatingWebhookConfigurationBadge } from '@components/administration/mutating-webhook-configuration/badge';
import { WebhookList } from '@components/administration/mutating-webhook-configuration/webhook-list';
import { Heading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { Container } from '@components/base/container';

export const MutatingWebhookConfigurationsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [mutatingWebhookConfiguration, setMutatingWebhookConfiguration] = useState<V1MutatingWebhookConfiguration>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readMutatingWebhookConfiguration(viewContext.name);
      setMutatingWebhookConfiguration(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch mutating webhook configuration:", e);
      setError("Failed to fetch mutating webhook configuration.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(mutatingWebhookConfiguration);

  return (
    <>
      <DetailsHeader error={error}>
        <Heading>
          <MutatingWebhookConfigurationBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && mutatingWebhookConfiguration && (
        <div className='m-2'>
          <Container title="Webhooks">
            <WebhookList webhooks={mutatingWebhookConfiguration.webhooks} />
          </Container>

          <MetadataDetails metadata={mutatingWebhookConfiguration.metadata} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};