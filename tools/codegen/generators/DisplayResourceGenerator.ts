import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as Handlebars from 'handlebars';
import { PropertyInfo, ResourceMetaConfig, K8sResourceConfig } from '../types';
import { CONFIG_DIR, META_DIR, OUTPUT_DIR, TEMPLATE_PATH } from '../paths';

interface RendererOverride {
  componentName: string;
  propName: string;
  importPath?: string;
}

interface ArrayOverridesConfig {
  overrides: Record<string, RendererOverride>;
}

interface ObjectOverridesConfig {
  overrides: Record<string, Record<string, RendererOverride>>;
}

interface DisplayConfig {
  collapsedByDefault?: string[];
}

interface PropertyData {
  name: string;
  displayName: string;
  varName: string;
  type: string;
  optional: boolean;
  description?: string;
}

interface NestedPropertyData extends PropertyData {
  isArray: boolean;
  isSpec: boolean;
  isConditions: boolean;
  defaultOpen: boolean;
  componentName: string;
  hasCustomRenderer?: boolean;
  customComponentName?: string;
  customPropName?: string;
  itemTitleProperty?: string;
}

interface NestedTypeImport {
  typeName: string;
  componentName: string;
  isCustom?: boolean;
  importPath?: string;
}

const SIMPLE_TYPE = /^(string|number|boolean|Date|IntOrString|object|any|unknown)\[\]$|^(string|number|Date|IntOrString|object|any|unknown)$/;
const MAP_TYPE = /Record<|Map<|\{ \[key: string\]/;
// V1Pod, CoreV1EndpointPort, DiscoveryV1EndpointPort, StorageV1TokenRequest, ...
const K8S_TYPE = /^[A-Za-z]*V\d+[A-Z]/;
const MAX_DESCRIPTION_LENGTH = 160;

export class DisplayResourceGenerator {
  private arrayOverrides: Record<string, RendererOverride> = {};
  private objectOverrides: Record<string, Record<string, RendererOverride>> = {};
  private collapsedByDefault = new Set<string>();
  private metaByType = new Map<string, ResourceMetaConfig>();

  constructor() {
    this.arrayOverrides = this.loadYaml<ArrayOverridesConfig>('array-overrides.yaml')?.overrides || {};
    this.objectOverrides = this.loadYaml<ObjectOverridesConfig>('object-overrides.yaml')?.overrides || {};
    this.collapsedByDefault = new Set(this.loadYaml<DisplayConfig>('display.yaml')?.collapsedByDefault || []);
  }

  private loadYaml<T>(fileName: string): T | undefined {
    const filePath = path.join(CONFIG_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      return undefined;
    }
    return yaml.load(fs.readFileSync(filePath, 'utf8')) as T;
  }

  async generate(): Promise<void> {
    console.log('Generating resource display files...\n');

    Handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);
    Handlebars.registerHelper('json', (value: unknown) => JSON.stringify(value));

    const template = Handlebars.compile(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
    const k8sResources = yaml.load(fs.readFileSync(path.join(CONFIG_DIR, 'k8s-resources.yaml'), 'utf8')) as K8sResourceConfig;

    const metaFiles = fs.readdirSync(META_DIR).filter((file) => file.endsWith('.yaml'));
    for (const metaFile of metaFiles) {
      const metaConfig = yaml.load(fs.readFileSync(path.join(META_DIR, metaFile), 'utf8')) as ResourceMetaConfig;
      this.metaByType.set(metaConfig.resourceName, metaConfig);
    }

    let generated = 0;
    for (const metaConfig of this.metaByType.values()) {
      try {
        const propertyOrder = this.findPropertyOrder(k8sResources, metaConfig.resourceName);
        const templateData = this.buildTemplateData(metaConfig, propertyOrder);

        const resourceOutputDir = path.join(OUTPUT_DIR, metaConfig.resourceName);
        fs.mkdirSync(resourceOutputDir, { recursive: true });
        fs.writeFileSync(path.join(resourceOutputDir, 'details.tsx'), template(templateData));
        generated += 1;
      } catch (error) {
        console.error(`Error processing ${metaConfig.resourceName}: ${(error as Error).message}`);
      }
    }

    console.log(`Generated ${generated} components in ${OUTPUT_DIR}\n`);
  }

  private findPropertyOrder(k8sResources: K8sResourceConfig, resourceName: string): string[] {
    for (const [typeName, config] of Object.entries(k8sResources)) {
      if (typeName === resourceName) {
        return config.order || [];
      }
    }
    return [];
  }

  private buildTemplateData(metaConfig: ResourceMetaConfig, propertyOrder: string[]) {
    // apiVersion and kind are metadata on real resources, but data on reference types
    const isReference = metaConfig.resourceName.includes('Reference');
    const propertyList = Object.entries(metaConfig.properties)
      .filter(([name]) => isReference || (name !== 'apiVersion' && name !== 'kind'));

    if (propertyOrder.length > 0) {
      propertyList.sort((a, b) => {
        const indexA = propertyOrder.indexOf(a[0]);
        const indexB = propertyOrder.indexOf(b[0]);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    const objectProperties: PropertyData[] = [];
    const booleanProperties: PropertyData[] = [];
    const simpleProperties: PropertyData[] = [];
    const k8sTypeProperties: NestedPropertyData[] = [];
    const nestedK8sTypes: NestedTypeImport[] = [];
    let hasMetadata = false;

    const addImport = (entry: NestedTypeImport) => {
      if (!nestedK8sTypes.find((existing) => existing.componentName === entry.componentName)) {
        nestedK8sTypes.push(entry);
      }
    };

    for (const [name, info] of propertyList) {
      if (name === 'metadata') {
        hasMetadata = true;
        continue;
      }

      const propData: PropertyData = {
        name,
        displayName: this.humanizePropertyName(name),
        varName: name + 'Items',
        type: info.type,
        optional: info.optional || false,
        description: this.shortDescription(info.description),
      };

      const isArrayType = info.type.endsWith('[]');
      const baseType = isArrayType ? info.type.slice(0, -2) : info.type;

      if (K8S_TYPE.test(baseType)) {
        const componentName = this.componentNameFor(baseType);
        const nested: NestedPropertyData = {
          ...propData,
          isArray: isArrayType,
          isSpec: name === 'spec',
          isConditions: name === 'conditions',
          defaultOpen: !this.collapsedByDefault.has(name),
          componentName,
        };

        const override = isArrayType ? this.arrayOverrides[baseType] : undefined;
        if (override) {
          nested.hasCustomRenderer = true;
          nested.customComponentName = override.componentName;
          nested.customPropName = override.propName;
          addImport({ typeName: override.componentName, componentName: override.componentName, isCustom: true, importPath: override.importPath });
        } else {
          nested.itemTitleProperty = isArrayType ? this.titlePropertyOf(baseType) : undefined;
          addImport({ typeName: baseType, componentName });
        }
        k8sTypeProperties.push(nested);
      } else if (MAP_TYPE.test(info.type)) {
        const override = this.objectOverrides[metaConfig.resourceName]?.[name];
        if (override) {
          k8sTypeProperties.push({
            ...propData,
            isArray: false,
            isSpec: false,
            isConditions: false,
            defaultOpen: true,
            componentName: override.componentName,
            hasCustomRenderer: true,
            customComponentName: override.componentName,
            customPropName: override.propName,
          });
          addImport({ typeName: name, componentName: override.componentName, isCustom: true, importPath: override.importPath });
        } else {
          objectProperties.push(propData);
        }
      } else if (info.type === 'boolean') {
        booleanProperties.push(propData);
      } else if (SIMPLE_TYPE.test(info.type)) {
        simpleProperties.push(propData);
      } else {
        console.warn(`  ${metaConfig.resourceName}.${name}: unsupported type ${info.type}, skipped`);
      }
    }

    const hasSimpleBlock = simpleProperties.length > 0 || booleanProperties.length > 0;
    const hasAnyProperty = hasSimpleBlock || objectProperties.length > 0 || k8sTypeProperties.length > 0 || hasMetadata;

    const needsContainer = k8sTypeProperties.some((prop) => {
      if (prop.isArray) {
        return !prop.hasCustomRenderer || !prop.isConditions;
      }
      return !prop.isSpec && !prop.hasCustomRenderer;
    });
    const needsPanelListItem = k8sTypeProperties.some((prop) => prop.isArray && !prop.hasCustomRenderer);

    const panelImports: string[] = [];
    if (hasSimpleBlock || objectProperties.length > 0) panelImports.push('PanelGrid');
    if (needsPanelListItem) panelImports.push('PanelListItem');
    if (simpleProperties.length > 0 || k8sTypeProperties.length > 0) panelImports.push('hasValue');

    return {
      resourceTypeName: metaConfig.resourceName,
      componentName: this.componentNameFor(metaConfig.resourceName),
      description: metaConfig.description,
      objectProperties,
      booleanProperties,
      simpleProperties,
      k8sTypeProperties,
      nestedK8sTypes,
      hasMetadata,
      hasSimpleBlock,
      hasAnyProperty,
      needsContainer,
      panelImports,
    };
  }

  // Arrays of named objects get each entry titled by its name.
  private titlePropertyOf(typeName: string): string | undefined {
    const nameProperty = this.metaByType.get(typeName)?.properties?.name;
    return nameProperty && nameProperty.type === 'string' ? 'name' : undefined;
  }

  // The API docs run to paragraphs; the first sentence is what fits a tooltip.
  private shortDescription(description?: string): string | undefined {
    if (!description) {
      return undefined;
    }
    const cleaned = description.replace(/\\+(['"])/g, '$1').replace(/\s+/g, ' ').trim();
    const firstSentence = cleaned.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? cleaned;
    if (firstSentence.length <= MAX_DESCRIPTION_LENGTH) {
      return firstSentence;
    }
    return firstSentence.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd() + '…';
  }

  private componentNameFor(typeName: string): string {
    return this.humanizeResourceName(typeName).replace(/\s+/g, '') + 'Details';
  }

  private humanizeResourceName(name: string): string {
    return name.replace(/^V\d+/, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  }

  private humanizePropertyName(name: string): string {
    return name
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}

// CLI execution
if (require.main === module) {
  const generator = new DisplayResourceGenerator();
  generator.generate().catch(console.error);
}
