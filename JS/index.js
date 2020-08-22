
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

    // Names of the properties which are created on every stop watch at runtime
    const playButtonName = "playButton";
    const deleteButtonName = "trashButton";
    const pauseButtonName = "pauseButton";
    const resetBtnName = "resetButton";

    const toggleClassNameFocus = "minorFocus";

    const inputFieldLableStopWatch = document.querySelector("#InputFieldLableStopWatch");
    const spawnBtn = document.querySelector(QSSpawnBtn);
    const trashAllBtn = document.querySelector(QSTrashAllBtn);
    

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
        );

        stopWatch[pauseButtonName].classList.add(toggleClassNameFocus);
        stopWatch[resetBtnName].classList.add(toggleClassNameFocus);



        stopWatchList.push( stopWatch ); 
        populateDomElementWithTextContent(
            stopWatch.domReference,
            {querySelector: QSLableTextSW, textContent: lableText}
        );
    }

    
}) ()
