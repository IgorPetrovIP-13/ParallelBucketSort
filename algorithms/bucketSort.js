export default function bucketSort(array, bucketSize) {
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

    const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
    const buckets = new Array(bucketCount).fill().map(() => []);
    
    for (let i = 0; i < buckets.length; i++) {
        buckets[i] = [];
    }

    array.forEach((currentVal) => {
        const bucketIndex = Math.floor((currentVal - minValue) / bucketSize);
        buckets[bucketIndex].push(currentVal);
    });

    const sortedArray = [];
    for (let i = 0; i < buckets.length; i++) {
        buckets[i].sort((a, b) => a - b);
        sortedArray.push(...buckets[i]);
    }

    return sortedArray;
}
