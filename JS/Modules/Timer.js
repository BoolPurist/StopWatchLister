/** @module Timer */

/** 
 * Stores seconds, minutes and hours. Can be started and keeps counting until
 * it is stopped or rested. 
*/
class Timer {
    /**
     * Takes the time to start from in form of the parameters.
     * 
     * @param {number} seconds default: 0
     * @param {number} minutes default: 0
     * @param {number} hours default: 0
     * 
     * @throws {TypeError} if 1 param is null or not of the type number 
     * @throws {RangeError} if 1 param is negative 
     */
    constructor(seconds = 0, minutes = 0, hours = 0) {

        const wantedType = "number";

        if ( seconds === null || minutes === null || hours === null ) {
            throw new TypeError('Constructor does not take a parameter which is null.');
        } else if (
            typeof(seconds) !== wantedType || typeof(minutes) !== wantedType || 
            typeof(hours) !== wantedType
            )  {
            throw new TypeError(
                `Constructor does only take parameters of the type \"${wantedType}\"`
            );
        } else if (seconds < 0 || minutes < 0 || hours < 0) {
            throw new RangeError("Constructor does not take negative numeric parameters");
        }   else {
            this._seconds = seconds;
            this._minutes = minutes;
            this._hours = hours;
            this._intervalId = null;
        }
                
    }

    // Getters

    /**
     * @readonly
     * @returns {number} Rest of seconds after hours and minutes conversion   
     */
    get Seconds() {
        return this._seconds;
    }

    /**
     * @readonly
     * @returns {number} Rest of minutes after hours conversion   
     */
    get Minutes() {
        return this._minutes;
    }

    /**
     * @readonly
     * @returns {number} whole number of total hours.   
     */
    get Hours() {
        return this._hours;
    }

    /**
     * @readonly
     * 
     * @returns {string} Format for the time, Hours:Minutes:Seconds
     * @example  
     * // 20:45:02 for Seconds: 02, Minutes: 45, Hours: 20  
     */
    get TimeStamp() {
        return `${this._hours}:${this._minutes}:${this._seconds}`;
    }

    // Routines

    _incrementSeconds () {
        this._seconds++;
        this._seconds %= 60;
        
        if (this._seconds === 0) this._incrementMinutes();         
    }

    _incrementMinutes () {
        this._minutes++;
        this._minutes %= 60;

        if (this._minutes === 0) this._hours++;;
    }

    // Intended exposed methods.

    /**
    * Starts counting the time every second.
    * 
    * @return {undefined} undefined 
    */
    startTimer() {
        this._intervalId = setInterval(() => {
           this._incrementSeconds(); 
        }, 1000);
    }
    
    /**
    * Stops the counting but keeps the accumulated time 
    * 
    * @return {undefined} undefined 
    */
    stopTimer() {
        if (this._intervalId !== null) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }

    /**
    * Stops the counting and sets time to zero.
    * Result: Seconds: 0, Minutes: 0, Hours: 0 
    * 
    * @return {undefined} undefined 
    */    
    resetTimer() {
        this._seconds = 0;
        this._minutes = 0;
        this._hours = 0;

        this.stopTimer();
    }

}

export {Timer};