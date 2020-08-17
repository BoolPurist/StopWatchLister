import { testString, createStopWatch } from "./Modules/DOM_Manipulation.js";
(function() {
    
    let stop_watch_wrapper = document.querySelector("#stop-watch-list");
    stop_watch_wrapper.appendChild(createStopWatch("Stop-Watch", "20:20:20"));
    
}) ()
