import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { RoleBadge } from '@components/access-control/role/badge';
import { RuleList } from '@components/access-control/cluster-role/rule-list';
import { MetadataDetails } from '@components/metadata';
import { Subheading } from '@components/base/heading';


export const RolesDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [role, setRole] = useState<k8s.V1Role>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedRole(viewContext.name, viewContext.namespace);
      setRole(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch role:", e);
      setError("Failed to fetch role.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(role);

  return (
    <>
      <DetailsHeader error={error}><RoleBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && role && (
        <div className='m-2'>
          <MetadataDetails metadata={role.metadata} />

          <Subheading className='mt-8 mb-4'>Rules</Subheading>
          <RuleList rules={role.rules} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};