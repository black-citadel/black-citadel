import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { NetworkPolicyBadge } from '@components/networking/network-policy/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown, DropdownOption } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { networkPolicyTemplate } from '@templates/networkpolicy.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

interface NetworkPort {
  protocol: 'TCP' | 'UDP' | 'SCTP';
  port: string;
  endPort: string;
}

interface NetworkPeer {
  type: 'pod' | 'namespace' | 'ipBlock';
  podSelector: FieldLabel[];
  namespaceSelector: FieldLabel[];
  cidr: string;
  except: string;
}

interface NetworkRule {
  peers: NetworkPeer[];
  ports: NetworkPort[];
}

export const NetworkPoliciesCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [podSelector, setPodSelector] = useState<FieldLabel[]>([{ key: 'app', value: '' }]);
  const [policyTypes, setPolicyTypes] = useState<('Ingress' | 'Egress')[]>(['Ingress']);
  const [ingressRules, setIngressRules] = useState<NetworkRule[]>([]);
  const [egressRules, setEgressRules] = useState<NetworkRule[]>([]);
  const [denyAll, setDenyAll] = useState<boolean>(false);

  const handlePolicyTypeToggle = (type: 'Ingress' | 'Egress') => {
    if (policyTypes.includes(type)) {
      setPolicyTypes(policyTypes.filter(t => t !== type));
    } else {
      setPolicyTypes([...policyTypes, type]);
    }
  };

  const handleAddIngressRule = () => {
    setIngressRules([...ingressRules, { peers: [], ports: [] }]);
  };

  const handleAddEgressRule = () => {
    setEgressRules([...egressRules, { peers: [], ports: [] }]);
  };

  const handleRemoveIngressRule = (index: number) => {
    setIngressRules(ingressRules.filter((_, i) => i !== index));
  };

  const handleRemoveEgressRule = (index: number) => {
    setEgressRules(egressRules.filter((_, i) => i !== index));
  };

  const handleAddPeer = (rules: NetworkRule[], setRules: (rules: NetworkRule[]) => void, ruleIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].peers.push({
      type: 'pod',
      podSelector: [{ key: '', value: '' }],
      namespaceSelector: [{ key: '', value: '' }],
      cidr: '',
      except: ''
    });
    setRules(newRules);
  };

  const handleAddPort = (rules: NetworkRule[], setRules: (rules: NetworkRule[]) => void, ruleIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].ports.push({
      protocol: 'TCP',
      port: '',
      endPort: ''
    });
    setRules(newRules);
  };

  const parseIngressRules = () => {
    if (denyAll || ingressRules.length === 0) return undefined;
    
    return ingressRules.map(rule => {
      const from = rule.peers.length > 0 ? rule.peers.map(peer => {
        const result: any = {};
        if (peer.type === 'pod' && peer.podSelector.some(s => s.key && s.value)) {
          result.podSelector = {
            matchLabels: peer.podSelector.reduce((acc, s) => {
              if (s.key && s.value) acc[s.key] = s.value;
              return acc;
            }, {} as Record<string, string>)
          };
        }
        if (peer.type === 'namespace' && peer.namespaceSelector.some(s => s.key && s.value)) {
          result.namespaceSelector = {
            matchLabels: peer.namespaceSelector.reduce((acc, s) => {
              if (s.key && s.value) acc[s.key] = s.value;
              return acc;
            }, {} as Record<string, string>)
          };
        }
        if (peer.type === 'ipBlock' && peer.cidr) {
          result.ipBlock = {
            cidr: peer.cidr,
            except: peer.except ? peer.except.split(',').map(e => e.trim()).filter(e => e) : undefined
          };
        }
        return Object.keys(result).length > 0 ? result : null;
      }).filter(p => p) : undefined;

      const ports = rule.ports.length > 0 ? rule.ports.map(port => ({
        protocol: port.protocol,
        port: port.port ? (isNaN(parseInt(port.port)) ? port.port : parseInt(port.port)) : undefined,
        endPort: port.endPort ? parseInt(port.endPort) : undefined
      })).filter(p => p.port) : undefined;

      return { from, ports };
    });
  };

  const parseEgressRules = () => {
    if (egressRules.length === 0) return undefined;
    
    return egressRules.map(rule => {
      const to = rule.peers.length > 0 ? rule.peers.map(peer => {
        const result: any = {};
        if (peer.type === 'pod' && peer.podSelector.some(s => s.key && s.value)) {
          result.podSelector = {
            matchLabels: peer.podSelector.reduce((acc, s) => {
              if (s.key && s.value) acc[s.key] = s.value;
              return acc;
            }, {} as Record<string, string>)
          };
        }
        if (peer.type === 'namespace' && peer.namespaceSelector.some(s => s.key && s.value)) {
          result.namespaceSelector = {
            matchLabels: peer.namespaceSelector.reduce((acc, s) => {
              if (s.key && s.value) acc[s.key] = s.value;
              return acc;
            }, {} as Record<string, string>)
          };
        }
        if (peer.type === 'ipBlock' && peer.cidr) {
          result.ipBlock = {
            cidr: peer.cidr,
            except: peer.except ? peer.except.split(',').map(e => e.trim()).filter(e => e) : undefined
          };
        }
        return Object.keys(result).length > 0 ? result : null;
      }).filter(p => p) : undefined;

      const ports = rule.ports.length > 0 ? rule.ports.map(port => ({
        protocol: port.protocol,
        port: port.port ? (isNaN(parseInt(port.port)) ? port.port : parseInt(port.port)) : undefined,
        endPort: port.endPort ? parseInt(port.endPort) : undefined
      })).filter(p => p.port) : undefined;

      return { to, ports };
    });
  };

  let payload = networkPolicyTemplate({
    name,
    namespace,
    labels,
    annotations,
    podSelector,
    policyTypes,
    ingress: policyTypes.includes('Ingress') ? parseIngressRules() : undefined,
    egress: policyTypes.includes('Egress') ? parseEgressRules() : undefined
  });

  const handleCreate = async () => {
    try {
      if (policyTypes.length === 0) {
        setError("At least one policy type (Ingress or Egress) must be selected.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.NetworkPolicies,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create network policy.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><NetworkPolicyBadge />Create a New Network Policy</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your network policy.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., allow-frontend" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this network policy.
              </Description>
              <NamespaceDropdown 
                value={namespace} 
                onChange={setNamespace}
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>Pod Selector</Subheading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select which pods this policy applies to using labels.
            </p>
            <FieldLabels labels={podSelector} setLabels={setPodSelector} />
          </div>

          <div>
            <Subheading className='mb-4'>Policy Types</Subheading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select which types of traffic this policy controls.
            </p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={policyTypes.includes('Ingress')}
                  onChange={() => handlePolicyTypeToggle('Ingress')}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Ingress</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">- Control incoming traffic</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={policyTypes.includes('Egress')}
                  onChange={() => handlePolicyTypeToggle('Egress')}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Egress</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">- Control outgoing traffic</span>
              </label>
            </div>

            {policyTypes.includes('Ingress') && (
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={denyAll}
                    onChange={(e) => setDenyAll(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Deny all ingress traffic</span>
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  When checked, all incoming traffic will be denied (no ingress rules needed).
                </p>
              </div>
            )}
          </div>

          {policyTypes.includes('Ingress') && !denyAll && (
            <div>
              <Subheading className='mb-4'>Ingress Rules</Subheading>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Define allowed incoming traffic. If no rules are defined, all ingress is allowed.
              </p>
              {ingressRules.map((rule, ruleIndex) => (
                <div key={ruleIndex} className="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
                  <p className="text-sm font-medium mb-2">Rule {ruleIndex + 1}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">From (Sources)</p>
                    {rule.peers.map((peer, peerIndex) => (
                      <div key={peerIndex} className="border border-gray-100 dark:border-gray-800 rounded p-2 mb-2">
                        <Dropdown
                          value={peer.type}
                          onChange={(value) => {
                            const newRules = [...ingressRules];
                            newRules[ruleIndex].peers[peerIndex].type = value as any;
                            setIngressRules(newRules);
                          }}
                          className="mb-2"
                          options={[
                            { value: 'pod', label: 'Pod Selector' },
                            { value: 'namespace', label: 'Namespace Selector' },
                            { value: 'ipBlock', label: 'IP Block' }
                          ]}
                        />
                        
                        {peer.type === 'pod' && (
                          <FieldLabels 
                            labels={peer.podSelector} 
                            setLabels={(newLabels) => {
                              const newRules = [...ingressRules];
                              newRules[ruleIndex].peers[peerIndex].podSelector = newLabels;
                              setIngressRules(newRules);
                            }} 
                          />
                        )}
                        
                        {peer.type === 'namespace' && (
                          <FieldLabels 
                            labels={peer.namespaceSelector} 
                            setLabels={(newLabels) => {
                              const newRules = [...ingressRules];
                              newRules[ruleIndex].peers[peerIndex].namespaceSelector = newLabels;
                              setIngressRules(newRules);
                            }} 
                          />
                        )}
                        
                        {peer.type === 'ipBlock' && (
                          <>
                            <Input
                              placeholder="CIDR (e.g., 10.0.0.0/8)"
                              value={peer.cidr}
                              onChange={(e) => {
                                const newRules = [...ingressRules];
                                newRules[ruleIndex].peers[peerIndex].cidr = e.target.value;
                                setIngressRules(newRules);
                              }}
                              className="mb-2"
                            />
                            <Input
                              placeholder="Except (comma-separated, e.g., 10.0.1.0/24)"
                              value={peer.except}
                              onChange={(e) => {
                                const newRules = [...ingressRules];
                                newRules[ruleIndex].peers[peerIndex].except = e.target.value;
                                setIngressRules(newRules);
                              }}
                            />
                          </>
                        )}
                        
                        <Button
                          color="red"
                          onClick={() => {
                            const newRules = [...ingressRules];
                            newRules[ruleIndex].peers = newRules[ruleIndex].peers.filter((_, i) => i !== peerIndex);
                            setIngressRules(newRules);
                          }}
                          className="mt-2"
                        >
                          Remove Source
                        </Button>
                      </div>
                    ))}
                    <Button 
                      color="dark/white" 
                      onClick={() => handleAddPeer(ingressRules, setIngressRules, ruleIndex)}
                    >
                      Add Source
                    </Button>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Ports</p>
                    {rule.ports.map((port, portIndex) => (
                      <div key={portIndex} className="flex gap-2 mb-2">
                        <Dropdown
                          value={port.protocol}
                          onChange={(value) => {
                            const newRules = [...ingressRules];
                            newRules[ruleIndex].ports[portIndex].protocol = value as any;
                            setIngressRules(newRules);
                          }}
                          options={[
                            { value: 'TCP', label: 'TCP' },
                            { value: 'UDP', label: 'UDP' },
                            { value: 'SCTP', label: 'SCTP' }
                          ]}
                        />
                        <Input
                          placeholder="Port"
                          value={port.port}
                          onChange={(e) => {
                            const newRules = [...ingressRules];
                            newRules[ruleIndex].ports[portIndex].port = e.target.value;
                            setIngressRules(newRules);
                          }}
                        />
                        <Input
                          placeholder="End Port (optional)"
                          value={port.endPort}
                          onChange={(e) => {
                            const newRules = [...ingressRules];
                            newRules[ruleIndex].ports[portIndex].endPort = e.target.value;
                            setIngressRules(newRules);
                          }}
                        />
                        <Button
                          color="red"
                          onClick={() => {
                            const newRules = [...ingressRules];
                            newRules[ruleIndex].ports = newRules[ruleIndex].ports.filter((_, i) => i !== portIndex);
                            setIngressRules(newRules);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      color="dark/white" 
                      onClick={() => handleAddPort(ingressRules, setIngressRules, ruleIndex)}
                    >
                      Add Port
                    </Button>
                  </div>

                  <Button
                    color="red"
                    onClick={() => handleRemoveIngressRule(ruleIndex)}
                    className="mt-4"
                  >
                    Remove Rule
                  </Button>
                </div>
              ))}
              <Button color="dark/white" onClick={handleAddIngressRule}>
                Add Ingress Rule
              </Button>
            </div>
          )}

          {policyTypes.includes('Egress') && (
            <div>
              <Subheading className='mb-4'>Egress Rules</Subheading>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Define allowed outgoing traffic. If no rules are defined, all egress is allowed.
              </p>
              {egressRules.map((rule, ruleIndex) => (
                <div key={ruleIndex} className="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
                  <p className="text-sm font-medium mb-2">Rule {ruleIndex + 1}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">To (Destinations)</p>
                    {rule.peers.map((peer, peerIndex) => (
                      <div key={peerIndex} className="border border-gray-100 dark:border-gray-800 rounded p-2 mb-2">
                        <Dropdown
                          value={peer.type}
                          onChange={(value) => {
                            const newRules = [...egressRules];
                            newRules[ruleIndex].peers[peerIndex].type = value as any;
                            setEgressRules(newRules);
                          }}
                          className="mb-2"
                          options={[
                            { value: 'pod', label: 'Pod Selector' },
                            { value: 'namespace', label: 'Namespace Selector' },
                            { value: 'ipBlock', label: 'IP Block' }
                          ]}
                        />
                        
                        {peer.type === 'pod' && (
                          <FieldLabels 
                            labels={peer.podSelector} 
                            setLabels={(newLabels) => {
                              const newRules = [...egressRules];
                              newRules[ruleIndex].peers[peerIndex].podSelector = newLabels;
                              setEgressRules(newRules);
                            }} 
                          />
                        )}
                        
                        {peer.type === 'namespace' && (
                          <FieldLabels 
                            labels={peer.namespaceSelector} 
                            setLabels={(newLabels) => {
                              const newRules = [...egressRules];
                              newRules[ruleIndex].peers[peerIndex].namespaceSelector = newLabels;
                              setEgressRules(newRules);
                            }} 
                          />
                        )}
                        
                        {peer.type === 'ipBlock' && (
                          <>
                            <Input
                              placeholder="CIDR (e.g., 10.0.0.0/8)"
                              value={peer.cidr}
                              onChange={(e) => {
                                const newRules = [...egressRules];
                                newRules[ruleIndex].peers[peerIndex].cidr = e.target.value;
                                setEgressRules(newRules);
                              }}
                              className="mb-2"
                            />
                            <Input
                              placeholder="Except (comma-separated, e.g., 10.0.1.0/24)"
                              value={peer.except}
                              onChange={(e) => {
                                const newRules = [...egressRules];
                                newRules[ruleIndex].peers[peerIndex].except = e.target.value;
                                setEgressRules(newRules);
                              }}
                            />
                          </>
                        )}
                        
                        <Button
                          color="red"
                          onClick={() => {
                            const newRules = [...egressRules];
                            newRules[ruleIndex].peers = newRules[ruleIndex].peers.filter((_, i) => i !== peerIndex);
                            setEgressRules(newRules);
                          }}
                          className="mt-2"
                        >
                          Remove Destination
                        </Button>
                      </div>
                    ))}
                    <Button 
                      color="dark/white" 
                      onClick={() => handleAddPeer(egressRules, setEgressRules, ruleIndex)}
                    >
                      Add Destination
                    </Button>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Ports</p>
                    {rule.ports.map((port, portIndex) => (
                      <div key={portIndex} className="flex gap-2 mb-2">
                        <Dropdown
                          value={port.protocol}
                          onChange={(value) => {
                            const newRules = [...egressRules];
                            newRules[ruleIndex].ports[portIndex].protocol = value as any;
                            setEgressRules(newRules);
                          }}
                          options={[
                            { value: 'TCP', label: 'TCP' },
                            { value: 'UDP', label: 'UDP' },
                            { value: 'SCTP', label: 'SCTP' }
                          ]}
                        />
                        <Input
                          placeholder="Port"
                          value={port.port}
                          onChange={(e) => {
                            const newRules = [...egressRules];
                            newRules[ruleIndex].ports[portIndex].port = e.target.value;
                            setEgressRules(newRules);
                          }}
                        />
                        <Input
                          placeholder="End Port (optional)"
                          value={port.endPort}
                          onChange={(e) => {
                            const newRules = [...egressRules];
                            newRules[ruleIndex].ports[portIndex].endPort = e.target.value;
                            setEgressRules(newRules);
                          }}
                        />
                        <Button
                          color="red"
                          onClick={() => {
                            const newRules = [...egressRules];
                            newRules[ruleIndex].ports = newRules[ruleIndex].ports.filter((_, i) => i !== portIndex);
                            setEgressRules(newRules);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      color="dark/white" 
                      onClick={() => handleAddPort(egressRules, setEgressRules, ruleIndex)}
                    >
                      Add Port
                    </Button>
                  </div>

                  <Button
                    color="red"
                    onClick={() => handleRemoveEgressRule(ruleIndex)}
                    className="mt-4"
                  >
                    Remove Rule
                  </Button>
                </div>
              ))}
              <Button color="dark/white" onClick={handleAddEgressRule}>
                Add Egress Rule
              </Button>
            </div>
          )}
        </div>

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>

          <div className="mt-4">
            <Button onClick={() => handleCreate()} color='white' className='uppercase'>Apply</Button>
          </div>
        </div>
      </div>
    </>
  );
};