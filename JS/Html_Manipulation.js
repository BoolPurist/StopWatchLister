// @ts-check
import { TOGGLE_CLASSES, CSS_CLASSES } from "./Constants.js";
import { StopWatch } from "./Modules/StopWatch.js";

/**
 * Makes a dom element invisible and removes it from the document flow
 * Or makes an element visible again and reintegrates 
 * into the document flow 
 * 
 * @param {!HTMLElement} domElement - Dom element to change 
 * @param {!boolean} makeVisible - If true dom element will be made
 * invisible and put out of the document flow if false vise versa
 */
export function toggleVisibility(domElement, makeVisible) {
    if (makeVisible === true) domElement.classList.remove(TOGGLE_CLASSES.BE_GONE);
    else domElement.classList.add(TOGGLE_CLASSES.BE_GONE);        
}

/**
 * Toggles text content and title as tooltip of the button for
 * setting the counting direction of the next stop watch.
 * 
 * @param {!HTMLElement} countDirectionBtn - button which changes the counting direction
 * of the next spawn button to spawn if clicked.
 * @param {Map<!boolean, object>} countDirectionInformation - key is true if next stop watch
 * will count up otherwise down. Value is has 2 properties. btnText is the text content of
 * button which indicates a counting direction switch if clicked. titleText the pop up text 
 * if hovered over the countDirectionBtn
 * @param {!boolean} countDown - the current direction in which the next stop watch will count
 *
 */
export function toggleCountDirectionBtn(countDirectionBtn, countDirectionInformation, countDown) {
    countDirectionBtn.textContent = countDirectionInformation
    .get(countDown).btnText;
    countDirectionBtn.title = countDirectionInformation
    .get(countDown).titleText;
}

/**
 * Changes the appearance and its pop up hover title of an arrow 
 * for showing the counting direction of a stop watch
 * 
 * @param {!Map<!boolean, !string>} countArrowInformation - Map which contains a
 * 2 strings for the content of a button for saying if user wants to count down or up
 * with the next stop watch.
 * @param {!boolean} countDown - If true the arrow will represent 
 * counting up if false the arrow will represent counting down
 * @param {HTMLElement} arrowWidget - the arrow icon as html element to toggle its
 * change its class for the appearance and its tile as tooltip
 * @returns {void} 
 */
export function toggleCounterSpawnerArrow(countArrowInformation, countDown, arrowWidget) {
    const classListArrow = arrowWidget.classList; 
    
    if (countDown === true) {
        classListArrow.remove(CSS_CLASSES.ARROW_UP);
        classListArrow.add(CSS_CLASSES.ARROW_DOWN);
        arrowWidget.title = countArrowInformation
        .get(true);
    } else {
        classListArrow.add(CSS_CLASSES.ARROW_UP);
        classListArrow.remove(CSS_CLASSES.ARROW_DOWN);
        arrowWidget.title = countArrowInformation
        .get(false);
    }
}

/**
* Toggles visibility and influence on the document flow for the error bar. 
* If user provides wrong input the error bar is visible and 
* is located between the spawn box and the list of stop watches. 
* If user provides something valid with the next input, 
* the error bar gets invisible and is removed from the grid flow. 
* 
* @param {!HTMLElement} errorBarInDom - html element which represents an error bar.
* @param {!boolean} errorRaised - true if the user provided wrong input
*
*/
export function manageErrorBar(errorBarInDom, errorRaised, ) {
   
    const isNotErrorBarDom = errorBarInDom
    .classList.contains(TOGGLE_CLASSES.BE_GONE);
 
    if (errorRaised === true && isNotErrorBarDom === true ) {            
        errorBarInDom.classList.remove(TOGGLE_CLASSES.BE_GONE);                        
    } else if (errorRaised === false && isNotErrorBarDom === false) {
        errorBarInDom.classList.add(TOGGLE_CLASSES.BE_GONE);            
    }
 
};   

/**
 * Performs all actions needed to be done when the play button
 * is pressed. Changing opacity of buttons and reactivate 
 * the counting of the internal timer
 * 
 * @param {!StopWatch} selectedWatch - stop watch do all the
 * actions on 
 * @returns {void} 
 */
export function actionBtnPlay(selectedWatch) {
    selectedWatch.playBtn
    .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
    selectedWatch.pauseBtn
    .classList.remove(TOGGLE_CLASSES.PARTLY_OPACITY);
    selectedWatch.resetBtn
    .classList.remove(TOGGLE_CLASSES.PARTLY_OPACITY);    

    selectedWatch.start();
    // Should only make reset btn apparent if the play is clicked 
    // while stop watch is reset or paused. 
    
}

/**
 * Performs all actions needed to be done when the reset button
 * is pressed. Changing opacity of buttons and resets 
 * the time of a stop watch
 * 
 * @param {!StopWatch} selectedWatch - stop watch do all the
 * actions on 
 * @returns {void} 
 */
export function actionBtnReset(selectedWatch) {            
    selectedWatch.playBtn
    .classList.remove(TOGGLE_CLASSES.PARTLY_OPACITY);
    selectedWatch.resetBtn
    .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
    selectedWatch.pauseBtn
    .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
    selectedWatch.reset();            
}

/**
 * Performs all actions needed to be done when the pause button
 * is pressed. Changing opacity of buttons and stops 
 * the counting of the internal timer.
 * 
 * @param {!StopWatch} selectedWatch - stop watch do all the actions on 
 * @param {!boolean} [createdFromStorage=false] - if true according 
 * buttons will be highlighted   
 * @returns {void} 
 */
export function actionBtnPause(selectedWatch, createdFromStorage = false) {
    selectedWatch.pause();            
    if ( 
        createdFromStorage === true  || 
        selectedWatch.CurrentState !== StopWatch.States.reset
        ) {
        selectedWatch.playBtn
        .classList.remove(TOGGLE_CLASSES.PARTLY_OPACITY);            
        selectedWatch.pauseBtn
        .classList.add(TOGGLE_CLASSES.PARTLY_OPACITY);
        selectedWatch.resetBtn
        .classList.remove(TOGGLE_CLASSES.PARTLY_OPACITY);
    }
}

/**
 * Performs all actions needed to be done when the delete button
 * is pressed. Removing the stop watch from the dom
 * 
 * @param {Array<StopWatch>} stopWatchList - list of all spawned stop watches on the
 * webpage
 * @param {!HTMLElement} separationBar - reference to the html element
 * for representing a separation bar.
 * @param {!object|!HTMLElement} selectedWatch - either an instance
 * as stop watch or the reference to the delete icon in the dom 
 * @returns {void} 
 */
export function actionBtnDelete(stopWatchList, separationBar, selectedWatch ) {
    let index = -1;

    if ( selectedWatch.constructor.name === "HTMLElement") {
        index = stopWatchList.findIndex(
            stopWatch => 
            selectedWatch === stopWatch.trashBtn
        )
        
    } else {
        index = stopWatchList.indexOf(selectedWatch);
    }
    

    if (index !== -1) {
        stopWatchList[index].remove();
        stopWatchList.splice(index, 1);                                            
        if (stopWatchList.length === 0) {
            toggleVisibility(separationBar, false);
        } 
    }
}


/**
 * Performs all actions needed to be done when the trash all button
 * is pressed. Removing the all stop watches from the webpage
 * 
 * @param {!HTMLElement} separationBar - reference to the html element
 * for representing a separation bar.
 * @param {Array<StopWatch>} stopWatchList - list of all spawned stop watches on the
 * webpage
 * 
 */
export function actionBtnDeleteAll(separationBar, stopWatchList) {
    for (const stopWatch of stopWatchList) {            
        stopWatch.remove();                                            
    }
    stopWatchList.length = 0;
    
    toggleVisibility(separationBar, false);    
}
