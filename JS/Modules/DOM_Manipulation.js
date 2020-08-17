// <!-- html structure for StopWatch -->
// <div class="stop-watch">
//     <div class="stop-watch-row-label">
//         <p class="stop-watch-label-text">1. Stop-Watch</p>
//         <i class="trash-btn fas fa-trash-alt"></i>
//     </div>
//     <div class="stop-watch-row-timer">
//         <i class="play-btn fas fa-play"></i>
//         <p class="text-timer">23:54:02</p>
//     </div>
// </div>

export const createStopWatch  = (lable, timeString) => {

    
    // Construct a stop watch
    let stop_watch = _ConstructTagElementWithClass("div", "stop-watch");

    let stop_watch_row_label = _ConstructTagElementWithClass("div", "stop-watch-row-label"); 
        
    _ConstructAndAppendTagElementWithClass(stop_watch_row_label, "p", "stop-watch-label-text");
    _ConstructAndAppendTagElementWithClass(stop_watch_row_label, "i", "trash-btn fas fa-trash-alt");
    
    stop_watch.appendChild(stop_watch_row_label);

    let stop_watch_row_timer = _ConstructTagElementWithClass("div", "stop-watch-row-timer");
    
    _ConstructAndAppendTagElementWithClass(stop_watch_row_timer, "i", "play-btn fas fa-play");
    _ConstructAndAppendTagElementWithClass(stop_watch_row_timer, "p", "text-timer");
        
    stop_watch.appendChild(stop_watch_row_timer);

    // Populate the stop watch with data
    //stop_watch.querySelector(".stop-watch-label-text").textContent = lable;
    _PopulateDomElementWithTextContent(stop_watch,
        {querySelector: ".stop-watch-label-text", textContent: lable}
        );
    let textTimer = 
    _PopulateDomElementWithTextContent(stop_watch, 
        {querySelector: ".text-timer", textContent: timeString }
        );

    return stop_watch;
};

const _ConstructTagElementWithClass = (tagName, className) => {
    let tagElement = document.createElement(tagName);
    tagElement.classList = className;

    return tagElement;
}

const _ConstructAndAppendTagElementWithClass = (domElement,tagName, className) => {
    let tagElement = _ConstructTagElementWithClass(tagName, className);
    domElement.appendChild(tagElement);
}

const _PopulateDomElementWithTextContent = (domElement,...Data) => {
    Data.forEach(object => {
        const {querySelector, textContent} = object;
        domElement.querySelector(querySelector).textContent = textContent;
    })
}

export const RemoveStopWatchViaTrashButton = (trashButton) => {
    trashButton.parentNode.parentNode.remove();

}


export const testString = "Module 1";

