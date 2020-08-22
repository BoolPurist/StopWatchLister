
import { StopWatch } from "./Modules/StopWatch.js";

(function() {
    "use strict";
    // SW = stopwatch
    // QS = querySelector
    
    // querySelector strings for accessing certain dom elements 
    const QSListSW = "#stop-watch-list";
    const QSSpawnBtn = "#spawn-btn";

    const QSClassTextTimer = ".text-timer";
    const QSPlayBtn = ".play-btn";
    const QSTrashBtn = ".trash-btn";
    const QSLableTextSW = ".stop-watch-label-text";
    const QSPauseButton = ".pause-btn";

    // Names of the properties which are created on every stop watch at runtime
    const playButtonName = "playButton";
    const deleteButtonName = "trashButton";
    const pauseButtonName = "pauseButton";

    const inputFieldLableStopWatch = document.querySelector("#InputFieldLableStopWatch");
    /**
     * @type {Array<StopWatch>} - array of stopwatches wich are in the dom currently
     */
    const stopWatchList = [];
    

    
    /* Attaching events */
    // Attaching events for the spawn watch box    
    // Adding event for spawn manage button
    
    document.querySelector(QSListSW).addEventListener("click", (event) => {
        if ( event.target.className.includes(QSPlayBtn.substring(1)) ) {
            for (const stopWatch of stopWatchList) {
                if (stopWatch[playButtonName] === event.target) {
                    stopWatch.start();
                }                
            }
        } else if (event.target.className.includes(QSTrashBtn.substring(1))) {
            for (const stopWatch of stopWatchList) {
                if (stopWatch[deleteButtonName] === event.target) {                    
                    stopWatch.remove();                    
                }                
            }                                    
        } else if (event.target.className.includes(QSPauseButton.substring(1))) {
            for (const stopWatch of stopWatchList) {
                if (stopWatch[pauseButtonName] === event.target) {                    
                    stopWatch.pause();                    
                }                
            }                                    
        } 

    });

    document.querySelector(QSSpawnBtn).addEventListener("click", () => {    
        const lableText = inputFieldLableStopWatch.value.trim();
        inputFieldLableStopWatch.value = "";
        
        CreateStopWatch(lableText);                
    });


    // Debug Area

    CreateStopWatch("Stop Watch");
    
    /* Functions */
    
    function populateDomElementWithTextContent (startDomElement, ...Data) {
        
        Data.forEach(
            object => {
            const {querySelector, textContent} = object;
            startDomElement.querySelector(querySelector).textContent = textContent;
            }
        );
    }

    
    function CreateStopWatch(lableText) {
        const stopWatch = new StopWatch(
            QSListSW,
            QSClassTextTimer, 
            { propertyName: playButtonName, domQuerySelector: QSPlayBtn },                       
            { propertyName: deleteButtonName, domQuerySelector:  QSTrashBtn},                       
            { propertyName: pauseButtonName, domQuerySelector:  QSPauseButton},                       
        );

        stopWatchList.push( stopWatch ); 
        populateDomElementWithTextContent(
            stopWatch.domReference,
            {querySelector: QSLableTextSW, textContent: lableText}
        );
    }
    
}) ()
