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
        this._timeStampField.textContent = this._timer.TimeStamp;
        this._timer.addFuncOnChange(StopWatch._callbackUpdateTimeStamp, this);
        this._timerIsActive = false;
        
        for ( const dynamicProperty of DomSubReferences ) {
            this._CreateSubElementReference(dynamicProperty);
        }

        // this._attachAllDefaultEvents();

        document.querySelector(whereToAppend).appendChild(this.domReference);
    }


    static _callbackUpdateTimeStamp(stopWatchRef) {
        stopWatchRef = stopWatchRef[0];
        stopWatchRef._timeStampField.textContent = stopWatchRef._timer.TimeStamp;
    }

    start() {
        if (this._timerIsActive === false) {
            this._timer.start();
            this._timerIsActive = true;
        }
    }

    pause() {
        if (this._timerIsActive === true) {
            this._timer.stop();
            this._timerIsActive = false;
        }
    }

    remove() {
        this._timer.stop();
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
    
    _PopulateDomElementWithTextContent (...Data) {
        Data.forEach(object => {
            const {querySelector, textContent} = object;
            this._GetDomSubReference(querySelector).textContent = textContent;
        })
    }

    _attachAllDefaultEvents () {
        for (const defaultEventHandler of StopWatch.prototype._defaultEventHandler) {
            
            const domElementReference = this.domReference.querySelector(
                defaultEventHandler.domElementReference
            );

            const eventType = defaultEventHandler.eventType; 
            const callbackFunction  = defaultEventHandler.callbackFunction ; 

            domElementReference.addEventListener(eventType, callbackFunction, false);
        }
    }

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