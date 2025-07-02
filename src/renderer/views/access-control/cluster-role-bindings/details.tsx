import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs, Resources, ResourceAction } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { ClusterRoleBindingBadge } from '@components/access-control/cluster-role-binding/badge';
import { SubjectList } from '@components/access-control/subject-list';
import { ClusterRoleResourceLink } from '@components/access-control/cluster-role/resource-link';
import { MetadataDetails } from '@components/metadata';
import { Heading, Subheading } from '@components/base/heading';
import { ResourceActions } from '@components/resources/ResourceActions';

export const ClusterRoleBindingsDetailsView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [clusterRoleBinding, setClusterRoleBinding] = useState<k8s.V1ClusterRoleBinding>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readClusterRoleBinding(viewContext.name);
      setClusterRoleBinding(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch cluster role binding:", e);
      setError("Failed to fetch cluster role binding.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(clusterRoleBinding);

  const handleDelete = async () => {
    await window.electronAPI.deleteClusterRoleBinding(viewContext.name);
    setViewContext({ resource: Resources.ClusterRoleBindings, action: ResourceAction.List });
  };

  return (
    <>
      <DetailsHeader 
        error={error}
        actions={
          <ResourceActions
            resourceType={Resources.ClusterRoleBindings}
            resourceName={viewContext.name}
            resource={clusterRoleBinding}
            onDelete={handleDelete}
          />
        }
      >
        <Heading>
          <ClusterRoleBindingBadge />{viewContext.name}
        </Heading>

        <Navbar>
          <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === ResourceTabs.Details && clusterRoleBinding && (
        <div className='m-2'>
          <MetadataDetails metadata={clusterRoleBinding.metadata} />

          <Subheading className='mt-8 mb-4'>Role Reference</Subheading>
          <ClusterRoleResourceLink name={clusterRoleBinding.roleRef.name} />

          <Subheading className='mt-8 mb-4'>Subjects</Subheading>
          <SubjectList subjects={clusterRoleBinding.subjects} />

        </div>
      )}

      {activeTab === ResourceTabs.YAML && <Editor content={yamlContent} />}
    </>
  );
};