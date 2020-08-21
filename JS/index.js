import * as DOM_Manipulation from "./Modules/DOM_Manipulation.js";
import {Timer} from "./Modules/Timer.js";

(function() {
    "use strict";
    /* Getting dom elements for reference. */     
    const stop_watch_wrapper = document.querySelector("#stop-watch-list");
    const inputFieldLableStopWatch = document.querySelector("#InputFieldLableStopWatch");
    
    /* Attaching events */
    // Attaching events for the spawn watch box    
    // Adding event for spawn manage button
    document.querySelector("#SpawnManage-btnS").addEventListener("click", () => {        
        let stopWatch = DOM_Manipulation.createStopWatch(inputFieldLableStopWatch.value.trim(), "20:20:20");
        inputFieldLableStopWatch.value = "";
        AddCallbackClickTrashButton(stopWatch);
        stop_watch_wrapper.appendChild(stopWatch);
    });
    
    /* Functions */

    
    
    // Adds a click event with a callback function to the trash button of a stop watch. 
    function AddCallbackClickTrashButton(stopWatch) {
        let trashButton = stopWatch.querySelector(".trash-btn");
        trashButton.addEventListener("click", () => {
            DOM_Manipulation.RemoveStopWatchViaTrashButton(trashButton);
        })
    }
    
    
}) ()
