
import * as DOM_Manipulation from "./Modules/DOM_Manipulation.js";
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

    const inputFieldLableStopWatch = document.querySelector("#InputFieldLableStopWatch");
    /**
     * @type {Array<StopWatch>} - array of stopwatches wich are in the dom currently
     */
    const stopWatchList = [];
    
    // Names of the properties which are created on every stop watch at runtime
    const playBtnPropertyName = "playButton";
    const deleteButton = "trashButton";


    /* Attaching events */
    // Attaching events for the spawn watch box    
    // Adding event for spawn manage button
    
    document.querySelector(QSListSW).addEventListener("click", (event) => {
        if ( event.target.className.includes(QSPlayBtn.substring(1)) ) {
            for (const stopWatch of stopWatchList) {
                if (stopWatch[playBtnPropertyName] === event.target) {
                    stopWatch.start();
                }                
            }
        } else if (event.target.className.includes(QSTrashBtn.substring(1))) {
            for (const stopWatch of stopWatchList) {
                if (stopWatch[deleteButton] === event.target) {                    
                    stopWatch.remove();                    
                }                
            }                                    
        }
    });

    document.querySelector(QSSpawnBtn).addEventListener("click", () => {    
        const lableText = inputFieldLableStopWatch.value.trim();
        inputFieldLableStopWatch.value = "";
        
        const stopWatch = new StopWatch(
            QSListSW,
            QSClassTextTimer, 
            { propertyName: playBtnPropertyName, domQuerySelector: QSPlayBtn },                       
            { propertyName: deleteButton, domQuerySelector:  QSTrashBtn},                       
        );

        stopWatchList.push( stopWatch ); 
        populateDomElementWithTextContent(
            stopWatch.domReference,
            {querySelector: QSLableTextSW, textContent: lableText}
        );
        
        
    });
    
    /* Functions */
    
    function populateDomElementWithTextContent (startDomElement, ...Data) {
        
        Data.forEach(
            object => {
            const {querySelector, textContent} = object;
            startDomElement.querySelector(querySelector).textContent = textContent;
            }
        );
    }
    
}) ()
