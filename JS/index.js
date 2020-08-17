import { testString, createStopWatch } from "./Modules/DOM_Manipulation.js";
(function() {
        
    const stop_watch_wrapper = document.querySelector("#stop-watch-list");
    document.querySelector("#SpawnManage-btnS").addEventListener("click", () => {
        stop_watch_wrapper.appendChild(createStopWatch("Stop-Watch 2", "20:20:20"));
    });

    
    
    
}) ()
