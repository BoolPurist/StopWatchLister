import * as DOM_Manipulation from "./Modules/DOM_Manipulation.js";
(function() {
        
    const stop_watch_wrapper = document.querySelector("#stop-watch-list");
    document.querySelector("#SpawnManage-btnS").addEventListener("click", () => {
        let stopWatch = DOM_Manipulation.createStopWatch("Stop-Watch 2", "20:20:20");
        callbackClickTrashButton(stopWatch);
        stop_watch_wrapper.appendChild(stopWatch);
    });

    // Adds a click event with a callback function to the trash button of a stop watch. 
    function callbackClickTrashButton(stopWatch) {
        let trashButton = stopWatch.querySelector(".trash-btn");
        trashButton.addEventListener("click", () => {
            DOM_Manipulation.RemoveStopWatchViaTrashButton(trashButton);
        })
    }
    
    
}) ()
