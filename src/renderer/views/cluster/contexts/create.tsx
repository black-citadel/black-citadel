import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { ContextBadge } from '@components/cluster/context/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';

export const ContextsCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [cluster, setCluster] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('');
  
  const handleCreate = async () => {
    try {
      const context = {
        name: name,
        context: {
          cluster: cluster,
          user: user,
          namespace: namespace
        }
      };

      // await window.electronAPI.addContext(context);

      setViewContext({
        resource: Resources.Contexts,
        action: ResourceAction.Details,
        name: name
      })
    } catch (e) {
      console.error("Failed to create context:", e);
      setError("Failed to create context.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><ContextBadge />Create a New Context</CreateHeader>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0"
          />
        </div>

        <div>
          <label htmlFor="cluster" className="block text-sm font-medium leading-6 text-white">Cluster</label>
          <input
            id="cluster"
            name="cluster"
            type="text"
            value={cluster}
            onChange={(e) => setCluster(e.target.value)}
            className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0"
          />
        </div>

        <div>
          <label htmlFor="user" className="block text-sm font-medium leading-6 text-white">User</label>
          <input
            id="user"
            name="user"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0"
          />
        </div>

        <div>
          <label htmlFor="namespace" className="block text-sm font-medium leading-6 text-white">Namespace</label>
          <input
            id="namespace"
            name="namespace"
            type="text"
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white focus:outline-0"
          />
        </div>

        <div>
          <Button onClick={() => handleCreate()} outline className='uppercase'>Create Context</Button>
        </div>
      </div>
    </>
  );
};
