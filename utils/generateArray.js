function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function generateRandomArray(size) {
    const minNumber = 1;
    const maxNumber = 100;
    const randomArray = [];
    
    for (let i = 0; i < size; i++) {
        randomArray.push(getRandomNumber(minNumber, maxNumber));
    }
    
    return randomArray;
}