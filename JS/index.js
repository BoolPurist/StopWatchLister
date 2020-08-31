// @ts-check
import { StopWatch } from "./Modules/StopWatch.js";
import { textTimeUnitsToSeconds } from "./Modules/UtilityFunctions.js";
import { 
    QS, DYN_PROP_NAMES, TOGGLE_CLASSES, STORAGE_KEYS, CSS_CLASSES 
} from "./Modules/Constants.js";

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
        
        /**
         * If true the next stop watch to spawn will count down
         * If false it will count up
         * 
         * The value is toggled whenever the user clicks on the button 
         * accessible via variable countDirectionBtn 
         * 
         * @type {!boolean} 
         */
        let countDownGlobal = false;

        const countDirectionNames = new Map();
        // The 2 possible texts the button for counting direction can show
        countDirectionNames.set(false, "Count Down ?");
        countDirectionNames.set(true, "Count Up ?");
        const countArrowClasses = new Map();
        // class names for toggling an arrow for indicating the counting sense
        countArrowClasses.set(false, CSS_CLASSES.ARROW_UP);
        countArrowClasses.set(true, CSS_CLASSES.ARROW_DOWN);
        
        
        /**
         * List of stopwatches which are currently active. An active stop watch in placed in 
         * the dom of the page so the can interact with it.
         * 
         * @type {Array<StopWatch>}
         */
        let stopWatchList = [];
            
        /* Attaching events */
        // Attaching events for the spawn watch box    
        // Adding event for spawn manage button
            
        spawnBoxStopWatch.addEventListener("click", callBackSpawnBox);
    
        containerForStopWatches
        .addEventListener("click", callBackStopWatchContainer);
    
        // Debug Area   
        
        // Managing the session storage

        // Recreating stored stop watches from session storage after page reload
        const stopWatchesState = sessionStorage.getItem(STORAGE_KEYS.STOP_WATCHES);
        // Check if stop watches were present before the page reload
        if (stopWatchesState !== null && stopWatchesState !== "") {
            const stopWatchesObjList = JSON.parse(stopWatchesState); 
            stopWatchesObjList.forEach(uncreatedStopWatch => {                
                const stopWatch = CreateStopWatch(
                    uncreatedStopWatch.lableText,
                    uncreatedStopWatch.totalSeconds,
                    uncreatedStopWatch.countingDown
                );                
                stopWatch.setResetTime(uncreatedStopWatch.startingSeconds);
                
                // If stop watch was started before page reload once
                // the opacity of the control buttons of the stop watch are toggled
                // as if user clicked the pause button.  
                if (uncreatedStopWatch.totalSeconds !== uncreatedStopWatch.startingSeconds) {            
                    opacityAfterClickPause(stopWatch);
                }
            });
        }
        

        // Saving the states of stop watches for recreating stop watches after page reload
        const intervall = setInterval( () => {
            if (stopWatchList.length === 0) {
                sessionStorage.setItem(STORAGE_KEYS.STOP_WATCHES, "");
            } else {            
                const stateList = stopWatchList.map(
                    stopWatch => stopWatch.jsObjectState 
                );
                const stateString = JSON.stringify(stateList);
                sessionStorage.setItem(STORAGE_KEYS.STOP_WATCHES, stateString);                
            }         
        },1000)

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
        function callBackSpawnBox(event) {    
            /**
             * @type {any}
             */
            const target = event.target;
    
            if (target === spawnBtn) {
    
                const lableText = inputFieldLableStopWatch.value.trim();
                inputFieldLableStopWatch.value = "";
                
                CreateStopWatch(lableText);             
            } else if (target.parentNode === trashAllBtn) {
                
                for (const stopWatch of stopWatchList) {
                    stopWatch.remove();
                    stopWatchList = [];
                    toggleVisibility(separationBar, false);
                }
                
                stopWatchList = [];
            } else if (target === countDirectionBtn) {
    
                countDownGlobal = !countDownGlobal;
                toggleCounterSpawnerArrow(countDownGlobal);
                countDirectionBtn.textContent = countDirectionNames
                .get(countDownGlobal);
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
            /**
             * @type {string}
             */
            const targetClass = target.className;
            
            // If the play button is clicked
            if ( targetClass.includes(QS.PLAY_BTN.substring(1)) ) {
    
                for (const stopWatch of stopWatchList) {
    
                    if (stopWatch[DYN_PROP_NAMES.PLAY_BUTTON] === target) {
                        
                        stopWatch[DYN_PROP_NAMES.PLAY_BUTTON]
                        .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
                        stopWatch[DYN_PROP_NAMES.PAUSE_BUTTON]
                        .classList.remove(TOGGLE_CLASSES.PARTLY_OPACITY);
                        
                        // Should only make reset btn apparent if the play is clicked 
                        // while stop watch is reset or paused. 
                        if (stopWatch.start()) {                                              
                            stopWatch[DYN_PROP_NAMES.RESET_BTN]
                            .classList.remove(TOGGLE_CLASSES.PARTLY_OPACITY);                        
                        }
                        
                    }                
                }
            // If the trash button is clicked
            } else if (targetClass.includes(QS.TRASH_BTN.substring(1))) {
                
                for (let i = 0; i < stopWatchList.length; i++) {
    
                    if (stopWatchList[i][DYN_PROP_NAMES.DELETE_BUTTON] === target) {                                       
                        stopWatchList[i].remove();
                        stopWatchList.splice(i, 1);                                            
                        if (stopWatchList.length === 0) {
                            toggleVisibility(separationBar, false);
                        }             
                    }
    
                } 
            // If the pause button is clicked 
            } else if (targetClass.includes(QS.PAUSE_BTN.substring(1))) {
    
                for (const stopWatch of stopWatchList) {
    
                    if (stopWatch[DYN_PROP_NAMES.PAUSE_BUTTON] === target) {   
    
                        if (stopWatch.pause()) {
                            opacityAfterClickPause(stopWatch);
                        }
    
                    }                
                }   
            // If the reset button is clicked 
            } else if (targetClass.includes(QS.RESET_BTN.substring(1))) {
    
                for (const stopWatch of stopWatchList) {
    
                    if (stopWatch[DYN_PROP_NAMES.RESET_BTN] === target) {
    
                        opacityAfterClickReset(stopWatch);
                        stopWatch.reset();
                    }
    
                }
            }
    
        }
        
        /**
         * Inserts a test as textContent into a dom element as a child 
         * of the given dom element via the help of a given css selector
         * 
         * @param {object} startDomElement - dom element which 
         * has the children to search through 
         * @param  {...object} Data - Following Properties are needed: 
         * querSelector - css selector to find the dom element to insert 
         * the text into textContent - text to insert
         * @returns {void} 
         */
        function populateDomElementWithTextContent (startDomElement, ...Data) {
            
            Data.forEach(
                object => {
                const {querySelector, textContent} = object;
                startDomElement.querySelector(querySelector)
                .textContent = textContent;
                }
            );
        }
    
        /**
         * 1. Constructs a dom element which displays a box with a stop watch.
         * 2. It then combines it with the logic of 
         * timer instance for counting time.
         * 3. Adds the stop watch instance into the global list of exiting stop watches
         * 4. If the first stop watch is created it enables the separation bar 
         * between the spawn box and the stop watches.
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
        function CreateStopWatch(lableText="Stop Watch", totalSeconds=null, countDown=countDownGlobal) {
    
            // If null here the stop watch is created through clicking on the spawn button
            // Grabbing starting time from the input starting time widget in the spawn box 
            if (totalSeconds === null) {
                totalSeconds = validateStartingTime();
            }

            // if null here the the string from the spawn box is not valid for conversion into numbers
            if (totalSeconds === null) {
                return null;
            }
    
            const stopWatch = new StopWatch(
                QS.LIST_SW,
                QS.CLASS_TEXT_TIMER, 
                lableText, 
                // Attaching the dynamic properties to reference the children 
                // dom elements of the stop watch later
                { 
                    propertyName: DYN_PROP_NAMES.PLAY_BUTTON,
                    domQuerySelector: QS.PLAY_BTN
                },                       
                { 
                    propertyName: DYN_PROP_NAMES.DELETE_BUTTON,
                    domQuerySelector:  QS.TRASH_BTN
                },                       
                { 
                    propertyName: DYN_PROP_NAMES.PAUSE_BUTTON,
                    domQuerySelector:  QS.PAUSE_BTN
                },                       
                { 
                    propertyName: DYN_PROP_NAMES.RESET_BTN, 
                    domQuerySelector:  QS.RESET_BTN
                },                       
                { 
                    propertyName: DYN_PROP_NAMES.COUNTER_ARROW,
                    domQuerySelector:  QS.COUNTER_ARROW
                },                       
            );
    
            // Making the pause and reset buttons half transparent.
            stopWatch[DYN_PROP_NAMES.PAUSE_BUTTON]
            .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
            stopWatch[DYN_PROP_NAMES.RESET_BTN]
            .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
            
            // Giving the arrow which indicates the counting direction, 
            // the right appearance  
            stopWatch[DYN_PROP_NAMES.COUNTER_ARROW]
            .classList.add(countArrowClasses.get(countDown)); 
    
            // Giving the stop watch its starting time
            stopWatch.setUpTimer(totalSeconds);
            stopWatch.countDown = countDown;
    
            
            stopWatchList.push( stopWatch ); 

            // Giving the new stop watch its title if it was provided
            populateDomElementWithTextContent(
                stopWatch.domReference,
                {querySelector: QS.LABLE_TEXT_SW, textContent: lableText}
            );
    
            // As soon as the 1. stop watch is spawned, a separation bar is shown
            // between the spawn box and the stop watches.
            if (stopWatchList.length === 1) toggleVisibility(separationBar, true);
            
            return stopWatch;
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
    
        /**
         * Makes a dom element invisible and removes it from the document flow
         * Or makes an element visible again and reintegrates 
         * into the document flow 
         * 
         * @param {!HTMLElement} domElement - Dom element to change 
         * @param {!boolean} makeVisible - If true dom element will be made
         * invisible and put out of the document flow if false vise versa
         * @returns {void} 
         */
        function toggleVisibility(domElement,makeVisible) {
            if (makeVisible === true) domElement.classList.remove(TOGGLE_CLASSES.BE_GONE);
            else domElement.classList.add(TOGGLE_CLASSES.BE_GONE);        
        }

        /**
         * Increases the opacity of the play buttton and the reste button
         * Decreases the opacity of the pause button
         * opacityAfterClickPause
         * @param {StopWatch} stopWatch
         * @returns {void} 
         */
        function opacityAfterClickPause(stopWatch) {            
            stopWatch[DYN_PROP_NAMES.PLAY_BUTTON]
            .classList.remove(TOGGLE_CLASSES.PARTLY_OPACITY);            
            stopWatch[DYN_PROP_NAMES.PAUSE_BUTTON]
            .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
            stopWatch[DYN_PROP_NAMES.RESET_BTN]
            .classList.remove(TOGGLE_CLASSES.PARTLY_OPACITY);
        }

        /**
         * Increases the opacity of the play button
         * Decreases the opacity of the reset button and the pause button
         * 
         * @param {StopWatch} stopWatch
         * @returns {void} 
         */
        function opacityAfterClickReset(stopWatch) {
            stopWatch[DYN_PROP_NAMES.PLAY_BUTTON]
            .classList.remove(TOGGLE_CLASSES.PARTLY_OPACITY);
            stopWatch[DYN_PROP_NAMES.RESET_BTN]
            .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
            stopWatch[DYN_PROP_NAMES.PAUSE_BUTTON]
            .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
        }

        /**
         * Toggles visibility and influence on the document flow for the error bar. 
         * If user provides wrong input the error bar is visible and 
         * places itself in the gird row of the wrapper and before the spawn box. 
         * If user provides something valid with the next input, 
         * the error bar gets invisible and is removed from the grid flow. 
         * 
         * @param {!boolean} errorRaised - true if the user provided wrong input
         * @returns {void} 
         */
        function manageErrorBar(errorRaised) {
            
            const isNotErrorBarDom = errorBarInDom
            .classList.value.includes(TOGGLE_CLASSES.BE_GONE);
    
            if (errorRaised === true && isNotErrorBarDom === true ) {            
                errorBarInDom.classList.remove(TOGGLE_CLASSES.BE_GONE);                        
            } else if (errorRaised === false && isNotErrorBarDom === false) {
                errorBarInDom.classList.add(TOGGLE_CLASSES.BE_GONE);            
            }
    
        }
    
        /**
         * Changes the appearance of the arrow in the spawn box to
         * represents the counting sense for the next stop watch to be 
         * spawned 
         * 
         * @param {!boolean} countDown - If true the arrow will represent 
         * counting up if false the arrow will represent counting down
         * @returns {void} 
         */
        function toggleCounterSpawnerArrow(countDown) {
            const classListArrow = counterArrowSpawn.classList; 
            
            if (countDown === true) {
                classListArrow.remove(CSS_CLASSES.ARROW_UP);
                classListArrow.add(CSS_CLASSES.ARROW_DOWN);
            } else {
                classListArrow.add(CSS_CLASSES.ARROW_UP);
                classListArrow.remove(CSS_CLASSES.ARROW_DOWN);
            }
        }
       
});
