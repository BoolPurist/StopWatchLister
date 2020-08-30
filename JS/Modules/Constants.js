// query selector strings for getting dom elements.
const QS = {

        /**
         * @const
         * @type {string}
         */    
        SPAWN_BOX: "#SpawnStopWatchBox",
                /**
         * @const
         * @type {string}
         */
        LABLE_TEXT_SW: ".stop-watch-label-text",
        /**
         * @const
         * @type {string}
         */
        SPAWN_BTN: "#spawn-btn",
        /**
         * @const
         * @type {string}
         */
        TRASH_ALL_BTN: "#TrashAllButtons",
        /**
         * @const
         * @type {string}
         */
        COUNT_DIRECTION_BTN: "#check-count-direction",
        /**
         * @const
         * @type {string}
         */
        INPUT_SECONDS: "#input-seconds",
        /**
         * @const
         * @type {string}
         */
        INPUT_MINUTES: "#input-minutes",
        /**
         * @const
         * @type {string}
         */
        INPUT_HOURS: "#input-hours",
        /**
         * @const
         * @type {string}
         */
        COUNTER_ARROW_SPAWN: "#counter-arrow-spawn",
        /**
         * @const
         * @type {string}
         */
        LIST_SW: "#stop-watch-list",
        /**
         * @const
         * @type {string}
         */
        PLAY_BTN: ".play-btn",
        /**
         * @const
         * @type {string}
         */
        PAUSE_BTN: ".pause-btn",
        /**
         * @const
         * @type {string}
         */
        RESET_BTN: ".reset-btn",
        /**
         * @const
         * @type {string}
         */
        TRASH_BTN: ".trash-btn",
        /**
         * @const
         * @type {string}
         */
        CLASS_TEXT_TIMER: ".text-timer",        
        /**
         * @const
         * @type {string}
         */
        COUNTER_ARROW: ".counter-arrow",
        /**
         * @const
         * @type {string}
         */
        SEPARATION_BAR: ".separation-bar",
        /**
         * @const
         * @type {string}
         */
        ERROR_BAR_STARTIME: ".error-bar-start-time",

}

// Names of the properties which are created on every stop watch at runtime
const DYN_PROP_NAMES = {
        /**
         * @const
         * @type {string}
         */
        PLAY_BUTTON: "playButton",
        /**
         * @const
         * @type {string}
         */    
        DELETE_BUTTON: "trashButton",
        /**
         * @const
         * @type {string}
         */
        PAUSE_BUTTON: "pauseButton",
        /**
         * @const
         * @type {string}
         */
        RESET_BTN: "resetButton",
        /**
         * @const
         * @type {string}
         */
        COUNTER_ARROW: "counterArrow",
}

const TOGGLE_CLASSES = {
        
}

Object.freeze(QS);
Object.freeze(DYN_PROP_NAMES);

export { QS, DYN_PROP_NAMES };