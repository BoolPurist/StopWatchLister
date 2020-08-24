
// @ts-check

/**
 * Converts text time unites into seconds as one number value
 * Can also convert comma numbers. 
 * It only contains digits with 2 exceptions
 * 1. Valid time unit has one comma or point at most. Such sign must not be
 * at the start or end of the time unit.
 * 2. Has one plus or minus at most. Such sign must be at the start of the unit. 
 *  
 * @param {!string} seconds - supposed seconds as a string 
 * @param {!string} minutes - supposed minutes as a string
 * @param {!string} hours - supposed hours as a string
 * @returns {?number} Returns total seconds from seconds, minutes and 
 * hours or null if one the parameter can not be converted into a valid 
 * number value.  
 */
export function textTimeUnitsToSeconds(seconds, minutes, hours) {

    const secondsNumber = parseStringToTimeUnit(seconds);
    const minutesNumber = parseStringToTimeUnit(minutes);
    const hoursNumber = parseStringToTimeUnit(hours);

    if (
        secondsNumber === null || 
        minutesNumber === null || 
        hoursNumber === null
    ) {
        return null;
    }

    return (
        Math.round(secondsNumber) + 
        minutesToSecondsRounded(minutesNumber) + 
        hoursToSecondsRounded(hoursNumber)
        );
}

/**
 * Converts a string into a number value. Can also convert
 * strings as comma numbers. 
 * 
 * @param  {!string} userInput
 * @returns {?number} - Either a number value from userInput string
 * or null if the userInput was invalid for a number value  
 */
export function parseStringToTimeUnit(userInput) {
    userInput = userInput.includes(",") ? 
    userInput.replace(",", ".") : userInput;
    let possibleNumber = Number(userInput);
    return Number.isNaN(possibleNumber) === false ? possibleNumber : null;
}

/**
 * 
 * @param {!number} minutes - minutes to be converted
 * @returns {!number} total seconds of the given minutes   
 */
export function minutesToSecondsRounded(minutes) {
    return Math.round(minutes * 60);
}

/**
 * 
 * @param {!number} hours - hours to be converted
 * @returns {!number} total seconds of the given hours   
 */
export function hoursToSecondsRounded(hours) {
    return Math.round(hours * 3600);
}