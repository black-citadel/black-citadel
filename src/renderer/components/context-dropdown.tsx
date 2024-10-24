import React, { useState, useEffect } from 'react';
import k8s from '@kubernetes/client-node';
import { Field } from '@components/base/fieldset';
import { Listbox, ListboxLabel, ListboxOption } from '@components/base/listbox';
import { useView } from '@context/viewProvider';
import { ContextBadge } from './cluster/context/badge';

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

      console.log('Contexts:', contextList);
      console.log('Current context:', currentContext);
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

  return (
    <>
      {contexts.length > 0 && (
        <Field>
          <Listbox
            name="context"
            value={activeContext || ''}
            onChange={handleContextChange}
          >
            {contexts.map((context) => (
              <ListboxOption key={context.name} value={context.name}>
                <ListboxLabel><ContextBadge /> {context.name}</ListboxLabel>
              </ListboxOption>
            ))}
          </Listbox>
        </Field>
      )}
    </>
  );
};