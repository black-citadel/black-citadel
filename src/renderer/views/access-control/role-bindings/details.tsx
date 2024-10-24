import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { RoleBindingBadge } from '@components/access-control/role-binding/badge';
import { SubjectList } from '@components/access-control/subject-list';
import { Subheading } from '@components/base/heading';
import { MetadataDetails } from '@components/metadata';
import { RoleResourceLink } from '@components/access-control/role/resource-link';

export const RoleBindingsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [roleBinding, setRoleBinding] = useState<k8s.V1RoleBinding>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedRoleBinding(viewContext.name, viewContext.namespace);
      setRoleBinding(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch role binding:", e);
      setError("Failed to fetch role binding.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(roleBinding);

  return (
    <>
      <DetailsHeader error={error}><RoleBindingBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && roleBinding && (
        <div className='m-2'>
          <MetadataDetails metadata={roleBinding.metadata} />

          <Subheading className='mt-8 mb-4'>Role Reference</Subheading>
          <RoleResourceLink name={roleBinding.roleRef.name} namespace={roleBinding.metadata.namespace} />

          <Subheading className='mt-8 mb-4'>Subjects</Subheading>
          <SubjectList subjects={roleBinding.subjects} />
        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>

  );
};