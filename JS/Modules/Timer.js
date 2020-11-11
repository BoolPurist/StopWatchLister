// @ts-check
import { DelegateHolder } from "./DelegateHolder.js";
/** @module Timer */

/** 
 * Stores seconds, minutes and hours. Can be started and keeps counting until
 * it is stopped or reset. Can also execute attached callback functions whenever
 * it increments its seconds. 
*/
class Timer {
    /**
     * Takes the parameters to determine the starting time.
     * Tip: You can just give seconds for the total amount of seconds 
     * It is also fine to give minutes over 60.
     * 
     * @param {number} [seconds=0] - default: 0 (optional)
     * @param {number} [minutes=0] - default: 0 (optional)
     * @param {number} [hours=0] - default: 0 (optional)
     * @throws {TypeError} if 1 param is null or not of the type number 
     */
    constructor(seconds = 0, minutes = 0, hours = 0) {

        const wantedType = "number";

        if ( seconds === null || minutes === null || hours === null ) {

            throw new TypeError(`
            Constructor does not take a parameter which is null.
            `);
        } else if (

            typeof(seconds) !== wantedType || typeof(minutes) !== wantedType || 
            typeof(hours) !== wantedType
            )  {

            throw new TypeError(
                `Constructor does only take parameters of the type 
                "${wantedType}"`
            );
        } else {
            
            this._totalSeconds = seconds + (minutes * 60) + (hours * 3600);
            
            // Used to end interval code for incrementing seconds later
            this._intervalId = null;

            // Holds references of the callback functions attached from outside
            // via this.addFuncOnChange and the arguments 
            // for the callback functions. 
            this._funcs = [];
        }

        this.onTimeChange = new DelegateHolder();
        this._countDown = false;
        this._totalSecondsStarting = this._totalSeconds; 
    }

    // Getters

    /**
     * Rest of seconds after hours and minutes conversion
     * @member {number} 
     * @readonly    
     */
    get Seconds() {
        return this._totalSeconds % 60;
    }

    /**
     * Rest of minutes after hours conversion
     * 
     * @readonly
     * @member {number}   
     */
    get Minutes() {
        let minutes = this._totalSeconds / 60;
        
        minutes = this._totalSeconds >= 0 
        ? Math.floor(minutes) : Math.ceil(minutes);        
        
        minutes%=60
        return minutes === -0 ? 0 : minutes; 
    }

    /**
     * whole number of total hours.
     * 
     * @readonly
     * @member {number}    
     */
    get Hours() {
        let hours = this._totalSeconds / 3600;
        hours = this._totalSeconds >= 0 ? Math.floor(hours) : Math.ceil(hours);        
        return hours === -0 ? 0 : hours;
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
        return this._totalSeconds;         
    }

    /**
     * Format for the time, Hours:Minutes:Seconds
     * if the time is negative 1 minus will be prepended 
     * to the time stamp 
     * @member {string} 
     * @readonly
     * 
     * @example  
     * 20:45:02 for Seconds: 02, Minutes: 45, Hours: 20
     * -0:10:20 for Seconds: -20, Minutes: -10, Hours: 0
     */
    get TimeStamp() {

        let seconds = this.Seconds;
        let minutes = this.Minutes;
        let hours = this.Hours;
        let negative = false;

        if (this.TotalSeconds < 0) {

            seconds *= -1;
            minutes *= -1;
            hours *= -1;
            negative = true;
        }

        let normalizedSeconds = seconds >= 10 ? 
        seconds.toString() : `0${seconds.toString()}`

        let normalizedMinutes = minutes >= 10 ? 
        minutes.toString() : `0${minutes.toString()}`

        let normalizedHours = hours >= 10 ? 
        hours.toString() : `0${hours.toString()}`;

        let normalizedTime = 
        `
        ${normalizedHours}:${normalizedMinutes}:${normalizedSeconds}
        `;

        return negative === false ? normalizedTime : `-${normalizedTime}`;
    }

    // Routines

    _incrementSeconds () {
        if (this._countDown === false) this._totalSeconds++;
        else this._totalSeconds--;
    }

    // Intended exposed methods.

    /**
    * Starts/Resume counting the time up or down every second.
    * @param {?boolean} [countDown=null] - if true the timer 
    * counts up every second if false the timer counts down every second
    * if null the counting direction will be the same before the time was stopped
    * if the timer was not stopped yet then the timer counts up by default 
    * @return {void}
    */
    start(countDown=null) {
        this._countDown = countDown !==null ? countDown : this._countDown;
        
        this._intervalId = setInterval(() => {
            this._incrementSeconds(); 
            this.onTimeChange._executeCallbacks(this);
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
    * Stops the counting and sets time of the timer
    * to the state it was when created
    * 
    * @return {void}
    * @example const timer = new Timer(23);
    * timer.start();
    * // After 5 Second
    * timer: Seconds: 28, Minutes: 0, Hours: 0
    * timer.reset();
    * timer: Seconds: 23, Minutes: 0, Hours: 0 
    */    
    reset() {
        this._totalSeconds = this._totalSecondsStarting;
        this._countDown = false;
        this.onTimeChange._executeCallbacks(this);
        this.stop();
    }

    /**
     * Gets the current starting time at which 
     * the timer starts counting from if started.
     * 
     * @type {!number} 
     */
    get totalSecondsStarting() {
        return this._totalSecondsStarting;
    }

    /**
     * Set up a new time so in case the timer gets restarted,
     * timer starts counting at this new time
     * 
     * @param {!number} totalSeconds - new time at which the
     * timers starts counting after a reset
    */    
    set totalSecondsStarting(totalSeconds) {
        
        if ( totalSeconds === null || typeof totalSeconds !== "number" ) {
            throw new TypeError("New starting time must be of type number");
        }

        this._totalSecondsStarting = totalSeconds;
    }

}

export { Timer };