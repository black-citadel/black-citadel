import { Project, ClassDeclaration, InterfaceDeclaration } from 'ts-morph';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { K8sResource, K8sResourceConfig } from '../types';
import { CONFIG_DIR, resolveFromRoot, modelFileName } from '../paths';

export class K8sTypeDiscoveryGenerator {
  private project: Project;
  private configPath: string;
  private discoveredTypes: Map<string, K8sResource>;
  private processedTypes: Set<string>;

  constructor() {
    this.project = new Project({
      compilerOptions: {
        target: 99, // Latest
        module: 99, // ESNext
      },
    });
    this.configPath = path.join(CONFIG_DIR, 'k8s-resources.yaml');
    this.discoveredTypes = new Map();
    this.processedTypes = new Set();
  }

  async generate(): Promise<void> {
    console.log('Discovering Kubernetes types...\n');

    // Read existing config
    const configContent = fs.readFileSync(this.configPath, 'utf8');
    const existingConfig = yaml.load(configContent) as K8sResourceConfig;

    // Add existing types to processed set
    for (const typeName of Object.keys(existingConfig)) {
      this.processedTypes.add(typeName);
    }

    // Process each existing type to find nested types
    for (const [typeName, config] of Object.entries(existingConfig)) {
      console.log(`  Scanning ${typeName}...`);
      await this.discoverNestedTypes(resolveFromRoot(config.type));
    }

    // Add discovered types to config
    let updated = false;
    for (const [typeName, typeConfig] of this.discoveredTypes.entries()) {
      if (!existingConfig[typeName]) {
        existingConfig[typeName] = typeConfig;
        updated = true;
        console.log(`  Added: ${typeName}`);
      }
    }

    // Write updated config if changes were made
    if (updated) {
      const yamlContent = yaml.dump(existingConfig, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
        forceQuotes: false
      });
      fs.writeFileSync(this.configPath, yamlContent);
      console.log(`\nUpdated ${this.configPath} with ${this.discoveredTypes.size} new types`);
    } else {
      console.log('No new types discovered');
    }
  }

  private async discoverNestedTypes(typePath: string): Promise<void> {
    try {
      const sourceFile = this.project.addSourceFileAtPath(typePath);
      
      // Find all classes and interfaces
      const classes = sourceFile.getClasses();
      const interfaces = sourceFile.getInterfaces();
      
      // Process classes
      for (const cls of classes) {
        const className = cls.getName();
        if (className && className.match(/^[A-Za-z]*V\d+[A-Z]/)) {
          await this.processClass(cls, typePath);
        }
      }
      
      // Process interfaces
      for (const iface of interfaces) {
        const ifaceName = iface.getName();
        if (ifaceName && ifaceName.match(/^[A-Za-z]*V\d+[A-Z]/)) {
          await this.processInterface(iface, typePath);
        }
      }
    } catch (error) {
      // Ignore errors for files that don't exist
    }
  }

  private async processClass(cls: ClassDeclaration, currentPath: string): Promise<void> {
    const className = cls.getName();
    if (!className) return;
    
    const isNewType = !this.processedTypes.has(className);
    this.processedTypes.add(className);
    
    const properties = cls.getProperties();
    let propertyOrder: string[] = [];
    const nestedTypes: string[] = [];
    
    for (const prop of properties) {
      const propName = prop.getName().replace(/^['"]|['"]$/g, '');
      
      // Skip internal properties
      if (propName === 'discriminator' || propName === 'mapping' || propName === 'attributeTypeMap') {
        continue;
      }
      
      // Skip apiVersion and kind from order
      if (propName !== 'apiVersion' && propName !== 'kind') {
        propertyOrder.push(propName);
      }
      
      // Check if property type is a K8s type
      const propType = prop.getType().getText();
      // Also check for import types
      const cleanType = propType.replace(/import\([^)]+\)\./g, '');
      const typeMatch = cleanType.match(/\b[A-Za-z]*V\d+[A-Z]\w+/);
      if (typeMatch) {
        nestedTypes.push(typeMatch[0]);
      }
    }
    
    // Add metadata to the end if it exists and isn't already there
    if (propertyOrder.includes('metadata')) {
      propertyOrder = propertyOrder.filter(p => p !== 'metadata');
      propertyOrder.push('metadata');
    }
    
    // Create type config only if it's a new type
    if (isNewType) {
      const typeDir = path.dirname(currentPath);
      const typePath = path.join(typeDir, modelFileName(className));
      
      this.discoveredTypes.set(className, {
        type: typePath.replace(/.*node_modules\//, 'node_modules/'),
        order: propertyOrder.length > 0 ? propertyOrder : undefined
      });
    }
    
    // Recursively process nested types
    const typeDir = path.dirname(currentPath);
    for (const nestedType of nestedTypes) {
      const nestedPath = path.join(typeDir, modelFileName(nestedType));
      await this.discoverNestedTypes(nestedPath);
    }
  }

  private async processInterface(iface: InterfaceDeclaration, currentPath: string): Promise<void> {
    const ifaceName = iface.getName();
    if (!ifaceName) return;
    
    const isNewType = !this.processedTypes.has(ifaceName);
    this.processedTypes.add(ifaceName);
    
    const properties = iface.getProperties();
    let propertyOrder: string[] = [];
    const nestedTypes: string[] = [];
    
    for (const prop of properties) {
      const propName = prop.getName().replace(/^['"]|['"]$/g, '');
      
      // Skip apiVersion and kind from order
      if (propName !== 'apiVersion' && propName !== 'kind') {
        propertyOrder.push(propName);
      }
      
      // Check if property type is a K8s type
      const propType = prop.getType().getText();
      // Also check for import types
      const cleanType = propType.replace(/import\([^)]+\)\./g, '');
      const typeMatch = cleanType.match(/\b[A-Za-z]*V\d+[A-Z]\w+/);
      if (typeMatch) {
        nestedTypes.push(typeMatch[0]);
      }
    }
    
    // Add metadata to the end if it exists and isn't already there
    if (propertyOrder.includes('metadata')) {
      propertyOrder = propertyOrder.filter(p => p !== 'metadata');
      propertyOrder.push('metadata');
    }
    
    // Create type config only if it's a new type
    if (isNewType) {
      const typeDir = path.dirname(currentPath);
      const typePath = path.join(typeDir, modelFileName(ifaceName));
      
      this.discoveredTypes.set(ifaceName, {
        type: typePath.replace(/.*node_modules\//, 'node_modules/'),
        order: propertyOrder.length > 0 ? propertyOrder : undefined
      });
    }
    
    // Recursively process nested types
    const typeDir = path.dirname(currentPath);
    for (const nestedType of nestedTypes) {
      const nestedPath = path.join(typeDir, modelFileName(nestedType));
      await this.discoverNestedTypes(nestedPath);
    }
  }
}

// CLI execution
if (require.main === module) {
  const generator = new K8sTypeDiscoveryGenerator();
  generator.generate().catch(console.error);
}