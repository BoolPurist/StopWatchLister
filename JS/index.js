// @ts-check
import { StopWatch } from "./Modules/StopWatch.js";
import { textTimeUnitsToSeconds } from "./Modules/UtilityFunctions.js";
import { QS, DYN_PROP_NAMES } from "./Modules/Constants.js";

window.addEventListener("DOMContentLoaded", () => {
        "use strict";
        // SW = stopwatch
        // QS = querySelector
             
    
        const toggleClassNameFocus = "minorFocus";
    
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
        const inputFieldLableStopWatch = document.querySelector("#InputFieldLableStopWatch");
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
         * On clicking it in the spawn box, it toggles the counting direction of up or down
         * of the next stop watch to be spawned
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
        
        let countDown = false;
        const countDirectionNames = new Map()
        countDirectionNames.set(false, "Count Down ?");
        countDirectionNames.set(true, "Count Up ?");
        const countArrowClasses = new Map();
        countArrowClasses.set(false, "fa-angle-double-up");
        countArrowClasses.set(true, "fa-angle-double-down");
        
        
        /**
         * @type {Array<StopWatch>} - array of stopwatches wich are in the dom currently
         */
        let stopWatchList = [];
            
        /* Attaching events */
        // Attaching events for the spawn watch box    
        // Adding event for spawn manage button
            
        spawnBoxStopWatch.addEventListener("click", callBackSpawnBox);
    
        containerForStopWatches.addEventListener("click", callBackStopWatchContainer);
    
    
    
    
        // Debug Area
                

        
        
    
        /* Functions */
    
        /**
         * 
         * 
         * @param {Event} event - is fired by a widget of the spawn box 
         * for stop watches
         * @returns {void}   
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
    
                countDown = !countDown;
                toggleCounterSpawnerArrow(countDown);
                countDirectionBtn.textContent = countDirectionNames.get(countDown);
            }
        }
    
    
        /**
         * 
         * @param {Event} event - is fired by widgets of a stop watch 
         * @returns {void}
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
            
            if ( targetClass.includes(QS.PLAY_BTN.substring(1)) ) {
    
                for (const stopWatch of stopWatchList) {
    
                    if (stopWatch[DYN_PROP_NAMES.PLAY_BUTTON] === target) {
                        
                        stopWatch[DYN_PROP_NAMES.PLAY_BUTTON].classList.add(toggleClassNameFocus);
                        stopWatch[DYN_PROP_NAMES.PAUSE_BUTTON].classList.remove(toggleClassNameFocus);
                        
                        if (stopWatch.start()) {                                              
                            stopWatch[DYN_PROP_NAMES.RESET_BTN].classList.remove(toggleClassNameFocus);                        
                        }
                        
                    }                
                }
    
            } else if (targetClass.includes(QS.TRASH_BTN.substring(1))) {
                
                for (let i = 0; i < stopWatchList.length; i++) {
    
                    if (stopWatchList[i][DYN_PROP_NAMES.DELETE_BUTTON] === target) {                                       
                        stopWatchList[i].remove();
                        stopWatchList.splice(i, 1);                                            
                        if (stopWatchList.length === 0) toggleVisibility(separationBar, false);             
                    }
    
                } 
    
            } else if (targetClass.includes(QS.PAUSE_BTN.substring(1))) {
    
                for (const stopWatch of stopWatchList) {
    
                    if (stopWatch[DYN_PROP_NAMES.PAUSE_BUTTON] === target) {   
    
                        if (stopWatch.pause()) {
                            stopWatch[DYN_PROP_NAMES.PLAY_BUTTON].classList.remove(toggleClassNameFocus);
                            stopWatch[DYN_PROP_NAMES.PAUSE_BUTTON].classList.add(toggleClassNameFocus);
                        }
    
                    }                
                }   
    
            } else if (targetClass.includes(QS.RESET_BTN.substring(1))) {
    
                for (const stopWatch of stopWatchList) {
    
                    if (stopWatch[DYN_PROP_NAMES.RESET_BTN] === target) {
    
                        stopWatch[DYN_PROP_NAMES.PLAY_BUTTON].classList.remove(toggleClassNameFocus);
                        stopWatch[DYN_PROP_NAMES.RESET_BTN].classList.add(toggleClassNameFocus);
                        stopWatch[DYN_PROP_NAMES.PAUSE_BUTTON].classList.add(toggleClassNameFocus);
                        stopWatch.reset();
                    }
    
                }
            }
    
        }
        
        function populateDomElementWithTextContent (startDomElement, ...Data) {
            
            Data.forEach(
                object => {
                const {querySelector, textContent} = object;
                startDomElement.querySelector(querySelector).textContent = textContent;
                }
            );
        }
    
        function CreateStopWatch(lableText="Stop Watch") {
            // Getting values from the input fields for the starting time
             
            const totalSeconds = textTimeUnitsToSeconds(
                startSecondsInput.value,
                startMinutesInput.value,
                startHoursInput.value
            );
    
            startSecondsInput.value = "0";
            startMinutesInput.value = "0";
            startHoursInput.value = "0";
            
            if (totalSeconds === null) {
                manageErrorBar(true);
                return;
            }
            else { 
                manageErrorBar(false);
            }
    
            const stopWatch = new StopWatch(
                QS.LIST_SW,
                QS.CLASS_TEXT_TIMER, 
                { propertyName: DYN_PROP_NAMES.PLAY_BUTTON, domQuerySelector: QS.PLAY_BTN },                       
                { propertyName: DYN_PROP_NAMES.DELETE_BUTTON, domQuerySelector:  QS.TRASH_BTN},                       
                { propertyName: DYN_PROP_NAMES.PAUSE_BUTTON, domQuerySelector:  QS.PAUSE_BTN},                       
                { propertyName: DYN_PROP_NAMES.RESET_BTN, domQuerySelector:  QS.RESET_BTN},                       
                { propertyName: DYN_PROP_NAMES.COUNTER_ARROW, domQuerySelector:  QS.COUNTER_ARROW},                       
            );
    
            stopWatch[DYN_PROP_NAMES.PAUSE_BUTTON].classList.add(toggleClassNameFocus);
            stopWatch[DYN_PROP_NAMES.RESET_BTN].classList.add(toggleClassNameFocus);
            stopWatch[DYN_PROP_NAMES.COUNTER_ARROW].classList.add(countArrowClasses.get(countDown)); 
    
            stopWatch.setUpTimer(totalSeconds);
            stopWatch.countDown = countDown;
    
    
            stopWatchList.push( stopWatch ); 
            populateDomElementWithTextContent(
                stopWatch.domReference,
                {querySelector: QS.LABLE_TEXT_SW, textContent: lableText}
            );
    
            if (stopWatchList.length === 1) toggleVisibility(separationBar, true); 
        }
    
        function toggleVisibility(domElement,makeVisible) {
            if (makeVisible === true) domElement.classList.remove("beGone");
            else domElement.classList.add("beGone");        
        }
    
        /**
         * Toggles visibility and influence on the document flow for the error bar. 
         * If user provides wrong input the error bar is visible and places itself in the gird row
         * of the wrapper and before the spawn box. If user provides something valid with the next input, 
         * the error bar gets invisible and is removed from the grid flow. 
         * 
         * @param {!boolean} errorRaised - true if the user provided wrong input
         * @returns {void} 
         */
        function manageErrorBar(errorRaised) {
            
            const isNotErrorBarDom = errorBarInDom.classList.value.includes("beGone");
    
            if (errorRaised === true && isNotErrorBarDom === true ) {            
                errorBarInDom.classList.remove("beGone");                        
            } else if (errorRaised === false && isNotErrorBarDom === false) {
                errorBarInDom.classList.add("beGone");            
            }
    
        }
    
        function toggleCounterSpawnerArrow(countDown) {
            const classListArrow = counterArrowSpawn.classList; 
            
            if (countDown === true) {
                classListArrow.remove("fa-angle-double-up");
                classListArrow.add("fa-angle-double-down");
            } else {
                classListArrow.add("fa-angle-double-up");
                classListArrow.remove("fa-angle-double-down");
            }
        }
       
});
