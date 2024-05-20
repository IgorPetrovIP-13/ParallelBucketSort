import { Worker } from 'worker_threads';

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
        const promises = buckets.map((bucket) => {
            return new Promise((resolve, reject) => {
                const worker = new Worker(new URL('./bucketWorker.mjs', import.meta.url), {
                    workerData: bucket
                });
                worker.on('message', resolve);
                worker.on('error', reject);
                worker.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new Error(`Worker stopped with exit code ${code}`));
                    }
                });
            });
        });
        Promise.all(promises)
            .then((sortedBuckets) => {
                const sortedArray = [];
                sortedBuckets.forEach((bucket) => {
                    sortedArray.push(...bucket);
                });
                resolve(sortedArray);
            })
            .catch(reject);
    });
}