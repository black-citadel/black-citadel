import k8s from '@kubernetes/client-node';
import { useState, useEffect } from 'react';
import { Select, SelectOption } from '@protoku-bv/design-system';
import { useView } from '@context/viewProvider';

export const NamespaceSwitch = (): JSX.Element => {
  const [namespaces, setNamespaces] = useState<k8s.V1NamespaceList>();
  const { activeNamespace, setActiveNamespace } = useView();

  const fetchData = async () => {
    try {
      const data = await window.electronAPI.listNamespace();
      setNamespaces(data);
    } catch (e) {
      console.error("Failed to fetch Namespaces:", e);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleNamespaceChange = (value: string) => {
    setActiveNamespace(value);
  };

  const namespaceOptions: SelectOption<string>[] = namespaces ? [
    { value: 'all', label: 'All namespaces' },
    ...namespaces.items.map(namespace => ({
      value: namespace.metadata.name,
      label: namespace.metadata.name
    }))
  ] : [];

  return (
    <>
      {namespaces && (
        <Select
          name="namespace"
          value={activeNamespace}
          onChange={handleNamespaceChange}
          options={namespaceOptions}
          placeholder="Select namespace"
          className="w-80"
          noTruncate
          align="end"
        />
      )}
    </>
  )
}