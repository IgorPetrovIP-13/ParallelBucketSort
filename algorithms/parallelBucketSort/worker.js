import { parentPort, workerData } from "worker_threads";
import bubbleSort from "../bubbleSort.js";

const sortedBuckets = workerData.map(bucket => {
    bubbleSort(bucket);
    return bucket;
});

parentPort.postMessage(sortedBuckets);
