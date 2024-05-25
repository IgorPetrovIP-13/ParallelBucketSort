import bucketSort from "./algorithms/bucketSort.js";
import parallelBucketSort from "./algorithms/parallelBucketSort/parallelBucketSort.js";
import measureExecutionTime from "./utils/measureExecutionTime.js";
import generateRandomArray from "./utils/generateArray.js";
import isSorted from "./utils/isSorted.js";
import "dotenv/config"

async function warmUp() {
    const arraySize = 1000;
    const array = generateRandomArray(arraySize);
    for (let i = 0; i < 10; i++) {
        await bucketSort(array, 5);
        // await parallelBucketSort(array, 5);
    }
}

async function main() {
    const arraySize = parseInt(process.env.ARRAY_SIZE, 10);
    const array = generateRandomArray(arraySize);

    await warmUp();

    // const sortedSequential = await measureExecutionTime(bucketSort, array, 10);
    const sortedParallel = await measureExecutionTime(parallelBucketSort, array, 10);

    // console.log(`Is sequential sorted: ${isSorted(sortedSequential)}`);
    console.log(`Is parallel sorted: ${isSorted(sortedParallel)}`);
    // console.log(`Are equal: ${JSON.stringify(sortedSequential) === JSON.stringify(sortedParallel)}`)
}

main().catch(console.error);