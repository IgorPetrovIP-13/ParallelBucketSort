export default async function measureExecutionTime(func, ...args) {
    const start = process.hrtime.bigint();
    const result = await func(...args);
    const end = process.hrtime.bigint();
    const duration = end - start;
    const durationInSeconds = Number(duration) / 1e9;
    console.log(`Function ${func.name} executed in ${durationInSeconds} seconds `);
    return result;
}
