import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { MutatingWebhookConfigurationBadge } from '@components/administration/mutating-webhook-configuration/badge';
import { WebhookList } from '@components/administration/mutating-webhook-configuration/webhook-list';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';

export const MutatingWebhookConfigurationsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [mutatingWebhookConfiguration, setMutatingWebhookConfiguration] = useState<k8s.V1MutatingWebhookConfiguration>();
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
          <MetadataDetails metadata={mutatingWebhookConfiguration.metadata} />
          
          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <WebhookList webhooks={mutatingWebhookConfiguration.webhooks} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};