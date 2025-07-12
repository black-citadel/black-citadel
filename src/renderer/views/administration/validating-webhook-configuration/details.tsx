import { V1ValidatingWebhookConfiguration } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { ValidatingWebhookConfigurationBadge } from '@components/administration/validating-webhook-configuration/badge';
import { WebhookList } from '@components/administration/mutating-webhook-configuration/webhook-list';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';

export const ValidatingWebhookConfigurationsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [validatingWebhookConfiguration, setValidatingWebhookConfiguration] = useState<V1ValidatingWebhookConfiguration>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readValidatingWebhookConfiguration(viewContext.name);
      setValidatingWebhookConfiguration(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch validating webhook configuration:", e);
      setError("Failed to fetch validating webhook configuration.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(validatingWebhookConfiguration);

  return (
    <>
      <DetailsHeader error={error}>
        <Heading>
          <ValidatingWebhookConfigurationBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && validatingWebhookConfiguration && (
        <div className='m-2'>
          <MetadataDetails metadata={validatingWebhookConfiguration.metadata} />

          <Subheading className='mt-8 mb-4'>Configuration</Subheading>
          <WebhookList webhooks={validatingWebhookConfiguration.webhooks} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};