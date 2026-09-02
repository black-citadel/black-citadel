# Component generator

Generates the resource detail components under `src/renderer/components/gen` from the
Kubernetes type definitions the app compiles against.

```bash
npm run generate
```

The command runs three steps in order:

1. **Type discovery** (`generators/K8sTypeDiscoveryGenerator.ts`) walks the types listed in
   `config/k8s-resources.yaml`, follows every nested Kubernetes type, and appends newly found
   types to that file. Type paths are relative to the repo root and point into
   `node_modules/@kubernetes/client-node`, so the generated components always match the client
   version in `package.json`.
2. **Meta extraction** (`generators/MetaConfigGenerator.ts`) reads each type with ts-morph and
   writes one YAML file per type to `meta/`, listing every property with its type, whether it is
   optional, and its description from the Kubernetes API docs. These files are derived, but they
   are committed so template changes can be reviewed without running anything.
3. **Component generation** (`generators/DisplayResourceGenerator.ts`) renders
   `templates/details.tsx.hbs` once per meta file into `src/renderer/components/gen/<Type>/details.tsx`.

## Configuration

- `config/k8s-resources.yaml`: the types to generate. An optional `order` list per type controls
  the order of its properties; properties not listed come after the listed ones.
- `config/array-overrides.yaml`: array properties of a given type render through a hand-written
  component instead of the generated one, for example service ports and condition tables.
- `config/object-overrides.yaml`: the same for a specific map property of a specific type, for
  example Secret data.

## Changing the output

Edit the template or the shared layout components it uses (`@components/layout/panel`,
`@components/base/container`, `@components/metadata`), run `npm run generate`, and commit the
regenerated components together with the change. The generated files are not meant to be edited
by hand.
