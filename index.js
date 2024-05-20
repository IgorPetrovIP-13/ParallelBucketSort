import bucketSort from "./algorithms/bucketSort.js";
import parallelBucketSort from "./algorithms/parallelBucketSort/parallelBucketSort.js";
import measureExecutionTime from "./utils/measureExecutionTime.js";
import generateRandomArray from "./utils/generateArray.js";
import isSorted from "./utils/isSorted.js";
import "dotenv/config"

async function main() {
    const array = generateRandomArray(process.env.ARRAY_SIZE);
    await measureExecutionTime(bucketSort, array, 6);
    await measureExecutionTime(parallelBucketSort, array, 6);


}

main()