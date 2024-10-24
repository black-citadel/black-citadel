import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { NetworkPolicyBadge } from '@components/networking/network-policy/badge';
import { PolicyTypes } from '@components/networking/network-policy/policy-types';
import { PolicyRules } from '@components/networking/network-policy/policy-rules';

export const NetworkPoliciesDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [networkPolicy, setNetworkPolicy] = useState<k8s.V1NetworkPolicy>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedNetworkPolicy(viewContext.name, viewContext.namespace);
      setNetworkPolicy(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch network policy:", e);
      setError("Failed to fetch network policy.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(networkPolicy);

  return (
    <>
      <DetailsHeader error={error}><NetworkPolicyBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && networkPolicy && (
        <div className="grid grid-cols-2 gap-4">
          <div className='m-2'>
            <DetailsName name={networkPolicy.metadata.name} />
            <DetailsNamespace name={networkPolicy.metadata.namespace} />
            <DetailsLabels labels={networkPolicy.metadata.labels} />
            <DetailsAnnotations annotations={networkPolicy.metadata.annotations} />
          </div>

          <div className='m-2'>
            <DetailsItem label="Pod Selector">
              {Object.entries(networkPolicy.spec.podSelector.matchLabels || {}).map(([key, value]) => (
                <div key={key}>{key}: {value}</div>
              ))}
            </DetailsItem>
            <PolicyTypes policyTypes={networkPolicy.spec.policyTypes} />
            <PolicyRules 
              ingress={networkPolicy.spec.ingress} 
              egress={networkPolicy.spec.egress} 
            />
          </div>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};