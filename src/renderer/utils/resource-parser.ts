/**
 * Parse Kubernetes resource values to numbers
 * Handles CPU (cores, millicores) and Memory (bytes with suffixes)
 */

export function parseCPU(value: string | number | undefined): number {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    
    const str = value.toString();
    
    // Handle millicores (e.g., "100m", "2000m")
    if (str.endsWith('m')) {
        return parseFloat(str.slice(0, -1)) / 1000;
    }
    
    // Handle regular cores (e.g., "2", "0.5")
    return parseFloat(str);
}

export function parseBytes(value: string | number | undefined): number {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    
    const str = value.toString();
    
    // Extract number and unit
    const match = str.match(/^(\d+(?:\.\d+)?)\s*([KMGTPE]i?)?$/);
    if (!match) return 0;
    
    const num = parseFloat(match[1]);
    const unit = match[2];
    
    // Convert to bytes based on unit
    const multipliers: { [key: string]: number } = {
        'K': 1000,
        'M': 1000 ** 2,
        'G': 1000 ** 3,
        'T': 1000 ** 4,
        'P': 1000 ** 5,
        'E': 1000 ** 6,
        'Ki': 1024,
        'Mi': 1024 ** 2,
        'Gi': 1024 ** 3,
        'Ti': 1024 ** 4,
        'Pi': 1024 ** 5,
        'Ei': 1024 ** 6,
    };
    
    return unit ? num * (multipliers[unit] || 1) : num;
}

export function formatCPU(cores: number): string {
    if (cores >= 1) {
        return `${cores.toFixed(1)} cores`;
    } else {
        return `${Math.round(cores * 1000)}m`;
    }
}

export function formatBytes(bytes: number): string {
    const units = ['B', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi'];
    let value = bytes;
    let unitIndex = 0;
    
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }
    
    return `${value.toFixed(1)}${units[unitIndex]}`;
}