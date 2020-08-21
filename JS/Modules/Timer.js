// @ts-check

/** @module Timer */

/** 
 * Stores seconds, minutes and hours. Can be started and keeps counting until
 * it is stopped or reset. Can also execute attached callback functions whenever
 * it increments its seconds. 
*/
class Timer {
    /**
     * Takes the parameter parameters to determine the starting time.
     * 
     * @param {number} [seconds=0] - default: 0 (optional)
     * @param {number} [minutes=0] - default: 0 (optional)
     * @param {number} [hours=0] - default: 0 (optional)
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

            // Used to end interval code for incrementing seconds later
            this._intervalId = null;

            // Holds references of the callback functions attached from outside
            // via this.addFuncOnChange and the arguments for the callback functions. 
            this._funcs = [];
        }
                
    }

    // Getters

    /**
     * Rest of seconds after hours and minutes conversion
     * @member {number} 
     * @readonly    
     */
    get Seconds() {
        return this._seconds;
    }

    /**
     * Rest of minutes after hours conversion
     * 
     * @readonly
     * @member {number}   
     */
    get Minutes() {
        return this._minutes;
    }

    /**
     * whole number of total hours.
     * 
     * @readonly
     * @member {number}    
     */
    get Hours() {
        return this._hours;
    }

    /**
     * Get the time in total seconds
     * @readonly
     * @member {number}
     * @example timer with Seconds: 20, Minutes: 2, Hours: 1
     * would return 3740
     * (20 + 2*60 + 1*60*60)
     */
    get TotalSeconds() {
        
        return (
            this.Seconds + 
            (this.Minutes * 60) + 
            (this.Hours * 60 * 60)
        ); 
    }

    /**
     * Format for the time, Hours:Minutes:Seconds
     * @member {string} 
     * @readonly
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

    // Executes all callback functions stored in this._func
    _executeFuncs() {        
        for (const invocationEnv of this._funcs) {
            // possible arguments for a function call is provided
            // via invocationEnv.objAsArgue === this._funcs[i].objAsArgue             
            invocationEnv.func(invocationEnv.objAsArgue);
        }
    }

    // Intended exposed methods.

    /**
    * Starts counting the time every second.
    * 
    * @return {void}
    */
    start() {
        this._intervalId = setInterval(() => {
           this._incrementSeconds(); 
           this._executeFuncs();
        }, 1000);
    }
    
    /**
    * Stops the counting but keeps the accumulated time 
    * 
    * @return {void} 
    */
    stop() {

        if (this._intervalId !== null) {

            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }

    /**
    * Stops the counting and sets time to zero.
    * Result: Seconds: 0, Minutes: 0, Hours: 0 
    * 
    * @return {void} 
    */    
    reset() {
        this._seconds = 0;
        this._minutes = 0;
        this._hours = 0;
        this._executeFuncs();
        this.stop();
    }

    /**
     * Attaches a functions to the instance. this function is then
     * invocated whenever the time changes 
     * ( Every second when started until stopped )
     *  
     * @param {!Function} func - Function to be executed 
     * when the time of this instance changes 
     * @param {Array<any>} [objAsArgue] - collection of arguments to be given 
     * for a call of a function
     * @returns {void} 
     * @throws {TypeError} - if parameter func is not of type "function"
     * 
     * @example const function = (arrayOfArguments) => {
     *  const timer = arrayOfArguments[0];
     *  console.log(timer.TimeStamp);
     * }
     * 
     * let timer = new Timer();
     * timer.addFuncOnChange(function, timer);
     * timer.start();
     * // Every second the console will show something like 
     * // 0:0:0, 0:0:1, 0:0:2 ... etc
     */
    addFuncOnChange(func, ...objAsArgue) {
        if (func === null || typeof(func) !== "function") {
            throw new TypeError("func as callback function must be of type function");
        }

        this._funcs.push(
             {func: func, objAsArgue: objAsArgue} 
        );
    }

    /**
     * Removes an added callback function which is executed on timer changing  
     * If the function is not attached in the first place. Nothing happens
     * 
     * @param {Function} func - reference of added callback function that is 
     * to be executed on timer changing 
     * @returns {void} 
     */
    removeFuncOnChange(func) {

        const length = this._funcs.length;
        
        for (let i = 0; i < length; i++ ) {

            if (this._funcs[i].func === func) {

                this._funcs.splice(i, 1);

                return;
            }
        }
    }

    /**
     * Removes and stops all added callback functions which 
     * are executed on timer changing 
     * 
     * @returns {void}
     */
    clearFuncOnChange() {
        this._funcs = [];
    }

}

export {Timer};