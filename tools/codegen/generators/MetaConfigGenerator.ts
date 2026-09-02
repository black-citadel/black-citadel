import { Project, PropertySignature, MethodSignature } from 'ts-morph';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { K8sResourceConfig, PropertyInfo, ResourceMetaConfig } from '../types';
import { CONFIG_DIR, META_DIR, resolveFromRoot } from '../paths';

export class MetaConfigGenerator {
  private project: Project;

  constructor() {
    this.project = new Project({
      compilerOptions: {
        target: 99, // Latest
        module: 99, // ESNext
      },
    });
  }

  async generate(): Promise<void> {
    // Read k8s-resources.yaml
    const configPath = path.join(CONFIG_DIR, 'k8s-resources.yaml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    const resources = yaml.load(configContent) as K8sResourceConfig;

    // Create output directory
    const outputDir = META_DIR;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Generating meta config files...\n');

    // Process each resource
    for (const [resourceName, resourceConfig] of Object.entries(resources)) {
      console.log(`Processing ${resourceName}...`);
      
      try {
        // Add the TypeScript definition file to the project
        const sourceFile = this.project.addSourceFileAtPath(resolveFromRoot(resourceConfig.type));
        
        const metaConfig: ResourceMetaConfig = {
          resourceName: '',
          properties: {}
        };
        
        // Find the main interface/class
        const interfaces = sourceFile.getInterfaces();
        const classes = sourceFile.getClasses();
        
        // Process interfaces
        for (const iface of interfaces) {
          if (iface.getName()?.includes(resourceName.replace(/([a-z])([A-Z])/g, '$1$2'))) {
            metaConfig.resourceName = iface.getName() || resourceName;
            
            // Extract description from JSDoc
            const jsDocs = iface.getJsDocs();
            if (jsDocs.length > 0) {
              const description = jsDocs[0].getDescription().trim();
              if (description) {
                metaConfig.description = description;
              }
            }
            
            this.extractProperties(iface.getProperties(), metaConfig.properties);
          }
        }
        
        // Process classes
        for (const cls of classes) {
          if (cls.getName()?.includes(resourceName.replace(/([a-z])([A-Z])/g, '$1$2'))) {
            metaConfig.resourceName = cls.getName() || resourceName;
            
            // Extract description from JSDoc
            const jsDocs = cls.getJsDocs();
            if (jsDocs.length > 0) {
              const description = jsDocs[0].getDescription().trim();
              if (description) {
                metaConfig.description = description;
              }
            }
            // Get properties from class
            const properties = cls.getProperties();
            for (const prop of properties) {
              let propName = prop.getName();
              // Skip internal implementation properties
              if (propName === 'discriminator' || propName === 'mapping' || propName === 'attributeTypeMap') {
                continue;
              }
              
              // Remove quotes from property names
              propName = propName.replace(/^['"]|['"]$/g, '');
              
              const type = prop.getType().getText();
              const propertyInfo: PropertyInfo = {
                type: this.simplifyType(type),
                optional: prop.hasQuestionToken?.() || false
              };
              
              // Extract property description from JSDoc
              const jsDocs = prop.getJsDocs();
              if (jsDocs.length > 0) {
                const description = jsDocs[0].getDescription().trim();
                if (description) {
                  propertyInfo.description = description;
                }
              }
              
              metaConfig.properties[propName] = propertyInfo;
            }
          }
        }
        
        // Skip if no resource name was found
        if (!metaConfig.resourceName) {
          console.error(`  No matching class/interface found for ${resourceName}`);
          continue;
        }
        
        // Write YAML file
        const outputPath = path.join(outputDir, `${metaConfig.resourceName}.yaml`);
        const yamlContent = yaml.dump(metaConfig, { 
          indent: 2,
          lineWidth: -1,
          noRefs: true,
          quotingType: '"',
          forceQuotes: false
        });
        fs.writeFileSync(outputPath, yamlContent);
        
        console.log(`  Generated: ${outputPath}`);
        
      } catch (error) {
        console.error(`Error processing ${resourceName}: ${error.message}`);
      }
    }
    
    console.log('\nMeta config generation complete!');
  }

  private extractProperties(properties: PropertySignature[], target: Record<string, PropertyInfo>): void {
    for (const prop of properties) {
      let name = prop.getName();
      // Remove quotes from property names
      name = name.replace(/^['"]|['"]$/g, '');
      
      const type = prop.getType().getText();
      const isOptional = prop.hasQuestionToken();
      const docs = prop.getJsDocs();
      
      target[name] = {
        type: this.simplifyType(type),
        optional: isOptional
      };
      
      // Add description if available
      if (docs.length > 0) {
        const description = docs[0].getDescription().trim();
        if (description) {
          target[name].description = description;
        }
      }
    }
  }

  
  private simplifyType(type: string): string {
    // Remove import statements
    type = type.replace(/import\([^)]+\)\./g, '');
    
    // Simplify common types
    if (type.includes('{ [key: string]: string; }')) {
      return 'Record<string, string>';
    }
    
    return type;
  }
}

// CLI execution
if (require.main === module) {
  const generator = new MetaConfigGenerator();
  generator.generate().catch(console.error);
}