// @ts-check

import { Timer } from "./Timer.js";

class StopWatch {

    /**
     * 
     * 
     * @param {!string} lableText - Title in the upper left corner 
     * for describing the stop watch
     * @param {?number} [startingSeconds=null] - time at which the stop watch reverts back to
     * if being reset
     * @param {!number} [currentSeconds=0] - time at which the stop watches starts from for
     * first time of starting it
     */
    constructor( lableText, startingSeconds = 0, currentSeconds = null) {
        
        this._currentState = StopWatch.States.reset;
        // Creating the html model for the stop watch
        this.domReference = stopWatchDom(); 

        // Stores text for possible conversion to a plain js object
        this._labelText = lableText;
        this._GetDomSubReference("stop-watch-label-text").textContent = lableText;
            
        // Reference to the paragraph for presenting the current time on the stop watch
        this._timeStampField = this._GetDomSubReference("text-timer");
        
        this.countingDown = false;

        // Inner timer for counting time.
        this._timer = new Timer(startingSeconds);      
        this._timer.setUpCurrentTime( currentSeconds ?? startingSeconds );
        this._timeStampField.textContent = this._timer.TimeStamp;
        
        this._timer.onTimeChange.addCallback(this._callbackUpdateTimeStamp, this);        

        // Public references to relevant sub html elements
        this.playBtn = this._GetDomSubReference(playBtnClassName);
        this.pauseBtn = this._GetDomSubReference(pauseBtnClassName);
        this.resetBtn = this._GetDomSubReference(resetBtnClassName);
        this.trashBtn = this._GetDomSubReference(trashBtnClassName);
        this.saveBtn = this._GetDomSubReference(saveBtnName);
        this.counterArrow = this._GetDomSubReference(countArrBtnClassName);
        this.timeCheckPoints = this._GetDomSubReference(timeCheckPointsName);

    }

    /**
     * 
     * @readonly
     * @type {!number} - Represents the current state of a stop watch
     */
    get CurrentState() {
        return this._currentState;
    }

    /**
     * Is true if timer was not started since a reset or the creation.
     * 
     * @readonly 
     * @type {!boolean}
     */
    get isAtStart() {
        return this._timer._totalSecondsStarting === this._timer.TotalSeconds;
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
            countingDown: this.countingDown,
            labelText: this._labelText,
            startingSeconds: this._timer.totalSecondsStarting,
            currentState: this._currentState,
            timeCheckPoints: this.timeCheckPoints.innerHTML            
        };
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
        this._currentState = StopWatch.States.reset;                
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
        if (this._currentState !== StopWatch.States.counting) {            
            this._timer.start(this.countingDown);
            this._currentState =  StopWatch.States.counting;
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
        if (
            this._currentState !== StopWatch.States.reset &&
            this._currentState !== StopWatch.States.paused 
            ) {
            this._timer.stop();
            this._currentState = StopWatch.States.paused;
            return true;
        } else return false;
    }

    /**
     * Stops the internal timer and sets its value back the starting time
     * 
     * @returns {void}
     */
    reset() {
        this._currentState = StopWatch.States.reset;
        
        // Removes all time check points from a stop watch
        while (this.timeCheckPoints.firstChild !== null) {
            this.timeCheckPoints.removeChild(this.timeCheckPoints.firstChild);
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
        this._timer.stop();
        this.domReference.remove();     
    }

    /**
     * Creates a separate time stamp from the current one and places into the stop watch
     * These time stamps will remain until a reset.
     */
    setCheckPoint() {
        const li = document.createElement('li');
        li.innerText = `${this._timer.TimeStamp}`;

        if (this._timer.TotalSeconds < 0) {
            li.classList.add(toggleClassNumberNeg);
        } else {
            li.classList.add(toggleClassNumberPos);
        }

        this.timeCheckPoints.appendChild(li);
    }

    /**
     * Can create an instance of stop watch from a correct plain js object.
     * The getter jsObject of an instance returns such a plain js object. 
     * 
     * @param {!object} jsObject
     * @returns {!StopWatch} Instance of a stop watch with the state before it was
     * saved as a plain js object.
     */
    static CreateFromJSObject( jsObject ) {

        // let checkIfThere = prop => typeof(prop) === "undefined";
        let recreatedStopWatch = new StopWatch(
            jsObject.labelText, 
            jsObject.startingSeconds,
            jsObject.totalSeconds           
        );

        recreatedStopWatch.countingDown = jsObject.countingDown;

        recreatedStopWatch.timeCheckPoints.innerHTML = jsObject.timeCheckPoints;

        return recreatedStopWatch;        
    }

    /**
     * Checks if an html element is a play button of a stop watch dom object
     * 
     * @param {?HTMLElement} htmlElement - full css class string to check of the html element
     * for checking. 
     * @returns {!boolean} Returns true if html element is part of the dom presentation 
     * of a stop watch otherwise it returns false
     */
    static isAPlyBtn (htmlElement) {
        return checkHTMLElementByClassName(
            htmlElement, 
            playBtnClassName
        );
    }

    /**
     * Checks if an html element is a pause button of a stop watch dom object
     * 
     * @param {?HTMLElement} htmlElement - full css class string to check of the html element
     * for checking. 
     * @returns {!boolean} Returns true if html element is part of the dom presentation 
     * of a stop watch otherwise it returns false
     */
    static isAPauseBtn (htmlElement) {
        return checkHTMLElementByClassName(
            htmlElement, 
            pauseBtnClassName
        );   
    }

    /**
     * Checks if an html element is a trash button of a stop watch dom object
     * 
     * @param {?HTMLElement} htmlElement - full css class string to check of the html element
     * for checking. 
     * @returns {!boolean} Returns true if html element is part of the dom presentation 
     * of a stop watch otherwise it returns false
     */
    static isATrashBtn (htmlElement) {
        return checkHTMLElementByClassName(
            htmlElement, 
            trashBtnClassName
        );
    }

    /**
     * Checks if an html element is a reset button of a stop watch dom object
     * 
     * @param {?HTMLElement} htmlElement - full css class string to check of the html element
     * for checking. 
     * @returns {!boolean} Returns true if the html element is button of a stop watch 
     */
    static isAResetBtn (htmlElement) {
        return checkHTMLElementByClassName(
            htmlElement, 
            resetBtnClassName
        );
    }

    /**
     * Checks if an html element is a save button of a stop watch dom object
     * 
     * @param {?HTMLElement} htmlElement - full css class string to check of the html element
     * for checking. 
     * @returns {!boolean} Returns true if the html element is button of a stop watch
     */
    static isASaveBtn(htmlElement) {
        return checkHTMLElementByClassName(
            htmlElement, 
            saveBtnName
        );
    }


    /**
     * Used to apply changes of internal timer to the stop watch html element
     * so the user can see the new time. It also applies a color to the font
     * of the time stamp depending on the time being under zero.
     * @callback
     */
    _callbackUpdateTimeStamp(event) {

        const stopWatch = event.subscriber; 
        const timeStampField = stopWatch._timeStampField;

        timeStampField.textContent = event.invoker.TimeStamp;
        
        if (stopWatch._timer.TotalSeconds < 0 ) {
            if (timeStampField.classList.contains(toggleClassNumberNeg) !== true) {
                timeStampField.classList.remove(toggleClassNumberPos);
                timeStampField.classList.add(toggleClassNumberNeg);
            }            
        } else {
            if (timeStampField.classList.contains(toggleClassNumberPos) !== true) {
                timeStampField.classList.remove(toggleClassNumberNeg);
                timeStampField.classList.add(toggleClassNumberPos);
            }
        }
        
    }

    // Gets respective sub html element of the html model of the stop watch.
    // querySelector - query string used for finding a html element  
    _GetDomSubReference (className) {
        return this.domReference.getElementsByClassName(className)[0];
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

/**
 * Is a readonly object as enumerator for the current state of a stop watch
 * The current state can be accessed by the Getter "CurrentState"
 * 
 * @enum {!number} - Possible states are reset, counting and paused.
 */
StopWatch.States = Object.freeze({
    reset: 0,
    counting: 1,
    paused: 2
});

const toggleClassNumberPos = "positive";
const toggleClassNumberNeg = "negative";

// Classnames used to get references to sub html elements
const playBtnClassName = "play-btn";
const pauseBtnClassName = "pause-btn";
const resetBtnClassName = "reset-btn";
const trashBtnClassName = "trash-btn";
const saveBtnName = "save-btn";
const countArrBtnClassName = "counter-arrow";
const timeCheckPointsName = "time-check-points" ;


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
function stopWatchDom()  {
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
        <i class="btn save-btn fas fa-save"></i>     
        <p class="text-timer">23:54:02</p>
    </div>
    <ul class="time-check-points">
        
    </ul>
</div>
`;

    return container.children[0];
}



/**
 * 
 * @param {?HTMLElement} htmlElement
 * @param {!string} classNameId
 * @returns {!boolean} 
 */
function checkHTMLElementByClassName(htmlElement, classNameId) {
    if (htmlElement === null) return false;
    const className = htmlElement.className;
    return className.includes(classNameId);    
}



export { StopWatch }