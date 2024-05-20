import { parentPort, workerData } from 'worker_threads';
const sortedBucket = workerData.sort((a, b) => a - b);
parentPort.postMessage(sortedBucket);