import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { RoleBindingBadge } from '@components/access-control/role-binding/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Select } from '@components/base/select';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { roleBindingTemplate } from '@templates/rolebinding.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

interface Subject {
  kind: 'User' | 'Group' | 'ServiceAccount';
  name: string;
  namespace: string;
}

export const RoleBindingsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [roleKind, setRoleKind] = useState<'Role' | 'ClusterRole'>('Role');
  const [roleName, setRoleName] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([{
    kind: 'ServiceAccount',
    name: '',
    namespace: ''
  }]);

  const handleAddSubject = () => {
    setSubjects([...subjects, {
      kind: 'ServiceAccount',
      name: '',
      namespace: ''
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

  const filteredSubjects = subjects.map(subject => ({
    kind: subject.kind,
    name: subject.name,
    namespace: subject.kind === 'ServiceAccount' ? (subject.namespace || namespace) : undefined
  }));

  let payload = roleBindingTemplate({
    name,
    namespace,
    labels,
    annotations,
    roleRef: {
      kind: roleKind,
      name: roleName
    },
    subjects: filteredSubjects
  });

  const handleCreate = async () => {
    try {
      if (!roleName) {
        setError("Role name is required.");
        return;
      }

      const hasValidSubject = subjects.some(s => s.name);
      if (!hasValidSubject) {
        setError("At least one subject with a name is required.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.RoleBindings,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create role binding.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><RoleBindingBadge />Create a New Role Binding</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your role binding.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., pod-reader-binding" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this role binding.
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
            <Subheading className='mb-4'>Role Reference</Subheading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select the role or cluster role to bind to subjects.
            </p>
            
            <Field>
              <Label>Role Type</Label>
              <Description>
                Choose whether to bind to a Role (namespace-scoped) or ClusterRole.
              </Description>
              <Select 
                name="roleKind" 
                value={roleKind} 
                onChange={(event) => setRoleKind(event.target.value as any)}
              >
                <option value="Role">Role</option>
                <option value="ClusterRole">ClusterRole</option>
              </Select>
            </Field>

            <Field>
              <Label>Role Name <span className="text-red-500">*</span></Label>
              <Description>
                Name of the {roleKind} to bind.
              </Description>
              <Input 
                name="roleName" 
                value={roleName} 
                onChange={(event) => setRoleName(event.target.value)} 
                placeholder={`e.g., ${roleKind === 'Role' ? 'pod-reader' : 'view'}`}
              />
            </Field>

            {roleKind === 'ClusterRole' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> You can bind a ClusterRole to subjects within this namespace. 
                  The permissions will only apply within the {namespace} namespace.
                </p>
              </div>
            )}
          </div>

          <div>
            <Subheading className='mb-4'>Subjects</Subheading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Define the users, groups, or service accounts that will receive the permissions.
            </p>
            
            {subjects.map((subject, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
                <Field>
                  <Label>Subject Type</Label>
                  <Select 
                    value={subject.kind} 
                    onChange={(event) => handleSubjectChange(index, 'kind', event.target.value)}
                  >
                    <option value="User">User</option>
                    <option value="Group">Group</option>
                    <option value="ServiceAccount">ServiceAccount</option>
                  </Select>
                </Field>

                <Field>
                  <Label>Name <span className="text-red-500">*</span></Label>
                  <Description>
                    Name of the {subject.kind.toLowerCase()}.
                  </Description>
                  <Input 
                    value={subject.name} 
                    onChange={(event) => handleSubjectChange(index, 'name', event.target.value)} 
                    placeholder={
                      subject.kind === 'User' ? 'e.g., jane@example.com' :
                      subject.kind === 'Group' ? 'e.g., system:authenticated' :
                      'e.g., my-service-account'
                    }
                  />
                </Field>

                {subject.kind === 'ServiceAccount' && (
                  <Field>
                    <Label>Namespace</Label>
                    <Description>
                      Namespace of the service account (defaults to role binding's namespace).
                    </Description>
                    <NamespaceDropdown 
                      value={subject.namespace || namespace} 
                      onChange={(value) => handleSubjectChange(index, 'namespace', value)}
                    />
                  </Field>
                )}

                <Button
                  color="red"
                  onClick={() => handleRemoveSubject(index)}
                  disabled={subjects.length === 1}
                  className="mt-2"
                >
                  Remove Subject
                </Button>
              </div>
            ))}
            
            <Button color="dark/white" onClick={handleAddSubject}>
              Add Subject
            </Button>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Common patterns:</strong><br/>
              • Bind a Role to a ServiceAccount in the same namespace<br/>
              • Bind a ClusterRole (like 'view' or 'edit') to users/groups within a namespace<br/>
              • Use Groups for managing permissions for multiple users
            </p>
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