import { performance } from 'perf_hooks';

export default async function measureExecutionTime(func, ...args) {
    const start = performance.now();
    const result = await func(...args);
    const end = performance.now();
    console.log(`Function ${func.name} executed in ${Math.ceil(end - start)} milliseconds `);
    return result;
}

