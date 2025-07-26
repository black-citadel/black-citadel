import React, { useEffect, useState } from 'react';
import { V1Secret } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar';
import { useView } from '@context/viewProvider';
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { SecretBadge } from '@components/configuration/secret/badge';
import { Heading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { ResourceActions } from '@components/resources/ResourceActions';
import { PanelGrid } from '@components/layout/panel';

export const SecretsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details);
  const [secret, setSecret] = useState<V1Secret>();
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
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

  const toggleRevealSecret = (key: string) => {
    setRevealedSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getSecretDataItems = () => {
    if (!secret || !secret.data) return [];
    return Object.entries(secret.data).map(([key, value]) => {
      const isRevealed = revealedSecrets[key];
      const decodedValue = isRevealed ? atob(value) : '••••••••';
      return {
        label: key,
        value: (
          <div className="flex items-center">
            <span className="text-xs mr-2">{decodedValue}</span>
            <button 
              className="text-blue-600 text-xs hover:text-blue-700"
              onClick={() => toggleRevealSecret(key)}
            >
              {isRevealed ? 'Hide' : 'Reveal'}
            </button>
          </div>
        )
      };
    });
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

      {activeTab === ResourceTabs.Details && secret && (
        <div className='m-2'>
          <PanelGrid
            title="Configuration"
            items={[
              { label: 'Type', value: secret.type }
            ]}
            columns={1}
          />

          <PanelGrid
            title="Secret Data"
            items={getSecretDataItems()}
            columns={1}
          />

          <MetadataDetails metadata={secret.metadata} />
        </div>
      )}
      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};