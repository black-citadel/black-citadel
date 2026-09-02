import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as Handlebars from 'handlebars';
import { PropertyInfo, ResourceMetaConfig, K8sResourceConfig } from '../types';
import { CONFIG_DIR, META_DIR, OUTPUT_DIR, TEMPLATE_PATH } from '../paths';

interface ArrayOverride {
  componentName: string;
  propName: string;
  importPath?: string;
}

interface ArrayOverridesConfig {
  overrides: Record<string, ArrayOverride>;
}

interface ObjectOverride {
  componentName: string;
  propName: string;
  importPath?: string;
}

interface ObjectOverridesConfig {
  overrides: Record<string, Record<string, ObjectOverride>>;
}

export class DisplayResourceGenerator {
  private templatePath: string;
  private metaConfigDir: string;
  private outputDir: string;
  private arrayOverrides: Record<string, ArrayOverride> = {};
  private objectOverrides: Record<string, Record<string, ObjectOverride>> = {};

  constructor() {
    this.templatePath = TEMPLATE_PATH;
    this.metaConfigDir = META_DIR;
    this.outputDir = OUTPUT_DIR;
    
    // Load overrides
    this.loadArrayOverrides();
    this.loadObjectOverrides();
  }

  private loadArrayOverrides(): void {
    const overridesPath = path.join(CONFIG_DIR, 'array-overrides.yaml');
    if (fs.existsSync(overridesPath)) {
      const content = fs.readFileSync(overridesPath, 'utf8');
      const config = yaml.load(content) as ArrayOverridesConfig;
      this.arrayOverrides = config.overrides || {};
    }
  }

  private loadObjectOverrides(): void {
    const overridesPath = path.join(CONFIG_DIR, 'object-overrides.yaml');
    if (fs.existsSync(overridesPath)) {
      const content = fs.readFileSync(overridesPath, 'utf8');
      const config = yaml.load(content) as ObjectOverridesConfig;
      this.objectOverrides = config.overrides || {};
    }
  }

  async generate(): Promise<void> {
    console.log('Generating resource display files...\n');

    // Register Handlebars helpers
    Handlebars.registerHelper('eq', function(a: any, b: any) {
      return a === b;
    });

    // Read and compile template
    const templateSource = fs.readFileSync(this.templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);

    // Read k8s-resources.yaml for ordering
    const k8sResourcesPath = path.join(CONFIG_DIR, 'k8s-resources.yaml');
    const k8sResourcesContent = fs.readFileSync(k8sResourcesPath, 'utf8');
    const k8sResources = yaml.load(k8sResourcesContent) as K8sResourceConfig;

    // Get all yaml files from meta/config
    const metaFiles = fs.readdirSync(this.metaConfigDir)
      .filter(file => file.endsWith('.yaml'));

    for (const metaFile of metaFiles) {
      console.log(`Processing ${metaFile}...`);
      
      try {
        // Read meta config
        const metaPath = path.join(this.metaConfigDir, metaFile);
        const metaContent = fs.readFileSync(metaPath, 'utf8');
        const metaConfig = yaml.load(metaContent) as ResourceMetaConfig;

        // Create output directory for this resource
        const resourceOutputDir = path.join(this.outputDir, metaConfig.resourceName);
        if (!fs.existsSync(resourceOutputDir)) {
          fs.mkdirSync(resourceOutputDir, { recursive: true });
        }

        // Find the resource config for ordering by matching the type path
        let propertyOrder: string[] = [];
        for (const config of Object.values(k8sResources)) {
          if (config.type.includes(metaConfig.resourceName)) {
            propertyOrder = config.order || [];
            break;
          }
        }

        // Filter out apiVersion and kind properties only for main resources (not references)
        const filteredProperties: Record<string, PropertyInfo> = {};
        const isReference = metaConfig.resourceName.includes('Reference');
        for (const [propName, propInfo] of Object.entries(metaConfig.properties)) {
          if (isReference || (propName !== 'apiVersion' && propName !== 'kind')) {
            filteredProperties[propName] = propInfo;
          }
        }

        // Sort properties based on order if available
        let propertyList = Object.entries(filteredProperties);
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

        // Categorize properties by type
        const objectProperties: any[] = [];
        const booleanProperties: any[] = [];
        const simpleProperties: any[] = [];
        const k8sTypeProperties: any[] = [];
        const nestedK8sTypes: any[] = [];
        let hasMetadata = false;

        for (const [name, info] of propertyList) {
          if (name === 'metadata') {
            hasMetadata = true;
            continue;
          }

          const propData = {
            name,
            displayName: this.humanizePropertyName(name),
            varName: name + 'Items',
            type: info.type,
            optional: info.optional || false,
            description: info.description
          };

          // Check if this is a Kubernetes type (starts with V1, V2, etc.)
          const isArrayType = info.type.endsWith('[]');
          const baseType = isArrayType ? info.type.slice(0, -2) : info.type;
          
          if (baseType.match(/^(V\d+[A-Z]|CoreV\d+[A-Z])/)) {
            // Check for array override
            const override = isArrayType ? this.arrayOverrides[baseType] : null;
            
            if (override) {
              // Use custom component for this array type
              k8sTypeProperties.push({
                ...propData,
                isArray: isArrayType,
                isSpec: name === 'spec',
                hasCustomRenderer: true,
                customComponentName: override.componentName,
                customPropName: override.propName,
                componentName: this.humanizeResourceName(baseType).replace(/\s+/g, '') + 'Details'
              });
              // Add the custom component to imports
              if (!nestedK8sTypes.find(t => t.typeName === override.componentName)) {
                nestedK8sTypes.push({
                  typeName: override.componentName,
                  componentName: override.componentName,
                  isCustom: true,
                  importPath: override.importPath
                });
              }
            } else {
              k8sTypeProperties.push({
                ...propData,
                isArray: isArrayType,
                isSpec: name === 'spec',
                componentName: this.humanizeResourceName(baseType).replace(/\s+/g, '') + 'Details'
              });
              const existingType = nestedK8sTypes.find(t => t.typeName === baseType);
              if (!existingType) {
                nestedK8sTypes.push({
                  typeName: baseType,
                  componentName: this.humanizeResourceName(baseType).replace(/\s+/g, '') + 'Details'
                });
              }
            }
          } else if (info.type.includes('Record') || info.type.includes('Map') || info.type.includes('{ [key: string]')) {
            // Check for object property override
            const resourceOverrides = this.objectOverrides[metaConfig.resourceName];
            const override = resourceOverrides ? resourceOverrides[name] : null;
            
            if (override) {
              // Use custom component for this object property
              k8sTypeProperties.push({
                ...propData,
                isArray: false,
                isSpec: false,
                hasCustomRenderer: true,
                customComponentName: override.componentName,
                customPropName: override.propName,
                componentName: override.componentName
              });
              
              // Add to nested types for import
              nestedK8sTypes.push({
                typeName: name,
                componentName: override.componentName,
                isCustom: true,
                importPath: override.importPath
              });
            } else {
              objectProperties.push(propData);
            }
          } else if (info.type === 'boolean') {
            booleanProperties.push(propData);
          } else if (info.type === 'string' || info.type === 'number' || info.type === 'IntOrString') {
            simpleProperties.push(propData);
          }
        }

        // Determine if Container import is needed
        const needsContainer = k8sTypeProperties.some(prop => {
          // Container is needed if:
          // 1. It's an array without custom renderer (except conditions which don't use Container)
          // 2. It's not an array, not spec, and not a custom renderer
          if (prop.isArray) {
            return !prop.hasCustomRenderer || (prop.hasCustomRenderer && prop.name !== 'conditions');
          } else {
            return !prop.isSpec && !prop.hasCustomRenderer;
          }
        });

        // Determine if PanelGrid import is needed
        const needsPanelGrid = objectProperties.length > 0 || 
                               simpleProperties.length > 0 || 
                               booleanProperties.length > 0;

        // Prepare template data
        const templateData = {
          resourceTypeName: metaConfig.resourceName,
          componentName: this.humanizeResourceName(metaConfig.resourceName).replace(/\s+/g, '') + 'Details',
          description: metaConfig.description,
          objectProperties,
          booleanProperties,
          simpleProperties,
          k8sTypeProperties,
          nestedK8sTypes,
          hasMetadata,
          needsContainer,
          needsPanelGrid
        };

        // Render template
        const html = template(templateData);

        // Write output file
        const outputPath = path.join(resourceOutputDir, 'details.tsx');
        fs.writeFileSync(outputPath, html);
        
        console.log(`  Generated: ${outputPath}`);
        
      } catch (error) {
        console.error(`Error processing ${metaFile}: ${error.message}`);
      }
    }
    
    console.log('\nResource display generation complete!');
  }

  private humanizeResourceName(name: string): string {
    // Remove V1 prefix
    const withoutPrefix = name.replace(/^V\d+/, '');
    
    // Add spaces between camelCase words
    return withoutPrefix.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  }

  private humanizePropertyName(name: string): string {
    // Convert camelCase to Title Case
    return name
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private formatType(type: string): string {
    // Simplify type display
    return type
      .replace('Record<string, string>', 'Map<String, String>')
      .replace(/^V\d+/, ''); // Remove V1 prefix from types
  }

  private toCamelCase(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

}

// CLI execution
if (require.main === module) {
  const generator = new DisplayResourceGenerator();
  generator.generate().catch(console.error);
}