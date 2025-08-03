import { V1NetworkPolicy } from '@utils/k8s-types';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { NetworkPolicyBadge } from '@components/networking/network-policy/badge';
import { ResourceActions } from '@components/resources/ResourceActions';
import { Heading } from '@components/base/heading';
import { NetworkPolicyDetails } from '@components/gen/V1NetworkPolicy/details';

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

      {activeTab === ResourceTabs.Details && networkPolicy && <NetworkPolicyDetails resourceData={networkPolicy} />}
      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};