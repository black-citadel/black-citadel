import k8s = require('@kubernetes/client-node');
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar'
import { useView } from '@context/viewProvider'
import { ResourceTabs } from "@utils/enums";
import { useEffect, useState } from "react";
import { DetailsAnnotations, DetailsItem, DetailsLabels, DetailsName, DetailsNamespace } from '@components/details-item';
import { Editor } from '@components/editor';
import { dump } from 'js-yaml';
import { DetailsHeader } from '@components/details-header';
import { StatefulSetBadge } from '@components/workloads/statefulset/badge';
import { PodTemplate } from '@components/workloads/pod/template';
import { UpdateStrategy } from './update-strategy';
import { VolumeClaimTemplates } from '@components/workloads/statefulset/volume-claim-templates';
import { StatefulSetStatus } from '@components/workloads/statefulset/status';

export const StatefulSetsDetailsView = (): JSX.Element => {
  const { viewContext } = useView()
  const [activeTab, setActiveTab] = useState<ResourceTabs>(ResourceTabs.Details)
  const [statefulSet, setStatefulSet] = useState<k8s.V1StatefulSet>();
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.readNamespacedStatefulSet(viewContext.name, viewContext.namespace);
      setStatefulSet(data);
      setError(null);
    } catch (e) {
      console.error("Failed to fetch stateful set:", e);
      setError("Failed to fetch stateful set.");
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const yamlContent = dump(statefulSet);

  return (
    <>
      <DetailsHeader error={error}><StatefulSetBadge />{viewContext.name}</DetailsHeader>

      <Navbar>
        <NavbarSection>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.Details)} current={activeTab == ResourceTabs.Details}>{ResourceTabs.Details}</NavbarItem>
          <NavbarItem onClick={() => setActiveTab(ResourceTabs.YAML)} current={activeTab == ResourceTabs.YAML}>{ResourceTabs.YAML}</NavbarItem>
        </NavbarSection>
      </Navbar>

      {activeTab === ResourceTabs.Details && statefulSet && (
        <div className="grid grid-cols-2 gap-4">
          <div className='m-2'>
            <DetailsName name={statefulSet.metadata.name} />
            <DetailsNamespace name={statefulSet.metadata.namespace} />
            <DetailsLabels labels={statefulSet.metadata.labels} />
            <DetailsAnnotations annotations={statefulSet.metadata.annotations} />
          </div>

          <div className='m-2'>
            <DetailsItem label="Replicas">
              {statefulSet.spec.replicas}
            </DetailsItem>
            <DetailsItem label="Service Name">
              {statefulSet.spec.serviceName}
            </DetailsItem>
            <DetailsItem label="Pod Management Policy">
              {statefulSet.spec.podManagementPolicy}
            </DetailsItem>
            <UpdateStrategy strategy={statefulSet.spec.updateStrategy} />
            <DetailsItem label="Revision History Limit">
              {statefulSet.spec.revisionHistoryLimit}
            </DetailsItem>
            <PodTemplate template={statefulSet.spec.template} />
            <VolumeClaimTemplates templates={statefulSet.spec.volumeClaimTemplates} />
            <StatefulSetStatus status={statefulSet.status} />
          </div>
        </div>
      )}

      {activeTab === ResourceTabs.YAML && (
        <Editor content={yamlContent} />
      )}
    </>
  );
};