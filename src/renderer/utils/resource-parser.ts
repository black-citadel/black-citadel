/**
 * Parse Kubernetes resource values to numbers
 * Handles CPU (cores, millicores) and Memory (bytes with suffixes)
 */

export function parseCPU(value: string | number | undefined): number {
    if (!value) return 0;
    
    // Convert to string for consistent handling
    const str = value.toString().trim();
    
    // Handle different CPU formats with explicit suffixes
    if (str.endsWith('n')) {
        // Nanocores (e.g., "1000000000n")
        return parseFloat(str.slice(0, -1)) / 1_000_000_000;
    }
    
    if (str.endsWith('u')) {
        // Microcores (e.g., "1000000u")
        return parseFloat(str.slice(0, -1)) / 1_000_000;
    }
    
    if (str.endsWith('m')) {
        // Millicores (e.g., "100m", "2000m")
        return parseFloat(str.slice(0, -1)) / 1000;
    }
    
    // Parse the numeric value
    const num = parseFloat(str);
    
    // If parsing failed, return 0
    if (isNaN(num)) return 0;
    
    // Auto-detect based on magnitude when no suffix is present
    // This is a heuristic approach based on typical Kubernetes values
    if (num >= 1_000_000_000) {
        // Values >= 1 billion are likely nanocores
        return num / 1_000_000_000;
    } else if (num >= 1_000_000) {
        // Values >= 1 million but < 1 billion might be microcores
        // But this is ambiguous - could also be millicores
        // For safety, we'll treat very large values as nanocores
        return num / 1_000_000_000;
    } else if (num >= 100) {
        // Values >= 100 but < 1 million are likely millicores
        // (100 millicores = 0.1 cores is a common minimum)
        // But values like 100-999 could be cores on large systems
        // We'll use a threshold: > 100 cores is unlikely in practice
        if (num > 100) {
            return num / 1000; // Treat as millicores
        }
    }
    
    // For small values (< 100), treat as cores
    // This handles cases like "2", "0.5", "8", "16" etc.
    return num;
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