export function max(array) {
    return Math.max.apply(null, array);
}

export function min(array) {
    return Math.min.apply(null, array);
}

export function range(array) {
    return max(array) - min(array);
}

export function midrange(array) {
    return range(array) / 2;
}

export function sum(array) {
    let num = 0;
    const l = array.length;
    for (let i = 0; i < l; i++) {
        num += array[i];
    }
    return num;
}

export function mean(array) {
    return sum(array) / array.length;
}

export function median(array) {
    array.sort(function(a, b) {
        return a - b;
    });
    const mid = array.length / 2;
    return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
}

export function modes(array) {
    if (!array.length) {
        return [];
    }
    const modeMap = {};
    let maxCount = 0, modes = [];

    array.forEach(function(val) {
        if (!modeMap[val]) {
            modeMap[val] = 1;
        } else {
            modeMap[val]++;
        }
        if (modeMap[val] > maxCount) {
            modes = [val];
            maxCount = modeMap[val];
        } else if (modeMap[val] === maxCount) {
            modes.push(val);
            maxCount = modeMap[val];
        }
    });
    return modes;
}

export function rms(array) {
    return Math.sqrt(mean(array.map(function(num) {
        return Math.pow(num, 2);
    })));
}

export function variance(array) {
    const mean_val = mean(array);
    return mean(array.map(function(num) {
        return Math.pow(num - mean_val, 2);
    }));
}

export function standardDeviation(array) {
    return Math.sqrt(variance(array));
}

export function meanAbsoluteDeviation(array) {
    const mean_val = mean(array);
    return mean(array.map(function(num) {
        return Math.abs(num - mean_val);
    }));
}

export function zScores(array) {
    const mean_val = mean(array);
    const standardDeviation_val = standardDeviation(array);
    return array.map(function(num) {
        return (num - mean_val) / standardDeviation_val;
    });
}

// Function aliases:
export { mean as average };
