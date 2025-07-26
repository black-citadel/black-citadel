import { V1NetworkPolicy } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsItem, DetailsSelector } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { NetworkPolicyBadge } from '@components/networking/network-policy/badge';
import { PolicyTypes } from '@components/networking/network-policy/policy-types';
import { PolicyRules } from '@components/networking/network-policy/policy-rules';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Heading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { Container } from '@components/base/container';

export const NetworkPoliciesDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [networkPolicy, setNetworkPolicy] = useState<V1NetworkPolicy>();
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

  const handleDelete = async () => {
    await window.electronAPI.deleteNamespacedNetworkPolicy(viewContext.name, viewContext.namespace);
    setViewContext({ resource: Resources.NetworkPolicies, action: ResourceAction.List });
  };

  const handleEdit = () => {
    setViewContext({
      resource: Resources.NetworkPolicies,
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
            resourceType={Resources.NetworkPolicies}
            resourceName={viewContext.name}
            namespace={viewContext.namespace}
            resource={networkPolicy}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        }
      >
        <Heading>
          <NetworkPolicyBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && networkPolicy &&
        <div className='m-2'>
          <Container title="Configuration">
            <div className="grid grid-cols-3 gap-4">
              <DetailsSelector labels={networkPolicy.spec.podSelector.matchLabels} title="Pod Selector" />
              <DetailsItem label="Policy Types">
                {networkPolicy.spec.policyTypes?.join(', ') || 'None'}
              </DetailsItem>
              <DetailsItem label="Total Rules">
                {(networkPolicy.spec.ingress?.length || 0) + (networkPolicy.spec.egress?.length || 0)}
              </DetailsItem>
            </div>
          </Container>

          {networkPolicy.spec.ingress && networkPolicy.spec.ingress.length > 0 && (
            <Container title="Ingress Rules">
              {networkPolicy.spec.ingress.map((rule, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <h4 className="font-bold mb-2">Rule {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {rule.from && rule.from.length > 0 && (
                      <div>
                        <p className="font-semibold mb-1">From:</p>
                        {rule.from.map((from, fromIndex) => (
                          <div key={fromIndex} className="ml-2">
                            {from.ipBlock && <div>IP Block: {from.ipBlock.cidr}</div>}
                            {from.namespaceSelector && <div>Namespace Selector: {JSON.stringify(from.namespaceSelector.matchLabels)}</div>}
                            {from.podSelector && <div>Pod Selector: {JSON.stringify(from.podSelector.matchLabels)}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                    {rule.ports && rule.ports.length > 0 && (
                      <div>
                        <p className="font-semibold mb-1">Ports:</p>
                        {rule.ports.map((port, portIndex) => (
                          <div key={portIndex} className="ml-2">
                            {port.port} ({port.protocol || 'TCP'})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Container>
          )}

          {networkPolicy.spec.egress && networkPolicy.spec.egress.length > 0 && (
            <Container title="Egress Rules">
              {networkPolicy.spec.egress.map((rule, index) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <h4 className="font-bold mb-2">Rule {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {rule.to && rule.to.length > 0 && (
                      <div>
                        <p className="font-semibold mb-1">To:</p>
                        {rule.to.map((to, toIndex) => (
                          <div key={toIndex} className="ml-2">
                            {to.ipBlock && <div>IP Block: {to.ipBlock.cidr}</div>}
                            {to.namespaceSelector && <div>Namespace Selector: {JSON.stringify(to.namespaceSelector.matchLabels)}</div>}
                            {to.podSelector && <div>Pod Selector: {JSON.stringify(to.podSelector.matchLabels)}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                    {rule.ports && rule.ports.length > 0 && (
                      <div>
                        <p className="font-semibold mb-1">Ports:</p>
                        {rule.ports.map((port, portIndex) => (
                          <div key={portIndex} className="ml-2">
                            {port.port} ({port.protocol || 'TCP'})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Container>
          )}

          <MetadataDetails metadata={networkPolicy.metadata} />
        </div>
      }

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};