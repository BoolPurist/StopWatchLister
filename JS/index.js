
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

    // Names of the properties which are created on every stop watch at runtime
    const playButtonName = "playButton";
    const deleteButtonName = "trashButton";
    const pauseButtonName = "pauseButton";
    const resetBtnName = "resetButton";
    const counterArrow = "counterArrow";

    const toggleClassNameFocus = "minorFocus";

    const spawnBoxStopWatch = document.querySelector(QSSpawnBox); 
    const inputFieldLableStopWatch = document.querySelector("#InputFieldLableStopWatch");
    const spawnBtn = document.querySelector(QSSpawnBtn);
    const trashAllBtn = document.querySelector(QSTrashAllBtn);
    const countDirectionBtn = document.querySelector(QSCountDirectionBtn);
    const startSecondsInput = document.querySelector(QSInputSeconds);
    const startMinutesInput = document.querySelector(QSInputMinutes);
    const startHoursInput = document.querySelector(QSInputHours);
    const errorBarInDom = document.querySelector(QSErrorBarStarTime);
     
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
    
    

    document.querySelector(QSListSW).addEventListener("click", (event) => {
        const target = event.target;
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

            for (const stopWatch of stopWatchList) {

                if (stopWatch[deleteButtonName] === target) {                    
                    stopWatch.remove();
                                        
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

    });

    spawnBoxStopWatch.addEventListener("click", (event) => {    
        
        const target = event.target;

        if (target === spawnBtn) {

            const lableText = inputFieldLableStopWatch.value.trim();
            inputFieldLableStopWatch.value = "";
            
            CreateStopWatch(lableText);
        } else if (target.parentNode === trashAllBtn) {
            
            for (const stopWatch of stopWatchList) {
                stopWatch.remove();
            }
            
            stopWatchList = [];
        } else if (target === countDirectionBtn) {

            countDown = !countDown;
            countDirectionBtn.textContent = countDirectionNames.get(countDown);
        }
    });



    // Debug Area
    
    CreateStopWatch();

    /* Functions */
    
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

        startSecondsInput.value = 0;
        startMinutesInput.value = 0;
        startHoursInput.value = 0;
        
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
            console.log("ErroRaised");
            errorBarInDom.classList.remove("beGone");                        
        } else if (errorRaised === false && isNotErrorBarDom === false) {
            errorBarInDom.classList.add("beGone");            
        }

    }
   
}) ()
