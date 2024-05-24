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
            if (array[i] < minValue) {
                minValue = array[i];
            } else if (array[i] > maxValue) {
                maxValue = array[i];
            }
        }

        const interval = (maxValue - minValue + 1) / num_buckets;
        const buckets = Array.from({ length: num_buckets }, () => []);

        for (let i = 0; i < array.length; i++) {
            let bucket_index = Math.floor((array[i] - minValue) / interval);
            if (bucket_index === num_buckets) {
                bucket_index--;
            }
            buckets[bucket_index].push(array[i]);
        }

        const cpuCount = os.cpus().length;
        const workers = Math.min(cpuCount, num_buckets);
        const promises = [];

        const bucketsPerWorker = Math.ceil(num_buckets / workers);
        for (let i = 0; i < workers; i++) {
            promises.push(
                new Promise((resolve, reject) => {
                    const start = i * bucketsPerWorker;
                    const end = Math.min(start + bucketsPerWorker, num_buckets);
                    const workerBuckets = buckets.slice(start, end);

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