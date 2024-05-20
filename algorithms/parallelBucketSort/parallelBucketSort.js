import { Worker } from 'worker_threads';
import os from 'os';

export default function parallelBucketSort(array, bucketSize) {
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

        const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
        const buckets = new Array(bucketCount).fill().map(() => []);

        array.forEach((currentVal) => {
            const bucketIndex = Math.floor((currentVal - minValue) / bucketSize);
            buckets[bucketIndex].push(currentVal);
        });

        const cpuCount = os.cpus().length;
        const workers = Math.min(cpuCount, bucketCount);
        const promises = [];

        for (let i = 0; i < workers; i++) {
            promises.push(new Promise((resolve, reject) => {
                const workerBuckets = buckets.slice(i * Math.ceil(bucketCount / workers), (i + 1) * Math.ceil(bucketCount / workers));
                const worker = new Worker(new URL('./bucketWorker.js', import.meta.url), {
                    workerData: workerBuckets
                });
                worker.on('message', resolve);
                worker.on('error', reject);
                worker.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new Error(`Worker stopped with exit code ${code}`));
                    }
                });
            }));
        }

        Promise.all(promises)
            .then((sortedBuckets) => {
                const sortedArray = [];
                sortedBuckets.flat().forEach((bucket) => {
                    sortedArray.push(...bucket);
                });
                resolve(sortedArray);
            })
            .catch(reject);
    });
}