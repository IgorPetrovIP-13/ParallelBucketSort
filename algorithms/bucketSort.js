import bubbleSort from "./bubbleSort.js";

export default function bucketSort(array, num_buckets) {
    if (array.length === 0) {
        return array;
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

    const sortedArray = [];

    buckets.forEach(bucket => {
        bubbleSort(bucket);
        sortedArray.push(...bucket);
    });

    return sortedArray;
}