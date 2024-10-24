import React, { useEffect, useState } from 'react';
import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar';
import { useView } from '@context/viewProvider';
import { ResourceTabs } from "@utils/enums";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { SecretBadge } from '@components/configuration/secret/badge';
import { Heading, Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';

export const SecretsDetailsView = (): JSX.Element => {
  const { viewContext } = useView();
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details);
  const [secret, setSecret] = useState<k8s.V1Secret>();
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

  const toggleRevealSecret = (key: string) => {
    setRevealedSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderSecretData = () => {
    if (!secret || !secret.data) return "No data";
    return Object.entries(secret.data).map(([key, value]) => {
      const isRevealed = revealedSecrets[key];
      const decodedValue = isRevealed ? atob(value) : '••••••••';
      return (
        <DetailsItem key={key} label={key}>
          <div className="flex items-center">
            <span className="text-xs mr-2 font-mono">{decodedValue}</span>
            <button 
              className="text-blue-600 text-xs"
              onClick={() => toggleRevealSecret(key)}
            >
              {isRevealed ? 'Hide' : 'Reveal'}
            </button>
          </div>
        </DetailsItem>
      );
    });
  };

  return (
    <>
      <DetailsHeader error={error}>
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
        <MetadataDetails metadata={secret.metadata} />

        <Subheading className='mt-8 mb-4'>Configuration</Subheading>
            <DetailsItem label="Type">
              {secret.type}
            </DetailsItem>

            <DetailsItem label="Data">
              {renderSecretData()}
            </DetailsItem>

        </div>
      )}
      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};