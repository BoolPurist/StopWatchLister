// @ts-check
import { StopWatch } from "./Modules/StopWatch.js";
import { textTimeUnitsToSeconds } from "./Modules/UtilityFunctions.js";

(function() {
    "use strict";
    // SW = stopwatch
    // QS = querySelector
    
    // querySelector strings for accessing certain dom elements 
    const QSListSW = "#stop-watch-list";
    const QSSpawnBox = "#SpawnStopWatchBox";
    const QSSpawnBtn = "#spawn-btn";
    const QSTrashAllBtn = "#TrashAllButtons";

    const QSClassTextTimer = ".text-timer";
    const QSPlayBtn = ".play-btn";
    const QSTrashBtn = ".trash-btn";
    const QSLableTextSW = ".stop-watch-label-text";
    const QSPauseButton = ".pause-btn";
    const QSResetBtn = ".reset-btn";
    const QSCountDirectionBtn = "#check-count-direction";
    const QSInputSeconds = "#input-seconds";
    const QSInputMinutes = "#input-minutes";
    const QSInputHours = "#input-hours";
    const QSCounterArrow = ".counter-arrow";
    const QSErrorBarStarTime = ".error-bar-start-time";
    const QSCounterArrowSpawn = "#counter-arrow-spawn";
    const QSSeparationBar = ".separation-bar";

    // Names of the properties which are created on every stop watch at runtime
    const playButtonName = "playButton";
    const deleteButtonName = "trashButton";
    const pauseButtonName = "pauseButton";
    const resetBtnName = "resetButton";
    const counterArrow = "counterArrow";
    

    const toggleClassNameFocus = "minorFocus";

    /**
     * The box which holds all widgets for the user to spawn stop watches 
     * and configure how spawned stop watches will behave 
     *  
     * @type {HTMLElement}
     */
    const spawnBoxStopWatch = document.querySelector(QSSpawnBox);
    /**
     * List for holding all spawned stop watches on the page
     * 
     * @type {HTMLElement}
     */
    const containerForStopWatches = document.querySelector(QSListSW);
    /**
     * Resides in the spawn box
     * Text input field in which the user can enter a name for the 
     * next stop watch to be spawned
     * 
     * @type {HTMLInputElement}
     */ 
    const inputFieldLableStopWatch = document.querySelector("#InputFieldLableStopWatch");
    /**
     * Resides in the spawn box
     * On clicking it, it spawns a stop watch and appends as child
     * into containerForStopWatches
     * 
     * @type {HTMLElement}
     */
    const spawnBtn = document.querySelector(QSSpawnBtn);
    /**
     * Resides in the spawn box
     * On clicking it, it removes all spawned stop watches
     * 
     * @type {HTMLElement}
     */
    const trashAllBtn = document.querySelector(QSTrashAllBtn);
    /**
     * On clicking it in the spawn box, it toggles the counting direction of up or down
     * of the next stop watch to be spawned
     * 
     * @type {HTMLElement}
     */
    const countDirectionBtn = document.querySelector(QSCountDirectionBtn);
    /**
     * Resides in the spawn box
     * Input field where the user provides the seconds for the starting time 
     * of the next stopwatch
     * 
     * @type {HTMLInputElement}
     */
    const startSecondsInput = document.querySelector(QSInputSeconds);
    /**
     * Resides in the spawn box
     * Input field where the user provides the minutes for the starting time 
     * of the next stopwatch
     * 
     * @type {HTMLInputElement}
     */
    const startMinutesInput = document.querySelector(QSInputMinutes);
    /**
     * Resides in the spawn box
     * Input field where the user provides the hours for the starting time 
     * of the next stopwatch
     * 
     * @type {HTMLInputElement}
     */
    const startHoursInput = document.querySelector(QSInputHours);
    /**
     * If user provides invalid input for the starting time this dom
     * element appears always under the spawn box. if the next input 
     * for starting time is valid it disappears.
     * 
     * @type {HTMLElement}
     */
    const errorBarInDom = document.querySelector(QSErrorBarStarTime);
    /**
     * Resides in the spawn box
     * Indicates if the stop watch will count up or down. It is indicates 
     * the direction with its color and pointing up or down
     *   
     * @type {HTMLElement}
     */
    const counterArrowSpawn = document.querySelector(QSCounterArrowSpawn);
    /**
     * Is placed below the spawn box or the error bar to show
     * separation between spawn box and actual stop watches
     * 
     * @type {HTMLElement}
     */
    const separationBar = document.querySelector(QSSeparationBar);
    
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
        
        if ( targetClass.includes(QSPlayBtn.substring(1)) ) {

            for (const stopWatch of stopWatchList) {

                if (stopWatch[playButtonName] === target) {
                    
                    stopWatch[playButtonName].classList.add(toggleClassNameFocus);
                    stopWatch[pauseButtonName].classList.remove(toggleClassNameFocus);
                    
                    if (stopWatch.start()) {                                              
                        stopWatch[resetBtnName].classList.remove(toggleClassNameFocus);                        
                    }
                    
                }                
            }

        } else if (targetClass.includes(QSTrashBtn.substring(1))) {
            
            for (let i = 0; i < stopWatchList.length; i++) {

                if (stopWatchList[i][deleteButtonName] === target) {                                       
                    stopWatchList[i].remove();
                    stopWatchList.splice(i, 1);                                            
                    if (stopWatchList.length === 0) toggleVisibility(separationBar, false);             
                }

            } 

        } else if (targetClass.includes(QSPauseButton.substring(1))) {

            for (const stopWatch of stopWatchList) {

                if (stopWatch[pauseButtonName] === target) {   

                    if (stopWatch.pause()) {
                        stopWatch[playButtonName].classList.remove(toggleClassNameFocus);
                        stopWatch[pauseButtonName].classList.add(toggleClassNameFocus);
                    }

                }                
            }   

        } else if (targetClass.includes(QSResetBtn.substring(1))) {

            for (const stopWatch of stopWatchList) {

                if (stopWatch[resetBtnName] === target) {

                    stopWatch[playButtonName].classList.remove(toggleClassNameFocus);
                    stopWatch[resetBtnName].classList.add(toggleClassNameFocus);
                    stopWatch[pauseButtonName].classList.add(toggleClassNameFocus);
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
            QSListSW,
            QSClassTextTimer, 
            { propertyName: playButtonName, domQuerySelector: QSPlayBtn },                       
            { propertyName: deleteButtonName, domQuerySelector:  QSTrashBtn},                       
            { propertyName: pauseButtonName, domQuerySelector:  QSPauseButton},                       
            { propertyName: resetBtnName, domQuerySelector:  QSResetBtn},                       
            { propertyName: counterArrow, domQuerySelector:  QSCounterArrow},                       
        );

        stopWatch[pauseButtonName].classList.add(toggleClassNameFocus);
        stopWatch[resetBtnName].classList.add(toggleClassNameFocus);
        stopWatch[counterArrow].classList.add(countArrowClasses.get(countDown)); 

        stopWatch.setUpTimer(totalSeconds);
        stopWatch.countDown = countDown;


        stopWatchList.push( stopWatch ); 
        populateDomElementWithTextContent(
            stopWatch.domReference,
            {querySelector: QSLableTextSW, textContent: lableText}
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
   
}) ()
