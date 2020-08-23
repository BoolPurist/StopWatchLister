
import { StopWatch } from "./Modules/StopWatch.js";

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

    // Names of the properties which are created on every stop watch at runtime
    const playButtonName = "playButton";
    const deleteButtonName = "trashButton";
    const pauseButtonName = "pauseButton";
    const resetBtnName = "resetButton";
    const counterArrow = "counterArrow";

    const toggleClassNameFocus = "minorFocus";

    const inputFieldLableStopWatch = document.querySelector("#InputFieldLableStopWatch");
    const spawnBtn = document.querySelector(QSSpawnBtn);
    const trashAllBtn = document.querySelector(QSTrashAllBtn);
    const countDirectionBtn = document.querySelector(QSCountDirectionBtn);
    const startSecondsInput = document.querySelector(QSInputSeconds);
    const startMinutesInput = document.querySelector(QSInputMinutes);
    const startHoursInput = document.querySelector(QSInputHours);
    
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

    document.querySelector(QSSpawnBox).addEventListener("click", (event) => {    
        
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

        // Getting values from the input fields for the starting time
        const numberOrZero = (stringValue) => {
            const possibleNumber = Number(stringValue);
            console.log(possibleNumber);
            return Number.isNaN(possibleNumber) === false ? possibleNumber : 0;
        }

        let startingSeconds = numberOrZero(startSecondsInput.value);
        let startingMinutes = numberOrZero(startMinutesInput.value);;
        let startingHours = numberOrZero(startHoursInput.value);

        stopWatch.setUpTimer(startingSeconds, startingMinutes, startingHours, countDown);
        stopWatch[counterArrow].classList.add(countArrowClasses.get(countDown)); 
        startSecondsInput.value = 0;
        startMinutesInput.value = 0;
        startHoursInput.value = 0;

        stopWatchList.push( stopWatch ); 
        populateDomElementWithTextContent(
            stopWatch.domReference,
            {querySelector: QSLableTextSW, textContent: lableText}
        );
    }

    
}) ()
