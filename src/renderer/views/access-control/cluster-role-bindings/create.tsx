import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { ClusterRoleBindingBadge } from '@components/access-control/cluster-role-binding/badge';
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
import { clusterRoleBindingTemplate } from '@templates/clusterrolebinding.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

interface Subject {
  kind: 'User' | 'Group' | 'ServiceAccount';
  name: string;
  namespace: string;
}

export const ClusterRoleBindingsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [roleRefKind, setRoleRefKind] = useState<string>('ClusterRole');
  const [roleRefName, setRoleRefName] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([{
    kind: 'User',
    name: '',
    namespace: activeNamespace === 'all' ? 'default' : activeNamespace
  }]);

  const handleAddSubject = () => {
    setSubjects([...subjects, {
      kind: 'User',
      name: '',
      namespace: activeNamespace === 'all' ? 'default' : activeNamespace
    }]);
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (index: number, field: keyof Subject, value: string) => {
    const newSubjects = [...subjects];
    (newSubjects[index] as any)[field] = value;
    setSubjects(newSubjects);
  };

  const parseSubjects = () => {
    return subjects
      .filter(subject => subject.name)
      .map(subject => ({
        kind: subject.kind,
        name: subject.name,
        ...(subject.kind === 'ServiceAccount' && subject.namespace && { namespace: subject.namespace })
      }));
  };

  let payload = clusterRoleBindingTemplate({
    name,
    labels,
    annotations,
    roleRef: {
      apiGroup: 'rbac.authorization.k8s.io',
      kind: roleRefKind,
      name: roleRefName
    },
    subjects: parseSubjects()
  });

  const handleCreate = async () => {
    try {
      if (!roleRefName) {
        setError("ClusterRole name is required.");
        return;
      }

      if (parseSubjects().length === 0) {
        setError("At least one subject must be specified.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.ClusterRoleBindings,
          action: ResourceAction.Details,
          name: name
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create cluster role binding.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><ClusterRoleBindingBadge />Create a New Cluster Role Binding</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your cluster role binding.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., admin-binding" 
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>ClusterRole Reference</Subheading>
            
            <Field>
              <Label>Kind</Label>
              <Description>
                Type of role to bind (usually ClusterRole).
              </Description>
              <Dropdown 
                name="roleRefKind" 
                value={roleRefKind} 
                onChange={(value) => setRoleRefKind(value)}
                options={[
                  { value: 'ClusterRole', label: 'ClusterRole' },
                  { value: 'Role', label: 'Role (unusual for ClusterRoleBinding)' }
                ]}
              />
            </Field>

            <Field>
              <Label>ClusterRole Name <span className="text-red-500">*</span></Label>
              <Description>
                Name of the ClusterRole to bind.
              </Description>
              <Input 
                name="roleRefName" 
                value={roleRefName} 
                onChange={(event) => setRoleRefName(event.target.value)} 
                placeholder="e.g., cluster-admin" 
              />
            </Field>
          </div>

          <div>
            <Subheading className='mb-4'>Subjects</Subheading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Users, groups, or service accounts to grant permissions to.
            </p>
            
            {subjects.map((subject, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                <Field>
                  <Label>Kind</Label>
                  <Dropdown
                    value={subject.kind}
                    onChange={(value) => handleSubjectChange(index, 'kind', value)}
                    options={[
                      { value: 'User', label: 'User' },
                      { value: 'Group', label: 'Group' },
                      { value: 'ServiceAccount', label: 'ServiceAccount' }
                    ]}
                  />
                </Field>

                <Field>
                  <Label>Name <span className="text-red-500">*</span></Label>
                  <Description>
                    {subject.kind === 'User' && 'Username (e.g., jane@example.com)'}
                    {subject.kind === 'Group' && 'Group name (e.g., system:masters)'}
                    {subject.kind === 'ServiceAccount' && 'Service account name'}
                  </Description>
                  <Input
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                    placeholder={
                      subject.kind === 'User' ? 'jane@example.com' :
                      subject.kind === 'Group' ? 'system:masters' :
                      'my-service-account'
                    }
                  />
                </Field>

                {subject.kind === 'ServiceAccount' && (
                  <Field>
                    <Label>Namespace</Label>
                    <Description>
                      Namespace of the service account.
                    </Description>
                    <NamespaceDropdown 
                      value={subject.namespace} 
                      onChange={(value) => handleSubjectChange(index, 'namespace', value)}
                    />
                  </Field>
                )}

                <Button
                  color="red"
                  onClick={() => handleRemoveSubject(index)}
                  disabled={subjects.length === 1}
                >
                  Remove Subject
                </Button>
              </div>
            ))}
            
            <Button color="dark/white" onClick={handleAddSubject}>
              Add Subject
            </Button>
          </div>
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