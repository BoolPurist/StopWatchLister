// @ts-check
import {Timer } from "./Timer.js";
import { stopWatchDom } from "./DomBlueprints.js";

class StopWatch {

    /**
     * 
     * @param {!string} whereToAppend - valid querySelector
     * @param {!string} querySelectorForTimeStamp - valid querySelector to find the dom element to 
     * apply current time regularally once started 
     * @param {...object} [DomSubReferences]
     */
    constructor(whereToAppend, querySelectorForTimeStamp , lableText , ...DomSubReferences) {
        this.domReference = stopWatchDom(); 
        this.lableText = lableText;       
        this._timerIsActive = false;
        this._timer = null;
        this._timeStampField = this.
        _GetDomSubReference(querySelectorForTimeStamp);
        
        this.countDown = false;
        this.setUpTimer(0, 0, 0);
                        
        for ( const dynamicProperty of DomSubReferences ) {
            this._CreateSubElementReference(dynamicProperty);
        }

        document.querySelector(whereToAppend).appendChild(this.domReference);
    }

    // Used to apply changes of internal timer to the stop watch dom element
    // so the user can see the new time
    static _callbackUpdateTimeStamp(event) {
        event.subscriber._timeStampField.textContent = event.invoker.TimeStamp;
    }

    get jsObjectState() {
        return {
            totalSeconds: this._timer.TotalSeconds,
            countingDown: this.countDown,
            lableText: this.lableText,
            startingSeconds: this._timer.totalSecondsStarting,
        };
    }

    /**
     * Stops the timers counting and resets it to
     * to a new starting time given by the parameters
     * 
     * @param {!number} [seconds=0] 
     * @param {!number} [minutes=0] 
     * @param {!number} [hours=0]
     * @returns {void}
     */
    setUpTimer(seconds, minutes, hours) {
        if (arguments.length === 1) {
            this._timer = new Timer(seconds);
        } else {
            this._timer = new Timer(seconds, minutes, hours);
        }
        
        this._timer.onTimeChange.addCallback(StopWatch._callbackUpdateTimeStamp, this);
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

    setResetTime(totalSeconds) {
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

export { StopWatch }