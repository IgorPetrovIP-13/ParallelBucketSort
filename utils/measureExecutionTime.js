import { performance } from 'perf_hooks';

export default async function measureExecutionTime(func, ...args) {
    const runs = 3;
    let totalTime = 0;
    let result;

    for (let i = 0; i < runs; i++) {
        const start = performance.now();
        if (i === 0){
            result = await func(...args);
        }
        else {
            await func(...args);
        }
        const end = performance.now();
        totalTime += end - start;
    }

    const averageTime = totalTime / runs;
    console.log(`Function ${func.name} executed in average ${Math.ceil(averageTime)} milliseconds over ${runs} runs`);
    return result;
}

