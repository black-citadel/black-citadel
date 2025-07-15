import { useState, useEffect } from 'react';
import k8s from '@kubernetes/client-node';
import { Select, SelectOption } from '@protoku/design-system';
import { useView } from '@context/viewProvider';

export const ContextDropdown = (): JSX.Element => {
  const [contexts, setContexts] = useState<k8s.Context[]>([]);
  const { activeContext, setActiveContext } = useView();

  const fetchData = async () => {
    try {
      const contextList = await window.electronAPI.getContexts();
      setContexts(contextList);

      const currentContext = await window.electronAPI.getCurrentContext();
      if (currentContext && (!activeContext || activeContext !== currentContext)) {
        setActiveContext(currentContext);
      }
    } catch (e) {
      console.error("Failed to fetch Context:", e);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleContextChange = async (value: string) => {
    await window.electronAPI.setCurrentContext(value);
    setActiveContext(value);
  };

  const contextOptions: SelectOption<string>[] = contexts.map(context => ({
    value: context.name,
    label: context.name
  }));

  return (
    <>
      {contexts.length > 0 && (
        <Select
          name="context"
          value={activeContext || ''}
          onChange={handleContextChange}
          options={contextOptions}
          placeholder="Select context"
          className="w-full"
        />
      )}
    </>
  );
};