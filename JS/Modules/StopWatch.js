// @ts-check
import {Timer } from "./Timer.js";

class StopWatch {

    /**
     * @param {!string} lableText
     */
    constructor( lableText, startingSeconds = 0 ) {
        
        this.domReference = _stopWatchDom(); 

        this._labelText = lableText;
        this._GetDomSubReference(".stop-watch-label-text").textContent = lableText;
        
        
        this._timerIsActive = false;
        this._timeStampField = this._GetDomSubReference(".text-timer");

        this.countDown = false;

        this._timer = new Timer(startingSeconds);                 
        this._timer.onTimeChange.addCallback(StopWatch._callbackUpdateTimeStamp, this);
        this.setUpTimer(0);

        this.playBtn = this._GetDomSubReference(StopWatch._playBtnClassMatch);
        this.pauseBtn = this._GetDomSubReference(StopWatch._pauseBtnClassMatch);
        this.resetBtn = this._GetDomSubReference(StopWatch._resetBtnClassMatch);
        this.trashBtn = this._GetDomSubReference(StopWatch._trashBtnClassMatch);
        this.counterArrow = this._GetDomSubReference(StopWatch._countArrBtnClassMatch);
                                
    }

    

    static isAPlyBtn (className) {

        return className.includes(StopWatch._playBtnClassName);
    }

    static isAPauseBtn (className) {
        return className.includes(StopWatch._pauseBtnClassName);
    
    }
    static isATrashBtn (className) {
        return className.includes(StopWatch._trashBtnClassName);
    }

    static isAResetBtn (className) {
        return className.includes(StopWatch._resetBtnClassName);
    }
    
    // Used to apply changes of internal timer to the stop watch dom element
    // so the user can see the new time
    static _callbackUpdateTimeStamp(event) {
        event.subscriber._timeStampField.textContent = event.invoker.TimeStamp;
    }

    /**
     * Gets an literal object that represents the current state
     * of its internal timer
     * 
     * Is used to store it and later recreate a stop watch 
     * with the function CreateStopWatch in the index file  
     * @readonly
     * @type {!object} 
     */
    get jsObjectState() {
        return {
            totalSeconds: this._timer.TotalSeconds,
            countingDown: this.countDown,
            labelText: this._labelText,
            startingSeconds: this._timer.totalSecondsStarting,
        };
    }

    /**
     * 
     * @param {!object} jsObject
     * @returns {!StopWatch} 
     */
    static CreateFromJSObject( jsObject ) {

        // let checkIfThere = prop => typeof(prop) === "undefined";
        let recreatedStopWatch = new StopWatch(
            jsObject.labelText, 
            jsObject.totalSeconds,            
        );

        recreatedStopWatch._timer.totalSecondsStarting = jsObject.startingSeconds;

        recreatedStopWatch.countDown = jsObject.countDown;

        return recreatedStopWatch;        
    }

    /**
     * Is true if the internal timer is counting currently
     * 
     * @readonly
     * @type {!boolean}
     */
    get isTimerActive() {
        return this._timerIsActive;
    }

    /**
     * Stops the timers counting and resets it to
     * to a new starting time given by the parameters
     * 
     * @param {!number} [seconds=0] - (optional) New starting time
     * @returns {void}
     * @throws {TypeError} throws if parameter seconds is not of type number
     */
    setUpTimer(seconds) {
        _throwForInvalidTimeUnit(seconds);                
        this._timeStampField.textContent = this._timer.TimeStamp; 
    }

    /**
     * Starts the internal timer if timer has not started yet.
     * 
     * @returns {!boolean} - Returns true if the internal timer was started
     * by this call. 
     * Returns false if the timer was already started before this call
     */
    start() {
        if (this._timerIsActive === false) {            
            this._timer.start(this.countDown);
            this._timerIsActive = true;
            return true;
        } else return false;        
    }

    /**
     * Pauses the internal timer if the timer is not already paused.
     * 
     * @returns {!boolean} - Returns true if internal timer was paused 
     * by this call.
     * Returns false if the internal timer was already paused before this call
     */
    pause() {
        if (this._timerIsActive === true) {
            this._timer.stop();
            this._timerIsActive = false;
            return true;
        } else return false;
    }

    /**
     * Stops the internal timer and sets its value back the starting time
     * 
     * @returns {void}
     */
    reset() {
        if (this._timerIsActive === true) {
            this._timerIsActive = false;
        }
        
        this._timer.reset();
    }

    /**
     * Stops the internal timer and then removes the 
     * stop watch dom element from the dom
     * 
     * @returns {void}
     */
    remove() {
        this.pause();
        this.domReference.remove();
    }
    /**
     * Sets the starting time of the internal timer of the stop watch.
     * 
     * @throws {TypeError} throws if parameter seconds is not of type number
     */
    setResetTime(totalSeconds) {
        _throwForInvalidTimeUnit(totalSeconds);
        this._timer.totalSecondsStarting = totalSeconds;
    }

    _GetDomSubReference (querySelector) {
        return this.domReference.querySelector(querySelector);
    }

    // Used to create properties with dom references as values 
    // on the instance at runtime
    _CreateSubElementReference({ propertyName, domQuerySelector }) {
        Object.defineProperty(this, propertyName, {
            value: this._GetDomSubReference(domQuerySelector),
            writable: false
        });
        
    }

}

StopWatch._playBtnClassMatch = ".play-btn";
StopWatch._playBtnClassName = StopWatch._playBtnClassMatch.substring(1);

StopWatch._pauseBtnClassMatch = ".pause-btn";
StopWatch._pauseBtnClassName = StopWatch._pauseBtnClassMatch.substring(1);

StopWatch._resetBtnClassMatch = ".reset-btn";
StopWatch._resetBtnClassName = StopWatch._resetBtnClassMatch.substring(1);

StopWatch._trashBtnClassMatch = ".trash-btn";
StopWatch._trashBtnClassName = StopWatch._trashBtnClassMatch.substring(1);

StopWatch._countArrBtnClassMatch = ".counter-arrow";
StopWatch._countArrBtnClassName = StopWatch._countArrBtnClassMatch.substring(1);

// Used to validate the time units as valid numbers
function _throwForInvalidTimeUnit(timeUnit) {
    if (timeUnit === null || typeof timeUnit !== "number") {
        throw new TypeError("Time unit must be of type 'number' ");
    }
}

/**
 * Creates a box which serves as a stop watch. It has a title, 
 * time stamp lable for showing time and widgets as buttons the 
 * for user to control it. 
 * 
 * @returns {!object} - dom elements representing a stop watch
 */
function _stopWatchDom()  {
    const container = document.createElement("div");

    container.innerHTML = 
`
<div class="stop-watch">
    <div class="stop-watch-row-label">
        <p class="stop-watch-label-text"></p>
        <i class="btn trash-btn fas fa-trash-alt"></i>
    </div>
    <div class="stop-watch-row-timer">
        <i class="btn play-btn fas fa-play"></i>
        <i class="btn pause-btn fas fa-pause"></i>
        <i class="btn reset-btn fas fa-stop"></i> 
        <i class="fas counter-arrow"></i>       
        <p class="text-timer">23:54:02</p>
    </div>
</div>
`;

    return container.children[0];
}

export { StopWatch }