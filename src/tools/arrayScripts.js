export const deepCloneArray = (originArray) => {
    return JSON.parse(JSON.stringify(originArray));
    //return __dirname.cloneDeep(originArray);
}

export const shuffleArray = (array) => {
    for(let i = array.length - 1; i > 0; i--){
        const rand = Math.floor(Math.random() * (i+1));
        [array[i], array[rand]] = [array[rand], array[i]];
    }
}