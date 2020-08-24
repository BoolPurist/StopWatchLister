// @ts-check
import {Timer } from "./Timer.js";
import { stopWatchDom } from "./DomBlueprints.js";

class StopWatch {

    /**
     * 
     * @param {!string} whereToAppend - valid querySelector
     * @param {!string} querySelectorForTimeStamp - valid querySelector to find the dom element to 
     * apply current time regularally once started 
     * @param {object} [DomSubReferences]
     */
    constructor(whereToAppend, querySelectorForTimeStamp , ...DomSubReferences) {
        this.domReference = stopWatchDom().children[0];        
        this._timerIsActive = false;
        this._timer = null;
        this._timeStampField = this._GetDomSubReference(querySelectorForTimeStamp);
        
        this.countDown = false;
        this.setUpTimer(0, 0, 0);
                        
        for ( const dynamicProperty of DomSubReferences ) {
            this._CreateSubElementReference(dynamicProperty);
        }

        document.querySelector(whereToAppend).appendChild(this.domReference);
    }

    static _callbackUpdateTimeStamp(stopWatchRef) {
        stopWatchRef = stopWatchRef[0];
        
        stopWatchRef._timeStampField.textContent = StopWatch.
        _normalizeTimeUnitAtLeast2Digits(stopWatchRef._timer);
    }

    static _normalizeTimeUnitAtLeast2Digits(timer) {
        
        let seconds = timer.Seconds;
        let minutes = timer.Minutes;
        let hours = timer.Hours;
        let negative = false;

        if (timer.TotalSeconds < 0) {

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

        let normalizedTime = `${normalizedHours}:${normalizedMinutes}:${normalizedSeconds}`;

        return negative === false ? normalizedTime : `-${normalizedTime}`         
    }


    _GetTimer(seconds, minutes, hours) {
        if (this._timerIsActive === true ) {
            this.reset();
        }

        let timer = new Timer(seconds, minutes, hours);
        timer.addFuncOnChange(StopWatch._callbackUpdateTimeStamp, this);
        return timer;        
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
        this._timer = new Timer(seconds, minutes, hours);
        this._timer.addFuncOnChange(StopWatch._callbackUpdateTimeStamp, this);
        this._timeStampField.textContent = StopWatch.
        _normalizeTimeUnitAtLeast2Digits(this._timer); 
    }

    start() {
        if (this._timerIsActive === false) {            
            this._timer.start(this.countDown);
            this._timerIsActive = true;
            return true;
        } else return false;        
    }

    pause() {
        if (this._timerIsActive === true) {
            this._timer.stop();
            this._timerIsActive = false;
            return true;
        } else return false;
    }

    reset() {
        if (this._timerIsActive === true) {
            this._timerIsActive = false;
        }
        
        this._timer.reset();
    }

    remove() {
        this.pause();
        this.domReference.remove();
    }

    _GetDomSubReference (querySelector) {
        return this.domReference.querySelector(querySelector);
    }

    _CreateSubElementReference({ propertyName, domQuerySelector }) {
        Object.defineProperty(this, propertyName, {
            value: this.domReference.querySelector(domQuerySelector),
            writable: false
        });
        
    }
    
    // _PopulateDomElementWithTextContent (...Data) {
    //     Data.forEach(object => {
    //         const {querySelector, textContent} = object;
    //         this._GetDomSubReference(querySelector).textContent = textContent;
    //     })
    // }

}

export { StopWatch }