// @ts-check
import { textTimeUnitsToSeconds } from "./ConverterFunctions.js";
import * as htmlManipulation from "./Html_Manipulation.js";
import { QS, TOGGLE_CLASSES, STORAGE_KEYS } from "./Constants.js";

import { StopWatch } from "./Modules/StopWatch.js";

window.addEventListener("DOMContentLoaded", () => {
"use strict";

// SW = stopwatch
// QS = querySelector
/**
 * The box which holds all widgets for the user to spawn stop watches 
 * and configure how spawned stop watches will behave 
 *  
 * @const
 * @type {HTMLElement}
 */
const spawnBoxStopWatch = document.querySelector(QS.SPAWN_BOX);
/**
 * List for holding all spawned stop watches on the page
 * 
 * @const
 * @type {HTMLElement}
 */
const containerForStopWatches = document.querySelector(QS.LIST_SW);
/**
 * Resides in the spawn box
 * Text input field in which the user can enter a name for the 
 * next stop watch to be spawned
 * 
 * @const
 * @type {HTMLInputElement}
 */ 
const inputFieldLableStopWatch = document
.querySelector(QS.INPUT_LABLE_FIELD);
/**
 * Resides in the spawn box
 * On clicking it, it spawns a stop watch and appends as child
 * into containerForStopWatches
 * 
 * @const
 * @type {HTMLElement}
 */
const spawnBtn = document.querySelector(QS.SPAWN_BTN);
/**
 * Resides in the spawn box
 * On clicking it, it removes all spawned stop watches
 * 
 * @const
 * @type {HTMLElement}
 */
const trashAllBtn = document.querySelector(QS.TRASH_ALL_BTN);
/**
 * On clicking it in the spawn box, it toggles the counting direction 
 * of up or down of the next stop watch to be spawned
 * 
 * @const
 * @type {HTMLElement}
 */
const countDirectionBtn = document.querySelector(QS.COUNT_DIRECTION_BTN);
/**
 * Resides in the spawn box
 * Input field where the user provides the seconds for the starting time 
 * of the next stopwatch
 * 
 * @const
 * @type {HTMLInputElement}
 */
const startSecondsInput = document.querySelector(QS.INPUT_SECONDS);        
/**
 * Resides in the spawn box
 * Input field where the user provides the minutes for the starting time 
 * of the next stopwatch
 * 
 * @const
 * @type {HTMLInputElement}
 */
const startMinutesInput = document.querySelector(QS.INPUT_MINUTES);
/**
 * Resides in the spawn box
 * Input field where the user provides the hours for the starting time 
 * of the next stopwatch
 * 
 * @const
 * @type {HTMLInputElement}
 */
const startHoursInput = document.querySelector(QS.INPUT_HOURS);
/**
 * If user provides invalid input for the starting time this dom
 * element appears always under the spawn box. if the next input 
 * for starting time is valid it disappears.
 * 
 * @const
 * @type {HTMLElement}
 */
const errorBarInDom = document.querySelector(QS.ERROR_BAR_STARTIME);
/**
 * Resides in the spawn box
 * Indicates if the stop watch will count up or down. It is indicates 
 * the direction with its color and pointing up or down
 * 
 * @const  
 * @type {HTMLElement}
 */
const counterArrowSpawn = document.querySelector(QS.COUNTER_ARROW_SPAWN);
/**
 * Is placed below the spawn box or the error bar to show
 * separation between spawn box and actual stop watches
 * 
 * @const
 * @type {HTMLElement}
 */
const separationBar = document.querySelector(QS.SEPARATION_BAR);

const countDirectionInformation = new Map();
// The 2 possible texts and title pop ups 
// the button for counting direction can show
countDirectionInformation.set(false, 
    {
        btnText: "Count Down ?",
        titleText:         
        "Next stop watch will count up, Click to let next stop watch count down"                                
    }
);
countDirectionInformation.set(true,
    {
        btnText: "Count Up ?",
        titleText:
        "Next stop watch will count down, Click to let next stop watch count up"
    }
);

const countArrowInformation = new Map();
// 2 possible title pop ups an arrow for showing the counting direction
// can have
countArrowInformation.set(false, "Stop watch will count up");
countArrowInformation.set(true, "Stop watch will count down");        

/**
 * List of stopwatches which are currently active. An active stop watch in placed in 
 * the dom of the page so the can interact with it.
 * 
 * @type {Array<StopWatch>}
 */
let stopWatchList = [];

// Set up functions via closure
const manageErrorBar = htmlManipulation.manageErrorBar.bind( null, errorBarInDom);

const toggleVisibility = htmlManipulation.toggleVisibility;
const toggleCountDirectionBtn = htmlManipulation.toggleCountDirectionBtn.bind(
    null, countDirectionBtn, countDirectionInformation
);
const toggleCounterSpawnerArrow = htmlManipulation.toggleCounterSpawnerArrow.bind(
    null, countArrowInformation
);

const actionBtnReset = htmlManipulation.actionBtnReset;
const actionBtnPause = htmlManipulation.actionBtnPause;
const actionBtnPlay = htmlManipulation.actionBtnPlay;

const actionBtnDelete = htmlManipulation.actionBtnDelete.bind(
    null, stopWatchList, separationBar            
);
const actionBtnDeleteAll = htmlManipulation.actionBtnDeleteAll.bind(
    null, separationBar, stopWatchList
);
    
/* Attaching events */
// Attaching events for the spawn watch box    
// Adding event for spawn manage button            
spawnBoxStopWatch.addEventListener("click", callbackClickSpawnBox);

containerForStopWatches.addEventListener("click", callBackStopWatchContainer);

// For the user to interact with keyboard on the page
document.addEventListener("keyup", callbackPress);

// Reading the session storage for restoring state before page reload

/**
 * If true the next stop watch to spawn will count down
 * If false it will count up
 * 
 * The value is toggled whenever the user clicks on the button 
 * accessible via variable countDirectionBtn 
 * 
 * @type {boolean | undefined} 
 */
let countDownGlobal = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.GLOBAL_COUNT_DIRECTION));
countDownGlobal = countDownGlobal ?? false;

// Setting the direction button up with its inner text and and its tooltip title
toggleCountDirectionBtn(countDownGlobal);
// Setting up the arrow for showing the counting direction for the nex stop watch
toggleCounterSpawnerArrow(countDownGlobal, counterArrowSpawn);

// Recreating stored stop watches from session storage after page reload
const stopWatchesState = sessionStorage.getItem(STORAGE_KEYS.STOP_WATCHES);

// Checks if stop watches were present before the page reload
if (stopWatchesState !== null && stopWatchesState !== "") {
    const stopWatchesObjList = JSON.parse(stopWatchesState); 
    
    stopWatchesObjList.forEach( uncreatedStopWatch => {                
        const createdStopWatch =  StopWatch.CreateFromJSObject(uncreatedStopWatch);

        integrateStopWatch(createdStopWatch);
        const lastState = uncreatedStopWatch.currentState;

        // Perform the respective actions to toggle the button visibility and
        // brings the created stop watch to the right state for example starts a stop watch
        if ( lastState === StopWatch.States.counting ) {
            actionBtnPlay(createdStopWatch);                    
        } else if ( lastState === StopWatch.States.paused ) {
            actionBtnPause(createdStopWatch, true);
        } else {
            actionBtnReset(createdStopWatch);
        }                 

    });
}

// Saving the states of stop watches for recreating stop watches after page reload
const intervall = setInterval( () => {
    
    if (stopWatchList.length === 0) {
        sessionStorage.setItem(STORAGE_KEYS.STOP_WATCHES, "");
    } else {            
        let listOfSavedStopWatches = [];
        for (const unsavedStopWatch of stopWatchList) {
            listOfSavedStopWatches.push(unsavedStopWatch.jsObjectState);
        } 
        
        sessionStorage.setItem(
            STORAGE_KEYS.STOP_WATCHES, 
            JSON.stringify(listOfSavedStopWatches)
        );
    }         
},1000);

// Debug Area
if (containerForStopWatches.querySelector(".stop-watch") === null) {
    CreateStopWatch();
}

/* Functions */

/**
 * Execution for all events related to the spawn box for stop watches
 * 
 * When clicked on spawn button, a stop watch is spawned
 * When clicked on trash all button, all stop watches are removed
 * When clicked on count direction, it toggles the next stop watch 
 * between counting up or down
 * 
 * @callback  
 */
function callbackClickSpawnBox(event) {    
    /**
     * @type {any}
     */
    const target = event.target;
    
    if (target === spawnBtn) {

        const lableText = inputFieldLableStopWatch.value.trim();
        inputFieldLableStopWatch.value = "";
        
        CreateStopWatch(lableText);             
    } else if (target.parentNode === trashAllBtn) {                
        actionBtnDeleteAll();
    } else if (target === countDirectionBtn) {
        
        countDownGlobal = !countDownGlobal;
        sessionStorage.setItem(STORAGE_KEYS.GLOBAL_COUNT_DIRECTION, JSON.stringify(countDownGlobal));
        toggleCounterSpawnerArrow(countDownGlobal, counterArrowSpawn);
        toggleCountDirectionBtn(countDownGlobal);
    }
}

/**
 * :TODO Implement deleting all stop watches by pressing keyboard
 * 
 * @param {!object} event 
 * @callback 
 */
function callbackPress (event) {
    const eventTarget = event.target;
    const key = event.code;
                
    const pressedEnter = key === "Enter";
    const pressedBackspace = key ==="Backspace";
    const pressedDelete = key === "Delete";  
    
    if (pressedEnter || pressedBackspace || pressedDelete) {
        // Here the user presses the input field of for starting
        // time of a stop watch
        if ( 
            (pressedEnter || pressedDelete) &&
            (
                eventTarget === inputFieldLableStopWatch ||
                eventTarget === startSecondsInput ||
                eventTarget === startMinutesInput ||
                eventTarget === startHoursInput
            )
        ) {        
            if (pressedDelete) {                        
                actionBtnDeleteAll();
            } else {
                const lableText = inputFieldLableStopWatch.value.trim();
                inputFieldLableStopWatch.value = "";
                CreateStopWatch(lableText);
            }            
            
        } else {
                                                    
            const focusedWatch = stopWatchList.find(
                stopwatch => stopwatch.domReference === eventTarget
            );

            if (typeof focusedWatch !== "undefined") {
                if (pressedEnter) {
                    if (
                        focusedWatch.CurrentState === StopWatch.States.counting                                
                        ) {
                        actionBtnPause(focusedWatch);
                    } else {
                        actionBtnPlay(focusedWatch);                            
                    }
                } else if (pressedBackspace) {
                    actionBtnReset(focusedWatch);
                } else {
                    actionBtnDelete(focusedWatch);
                }
            }

        } 
    } 
}


/**
 * Handles all events related to a stop watch
 * 
 * When clicked on the play button, the stop watch starts or resumes the counting.
 * When clicked on the pause button, the stop watch stops counting.
 * When clicked on the reset button, the stop watch reverts back to the start time and pauses.
 * When clicked on the trash button, the stop watch is removed on the page.
 * 
 * @callback
 */
function callBackStopWatchContainer(event) {
    /**
     * @type {any}
     */
    const target = event.target;

    // If the play button is clicked
    if ( StopWatch.isAPlyBtn( target ) === true ) {

        for (const stopWatch of stopWatchList) {
            if (stopWatch.playBtn === target) {                        
                actionBtnPlay(stopWatch);                        
            }                
        }
    // If the trash button is clicked
    } else if ( StopWatch.isATrashBtn(target) ) {                              
        actionBtnDelete(target);
    // If the pause button is clicked 
    } else if ( StopWatch.isAPauseBtn(target) ) { 
        for (const stopWatch of stopWatchList) {
            if (stopWatch.pauseBtn == target) {       
                actionBtnPause(stopWatch);
            }                
        }   
    // If the reset button is clicked 
    } else if ( StopWatch.isAResetBtn(target) ) {
        for (const stopWatch of stopWatchList) {    
            if (stopWatch.resetBtn === target) {    
                actionBtnReset(stopWatch);
            }    
        }
    } else if ( StopWatch.isASaveBtn(target) ) {
        for (const stopWatch of stopWatchList) {    
            if (stopWatch.saveBtn === target) {    
                stopWatch.setCheckPoint();
            }    
        }
    }

}
    
/**
 * Validates the input of the user.
 * If valid, creates the a stop watch instance and returns it .
 * 
 * 
 * @param {!string} [lableText="Stop Watch"] - (optional) Title of stop watch box 
 * to be spawned.
 * @param {?number} [totalSeconds=null] - (optional) the time which a stop watch starts
 * counting from  if not provided the starting time
 * for a stop watch will taken from the input starting time widget in the spawn box
 * @param {!boolean} [countDown] (optional) if false the stop watch will count up
 * if true the stop watch will count down. if not provided the countDownGlobal variable
 * is taken for this parameter
 *
 * @returns {?StopWatch} Returns the created stop watch instance.
 * Returns null if the starting time from input starting time widget was not valid
 */
function CreateStopWatch(
    lableText="Stop Watch", 
    totalSeconds=null, 
    countDown=countDownGlobal
    ) {

    // If null here the stop watch is created through clicking on the spawn button
    // Grabbing starting time from the input starting time widget in the spawn box 
    if (totalSeconds === null) {
        totalSeconds = validateStartingTime();
    }

    // if null here the the string from the spawn box is not valid for conversion into numbers
    if (totalSeconds === null) {
        return null;
    }

    const stopWatch = new StopWatch( lableText, totalSeconds );
    stopWatch.countingDown = countDown;
    // Giving the stop watch its starting time            
    
    integrateStopWatch(stopWatch);

    return stopWatch;
}

/**
 * Appends the the stop watch html model in the proper position of dom tree
 * Toggles the visibility of the action buttons of the stop watch (like play button)
 * Adds stop watch to the global lis of all stop watch. 
 * If needed, toggles the bar between the stop watch container and the spawn box. 
 * 
 * @param {!StopWatch} createdStopWatch - most recently created stop watch
 * to integrated
 */
function integrateStopWatch(createdStopWatch) {
    containerForStopWatches.appendChild(createdStopWatch.domReference);

    // Making the pause and reset buttons half transparent.
    createdStopWatch.pauseBtn
    .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
    createdStopWatch.resetBtn
    .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
    
    // Giving the arrow which indicates the counting direction, 
    // the right appearance  
    toggleCounterSpawnerArrow(
        createdStopWatch.countingDown, 
        createdStopWatch.counterArrow
    );
                                            
    stopWatchList.push( createdStopWatch ); 

    toggleSpawnBar();

    createdStopWatch.domReference.tabIndex = 0;
}

// As soon as the 1. stop watch is spawned, a separation bar is shown
// between the spawn box and the stop watches.

function toggleSpawnBar() {
    if (stopWatchList.length > 0) toggleVisibility(separationBar, true);
}   

/**
 * Grabs the starting time units from the spawn box and checks if
 * they are valid. If invalid does not create a stop watch box and shows
 * an error bar for the user.
 * 
 * @returns {?number} - if valid input: totalSeconds of the seconds, 
 * minutes and hours read from the input field for starting time 
 * from the stop watch spawn box. 
 * if invalid input: null 
 */
function validateStartingTime() {
    // Getting values from the input fields for the starting time
    const totalSeconds = textTimeUnitsToSeconds(
    startSecondsInput.value,
    startMinutesInput.value,
    startHoursInput.value
    );

    // Resting the input field for starting time
    startSecondsInput.value = "0";
    startMinutesInput.value = "0";
    startHoursInput.value = "0";
    
    // In case of invalid input for starting time an error bar
    // as message is displayed to user.
    if (totalSeconds === null) {
        manageErrorBar(true);
        return null;
    }
    else { 
        manageErrorBar(false);
        return totalSeconds;
    }
}
        
});
