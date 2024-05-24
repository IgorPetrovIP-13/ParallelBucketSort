import bubbleSort from "./bubbleSort.js";

export default function bucketSort(array, num_buckets) {
    if (array.length === 0) {
        return array;
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
    console.log(interval);
    const buckets = new Array(num_buckets).fill().map(() => []);

    for (let i = 0; i < array.length; i++) {
        const bucket_index = Math.floor((array[i] - minValue) / interval);
        buckets[bucket_index].push(array[i]);
    }
    const sortedArray = [];
    for (let i = 0; i < num_buckets; i++) {
        bubbleSort(buckets[i]);
        sortedArray.push(...buckets[i]);
    }
    return sortedArray;
}
