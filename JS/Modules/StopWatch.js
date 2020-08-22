// @ts-check
import {Timer } from "./Timer.js";

class StopWatch {

    /**
     * 
     * @param {!string} whereToAppend - valid querySelector
     * @param {!string} querySelectorForTimeStamp - valid querySelector to find the dom element to 
     * apply current time regularally once started 
     * @param {object} [DomSubReferences]
     */
    constructor(whereToAppend, querySelectorForTimeStamp , ...DomSubReferences) {
        
        this.domReference = GetContainerForStopWatch().children[0];        
        this._timer = new Timer();
        this._timeStampField = this._GetDomSubReference(querySelectorForTimeStamp);
        this._timerIsActive = false;
        
        this._timeStampField.textContent = StopWatch.
        _normalizeTimeUnitAtLeast2Digits(this._timer);
        this._timer.addFuncOnChange(StopWatch._callbackUpdateTimeStamp, this);
                
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
        let normalizedSeconds = timer.Seconds >= 10 ? 
        timer.Seconds.toString() : `0${timer.Seconds.toString()}`

        let normalizedMinutes = timer.Minutes >= 10 ? 
        timer.Minutes.toString() : `0${timer.Minutes.toString()}`

        let normalizedHours = timer.Hours >= 10 ? 
        timer.Hours.toString() : `0${timer.Hours.toString()}`;

        return `${normalizedHours}:${normalizedMinutes}:${normalizedSeconds}`;        
    }

    start() {
        if (this._timerIsActive === false) {
            this._timer.start();
            this._timerIsActive = true;
            return true
        } else return false;        
    }

    pause() {
        if (this._timerIsActive === true) {
            this._timer.stop();
            this._timerIsActive = false;
            return true;
        } else return false;
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

StopWatch.prototype._defaultEventHandler = [];

function GetContainerForStopWatch()  {
    const container = document.createElement("div");

    container.innerHTML = `
<div class="stop-watch">
    <div class="stop-watch-row-label">
        <p class="stop-watch-label-text"></p>
        <i class="btn trash-btn fas fa-trash-alt"></i>
    </div>
    <div class="stop-watch-row-timer">
        <i class="btn play-btn fas fa-play"></i>
        <i class="btn pause-btn fas fa-pause"></i>
        <i class="btn reset-btn fas fa-stop"></i>        
        <p class="text-timer">23:54:02</p>
    </div>
</div>
`;

    return container;
}

// <!-- html structure for StopWatch -->
// <div class="stop-watch">
//     <div class="stop-watch-row-label">
//         <p class="stop-watch-label-text">1. Stop-Watch</p>
//         <i class="trash-btn fas fa-trash-alt"></i>
//     </div>
//     <div class="stop-watch-row-timer">
//         <i class="play-btn fas fa-play"></i>
//         <p class="text-timer">23:54:02</p>
//     </div>
// </div>

export { StopWatch }