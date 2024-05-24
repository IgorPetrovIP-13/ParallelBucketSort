import { parentPort, workerData } from "worker_threads";
import bubbleSort from "../bubbleSort.js";

const bucketSort = (array) => {
    return bubbleSort(array);
};

const sortedBuckets = workerData.map(bucketSort);

parentPort.postMessage(sortedBuckets);
