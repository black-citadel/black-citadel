import { useState, useEffect } from 'react';
import { V1NetworkPolicy } from '@utils/k8s-types';
import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { networkPolicyTemplate } from '@templates/networkpolicy.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';
import { CodePanel } from '@components/code';
import { Button } from '@protoku-bv/design-system';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Checkbox } from '@components/base/checkbox';

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

interface NetworkPolicyFormProps {
  networkPolicy?: V1NetworkPolicy | null;
  onChange: (networkPolicy: any) => void;
  isEdit?: boolean;
}

export const NetworkPolicyForm = ({ networkPolicy, onChange, isEdit = false }: NetworkPolicyFormProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('default');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [podSelector, setPodSelector] = useState<FieldLabel[]>([{ key: 'app', value: '' }]);
  const [policyTypes, setPolicyTypes] = useState<('Ingress' | 'Egress')[]>(['Ingress']);
  const [ingressRules, setIngressRules] = useState<NetworkRule[]>([]);
  const [egressRules, setEgressRules] = useState<NetworkRule[]>([]);
  const [denyAll, setDenyAll] = useState<boolean>(false);

  useEffect(() => {
    if (networkPolicy) {
      setName(networkPolicy.metadata?.name || '');
      setNamespace(networkPolicy.metadata?.namespace || 'default');
      
      if (networkPolicy.metadata?.labels) {
        setLabels(Object.entries(networkPolicy.metadata.labels).map(([key, value]) => ({ key, value })));
      }
      
      if (networkPolicy.metadata?.annotations) {
        setAnnotations(Object.entries(networkPolicy.metadata.annotations).map(([key, value]) => ({ key, value })));
      }

      if (networkPolicy.spec?.podSelector?.matchLabels) {
        setPodSelector(Object.entries(networkPolicy.spec.podSelector.matchLabels).map(([key, value]) => ({ key, value })));
      }

      if (networkPolicy.spec?.policyTypes) {
        setPolicyTypes(networkPolicy.spec.policyTypes as any);
      }

      // Parse ingress rules
      if (networkPolicy.spec?.ingress) {
        if (networkPolicy.spec.ingress.length === 0) {
          setDenyAll(true);
        } else {
          setIngressRules(networkPolicy.spec.ingress.map(rule => ({
            peers: (rule.from || []).map(peer => {
              const result: NetworkPeer = {
                type: peer.podSelector ? 'pod' : peer.namespaceSelector ? 'namespace' : 'ipBlock',
                podSelector: peer.podSelector?.matchLabels ? 
                  Object.entries(peer.podSelector.matchLabels).map(([key, value]) => ({ key, value })) : 
                  [{ key: '', value: '' }],
                namespaceSelector: peer.namespaceSelector?.matchLabels ? 
                  Object.entries(peer.namespaceSelector.matchLabels).map(([key, value]) => ({ key, value })) : 
                  [{ key: '', value: '' }],
                cidr: peer.ipBlock?.cidr || '',
                except: peer.ipBlock?.except?.join(', ') || ''
              };
              return result;
            }),
            ports: (rule.ports || []).map(port => ({
              protocol: (port.protocol as any) || 'TCP',
              port: String(port.port || ''),
              endPort: String(port.endPort || '')
            }))
          })));
        }
      }

      // Parse egress rules
      if (networkPolicy.spec?.egress) {
        setEgressRules(networkPolicy.spec.egress.map(rule => ({
          peers: (rule.to || []).map(peer => {
            const result: NetworkPeer = {
              type: peer.podSelector ? 'pod' : peer.namespaceSelector ? 'namespace' : 'ipBlock',
              podSelector: peer.podSelector?.matchLabels ? 
                Object.entries(peer.podSelector.matchLabels).map(([key, value]) => ({ key, value })) : 
                [{ key: '', value: '' }],
              namespaceSelector: peer.namespaceSelector?.matchLabels ? 
                Object.entries(peer.namespaceSelector.matchLabels).map(([key, value]) => ({ key, value })) : 
                [{ key: '', value: '' }],
              cidr: peer.ipBlock?.cidr || '',
              except: peer.ipBlock?.except?.join(', ') || ''
            };
            return result;
          }),
          ports: (rule.ports || []).map(port => ({
            protocol: (port.protocol as any) || 'TCP',
            port: String(port.port || ''),
            endPort: String(port.endPort || '')
          }))
        })));
      }
    }
  }, [networkPolicy]);

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

  const payload = networkPolicyTemplate({
    name,
    namespace,
    labels,
    annotations,
    podSelector,
    policyTypes,
    ingress: policyTypes.includes('Ingress') ? parseIngressRules() : undefined,
    egress: policyTypes.includes('Egress') ? parseEgressRules() : undefined
  });

  useEffect(() => {
    onChange(payload);
  }, [name, namespace, labels, annotations, podSelector, policyTypes, ingressRules, egressRules, denyAll]);

  const renderRule = (rule: NetworkRule, ruleIndex: number, isIngress: boolean) => {
    const rules = isIngress ? ingressRules : egressRules;
    const setRules = isIngress ? setIngressRules : setEgressRules;
    const peerLabel = isIngress ? 'From (Sources)' : 'To (Destinations)';

    return (
      <div key={ruleIndex} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Rule {ruleIndex + 1}</h4>
          <button
            onClick={() => isIngress ? handleRemoveIngressRule(ruleIndex) : handleRemoveEgressRule(ruleIndex)}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
        
        <Field>
          <div className="flex items-center justify-between mb-2">
            <Label>{peerLabel}</Label>
            <Button 
              variant="secondary" 
              onClick={() => handleAddPeer(rules, setRules, ruleIndex)}
              className="text-xs"
            >
              Add {isIngress ? 'Source' : 'Destination'}
            </Button>
          </div>

          <div className="space-y-2">
            {rule.peers.map((peer, peerIndex) => (
              <div key={peerIndex} className="p-3 border border-zinc-200 dark:border-zinc-700 rounded">
                <div className="flex items-start space-x-2">
                  <div className="flex-1">
                    <Dropdown
                      value={peer.type}
                      onChange={(value) => {
                        const newRules = [...rules];
                        newRules[ruleIndex].peers[peerIndex].type = value as any;
                        setRules(newRules);
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
                        setLabels={(newLabels: FieldLabel[]) => {
                          const newRules = [...rules];
                          newRules[ruleIndex].peers[peerIndex].podSelector = newLabels;
                          setRules(newRules);
                        }} 
                      />
                    )}
                    
                    {peer.type === 'namespace' && (
                      <FieldLabels 
                        labels={peer.namespaceSelector} 
                        setLabels={(newLabels: FieldLabel[]) => {
                          const newRules = [...rules];
                          newRules[ruleIndex].peers[peerIndex].namespaceSelector = newLabels;
                          setRules(newRules);
                        }} 
                      />
                    )}
                    
                    {peer.type === 'ipBlock' && (
                      <>
                        <Input
                          placeholder="CIDR (e.g., 10.0.0.0/8)"
                          value={peer.cidr}
                          onChange={(e) => {
                            const newRules = [...rules];
                            newRules[ruleIndex].peers[peerIndex].cidr = e.target.value;
                            setRules(newRules);
                          }}
                          className="mb-2"
                        />
                        <Input
                          placeholder="Except (comma-separated, e.g., 10.0.1.0/24)"
                          value={peer.except}
                          onChange={(e) => {
                            const newRules = [...rules];
                            newRules[ruleIndex].peers[peerIndex].except = e.target.value;
                            setRules(newRules);
                          }}
                        />
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const newRules = [...rules];
                      newRules[ruleIndex].peers = newRules[ruleIndex].peers.filter((_, i) => i !== peerIndex);
                      setRules(newRules);
                    }}
                    className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Field>

        <Field>
          <div className="flex items-center justify-between mb-2">
            <Label>Ports</Label>
            <Button 
              variant="secondary" 
              onClick={() => handleAddPort(rules, setRules, ruleIndex)}
              className="text-xs"
            >
              Add Port
            </Button>
          </div>

          <div className="space-y-2">
            {rule.ports.map((port, portIndex) => (
              <div key={portIndex} className="flex items-center space-x-2">
                <Dropdown
                  value={port.protocol}
                  onChange={(value) => {
                    const newRules = [...rules];
                    newRules[ruleIndex].ports[portIndex].protocol = value as any;
                    setRules(newRules);
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
                    const newRules = [...rules];
                    newRules[ruleIndex].ports[portIndex].port = e.target.value;
                    setRules(newRules);
                  }}
                />
                <Input
                  placeholder="End Port (optional)"
                  value={port.endPort}
                  onChange={(e) => {
                    const newRules = [...rules];
                    newRules[ruleIndex].ports[portIndex].endPort = e.target.value;
                    setRules(newRules);
                  }}
                />
                <button
                  onClick={() => {
                    const newRules = [...rules];
                    newRules[ruleIndex].ports = newRules[ruleIndex].ports.filter((_, i) => i !== portIndex);
                    setRules(newRules);
                  }}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Field>
      </div>
    );
  };

  return (
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
              disabled={isEdit}
            />
          </Field>

          <Field>
            <Label>Namespace</Label>
            <Description>
              Select the namespace for this network policy.
            </Description>
            <NamespaceSelect 
              value={namespace} 
              onChange={setNamespace}
              disabled={isEdit}
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
            <Checkbox
              checked={policyTypes.includes('Ingress')}
              onChange={() => handlePolicyTypeToggle('Ingress')}
            >
              <span className="font-medium">Ingress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">- Control incoming traffic</span>
            </Checkbox>
            <Checkbox
              checked={policyTypes.includes('Egress')}
              onChange={() => handlePolicyTypeToggle('Egress')}
            >
              <span className="font-medium">Egress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">- Control outgoing traffic</span>
            </Checkbox>
          </div>

          {policyTypes.includes('Ingress') && (
            <div className="mt-4">
              <Checkbox
                checked={denyAll}
                onChange={setDenyAll}
              >
                <span className="font-medium">Deny all ingress traffic</span>
              </Checkbox>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">
                When checked, all incoming traffic will be denied (no ingress rules needed).
              </p>
            </div>
          )}
        </div>

        {policyTypes.includes('Ingress') && !denyAll && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <Subheading>Ingress Rules</Subheading>
              <Button variant="secondary" onClick={handleAddIngressRule}>Add Ingress Rule</Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Define allowed incoming traffic. If no rules are defined, all ingress is allowed.
            </p>
            <div className="space-y-4">
              {ingressRules.map((rule, index) => renderRule(rule, index, true))}
            </div>
          </div>
        )}

        {policyTypes.includes('Egress') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <Subheading>Egress Rules</Subheading>
              <Button variant="secondary" onClick={handleAddEgressRule}>Add Egress Rule</Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Define allowed outgoing traffic. If no rules are defined, all egress is allowed.
            </p>
            <div className="space-y-4">
              {egressRules.map((rule, index) => renderRule(rule, index, false))}
            </div>
          </div>
        )}
      </div>

      <div className='px-4'>
        <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
      </div>
    </div>
  );
};