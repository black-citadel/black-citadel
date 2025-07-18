import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { DetailsHeader } from '@components/details-header';
import { Editor } from '@components/editor';
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@components/base/description-list';
import { Navbar, NavbarItem, NavbarSection } from '@components/base/navbar';
import { Heading } from '@components/base/heading';

interface HelmRelease {
  name: string;
  namespace: string;
  revision: string;
  updated: string;
  status: string;
  chart: string;
  app_version: string;
}

export const HelmDetailsView = (): JSX.Element => {
  const { viewContext } = useView();
  const name = viewContext.name;
  const namespace = viewContext.namespace || 'default';
  const [release, setRelease] = useState<HelmRelease | null>(null);
  const [values, setValues] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'values'>('details');

  useEffect(() => {
    const fetchReleaseDetails = async () => {
      if (!name) return;
      
      try {
        setLoading(true);
        
        // Get release details from list (could enhance with a dedicated API)
        const listResult = await window.electronAPI.helmList();
        if (listResult.success) {
          const foundRelease = listResult.data?.find(
            (r: HelmRelease) => r.name === name && r.namespace === namespace
          );
          setRelease(foundRelease || null);
        }
        
        // Get values
        const valuesResult = await window.electronAPI.helmGetValues(name, namespace);
        if (valuesResult.success) {
          setValues(valuesResult.data || '');
        }
        
        setError(null);
      } catch (e) {
        console.error('Failed to fetch helm release details:', e);
        setError('Failed to fetch helm release details');
      } finally {
        setLoading(false);
      }
    };

    fetchReleaseDetails();
  }, [name, namespace]);

  const handleDelete = async () => {
    if (!name || !window.confirm(`Are you sure you want to uninstall helm release "${name}"?`)) {
      return;
    }

    try {
      const result = await window.electronAPI.helmUninstall(name, namespace);
      if (result.success) {
        window.history.back();
      } else {
        setError(result.error || 'Failed to uninstall helm release');
      }
    } catch (e) {
      console.error('Failed to uninstall helm release:', e);
      setError('Failed to uninstall helm release');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">Loading helm release details...</div>
      </div>
    );
  }

  if (!release) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">Helm release not found</div>
      </div>
    );
  }


  return (
    <>
      <DetailsHeader
        error={error}
        onDelete={handleDelete}
      >
        <Heading>{name}</Heading>
        <Navbar>
          <NavbarSection>
            <NavbarItem onClick={() => setActiveTab('details')} current={activeTab === 'details'}>Details</NavbarItem>
            <NavbarItem onClick={() => setActiveTab('values')} current={activeTab === 'values'}>Values</NavbarItem>
          </NavbarSection>
        </Navbar>
      </DetailsHeader>

      {activeTab === 'details' && release && (
        <div className="m-4">
          <DescriptionList>
            <DescriptionTerm>Name</DescriptionTerm>
            <DescriptionDetails>{release.name}</DescriptionDetails>
            
            <DescriptionTerm>Namespace</DescriptionTerm>
            <DescriptionDetails>{release.namespace}</DescriptionDetails>
            
            <DescriptionTerm>Status</DescriptionTerm>
            <DescriptionDetails>{release.status}</DescriptionDetails>
            
            <DescriptionTerm>Chart</DescriptionTerm>
            <DescriptionDetails>{release.chart}</DescriptionDetails>
            
            <DescriptionTerm>App Version</DescriptionTerm>
            <DescriptionDetails>{release.app_version}</DescriptionDetails>
            
            <DescriptionTerm>Revision</DescriptionTerm>
            <DescriptionDetails>{release.revision}</DescriptionDetails>
            
            <DescriptionTerm>Updated</DescriptionTerm>
            <DescriptionDetails>{new Date(release.updated).toLocaleString()}</DescriptionDetails>
          </DescriptionList>
        </div>
      )}

      {activeTab === 'values' && (
        <div className="m-4">
          <Editor
            content={values || '# No custom values'}
            readOnly={true}
          />
        </div>
      )}
    </>
  );
};