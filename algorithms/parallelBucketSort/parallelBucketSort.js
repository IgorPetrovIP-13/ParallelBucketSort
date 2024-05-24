import { Worker } from "worker_threads";
import os from "os";

export default function parallelBucketSort(array, num_buckets) {
    return new Promise((resolve, reject) => {
        if (array.length === 0) {
            resolve(array);
            return;
        }

        let minValue = array[0];
        let maxValue = array[0];
    
        for (let i = 1; i < array.length; i++) {
            if (array[i].accountBalance < minValue.accountBalance) {
                minValue = array[i];
            } else if (array[i].accountBalance > maxValue.accountBalance) {
                maxValue = array[i];
            }
        }
    
        const interval = (maxValue.accountBalance - minValue.accountBalance + 1) / num_buckets;
        const buckets = Array.from({ length: num_buckets }, () => []);
    
        for (let i = 0; i < array.length; i++) {
            const bucket_index = Math.floor((array[i].accountBalance - minValue.accountBalance) / interval);
            const index = bucket_index === num_buckets ? num_buckets - 1 : bucket_index;
            buckets[index].push(array[i]);
        }
    
        const cpuCount = os.cpus().length;
        const workers = Math.min(cpuCount, num_buckets);
        const promises = [];

        const bucketsPerWorker = Math.floor(num_buckets / workers);
        const extraBuckets = num_buckets % workers;

        let offset = 0;
        for (let i = 0; i < workers; i++) {

            const end = offset + bucketsPerWorker + (i < extraBuckets ? 1 : 0);
            const workerBuckets = buckets.slice(offset, end);
            offset = end;

            promises.push(
                new Promise((resolve, reject) => {

                    const worker = new Worker(new URL("./worker.js", import.meta.url), {
                        workerData: workerBuckets,
                    });

                    worker.on("message", resolve);
                    worker.on("error", reject);
                    worker.on("exit", (code) => {
                        if (code !== 0) {
                            reject(new Error(`Worker stopped with exit code ${code}`));
                        }
                    });
                })
            );
        }

        Promise.all(promises)
            .then((sortedBuckets) => {
                const sortedArray = [];
                sortedBuckets.forEach((sortedChunk) => {
                    sortedChunk.forEach((bucket) => {
                        sortedArray.push(...bucket);
                    });
                });
                resolve(sortedArray);
            })
            .catch(reject);
    });
}