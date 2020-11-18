class DelegateHolder {
    
    constructor() {
        // holds all attached callback functions
        this._callbacks = [];
    }

    /**
     * Attaches a callback functions to the instance. this callbacktion is then
     * executed whenever the the instance calls the function executeCallbacks
     *  
     * Whenever a callback function is executed, it is provided with on parameter
     * this parameter is a literal object with the property 
     * subscriber, subscriberArgs, invoker and invokerArgs
     * 
     * @param {!callbacktion} callback - callbackt function to be executed  
     * @param {?object} [subscriber=null] (optional) Provides the reference to the
     * instance as subscriber which attached the callback functions 
     * @param {...any} [subscriberArgs] - (optional) A collection of parameters
     * if more than one argument is provided the property args of the event object 
     * will be an list 
     * if only one argument is provided the property args will be this one parameter
     * if no argument is provided the property will be null 
     * @returns {void} 
     * @throws {TypeError} - if parameter callback is not of type "Function"
     * if parameter subscriberReference is not a nullable object 
     */
    addCallback(callback, subscriber = null, ...subscriberArgs) {
        _throwForInvalidCallback(callback);
        _throwForInvalidObjectRef(subscriber);
        
        this._callbacks.push(
            {
                callback, 
                subscriber,
                subscriberArgs: _convertArgsList(subscriberArgs)
            } 
        );
        
    }

    /**
     * Removes an added callback function so it is not executed anymore
     * when the function executeCallbacks is called
     * 
     * @param {callbacktion} callback - reference to an added callback function which is 
     * to be removed 
     * @returns {void} 
     */
    removeCallback(callback) {
        _throwForInvalidCallback(callback);

        const length = this._callbacks.length;
        
        for (let i = 0; i < length; i++ ) {

            if (this._callbacks[i].callback === callback) {

                this._callbacks.splice(i, 1);

                return;
            }
        }
    }

    /**
     * Removes all registered callback functions
     *  
     * @returns {void}
     */
    clearCallbacks() {
        this._callbacks = [];
    }

    /**
     * Meant to be executed by the invoker.
     * 
     * Executes all attached callback functions. Every callback function gets an event
     * object as one argument passed. 
     * 
     * The event object can be supplemented with invoker and invokerArgs 
     * via the paramter of this function
     *
     * @param {?object} [invoker=null] - (optional) Reference to the instance executing 
     * the callback functions which have been attached by subscriber
     * @param  {...any} invokerArgs - (optional) A collection of parameters
     * if more than one argument is provided the property args of the event object 
     * will be an list 
     * if only one argument is provided the property args will be this one parameter
     * if no argument is provided the property will be null 
     */
    _executeCallbacks(invoker = null ,...invokerArgs) {
        _throwForInvalidObjectRef(invoker);
        
        for (const callbackData of this._callbacks) {
                        
            const event = {
                invoker,
                invokerArgs: _convertArgsList(invokerArgs),
                subscriber: callbackData.subscriber,
                subscriberArgs: callbackData.subscriberArgs,
            };

            callbackData.callback.call(
                invoker,
                event
            );
        }
    }

}

function _throwForInvalidCallback(callback) {
    if (callback === null || typeof(callback) !== "function") {
        throw new TypeError(`
        Callback callbacktion must be of type "Function"
        `);
    }
}

function _throwForInvalidObjectRef(objectRef) {
    if (objectRef !== null && typeof objectRef !== "object") {
        throw new TypeError("Reference to object must be null or a reference to an object !");
    }
}

function _convertArgsList(argList){
    let argumentsForm = null;

    if (argList.length === 1) {
        argumentsForm = argList[0];
    } else if ( argList.length >= 2) {
        argumentsForm = argList;
    }

    return argumentsForm;
}

export { DelegateHolder };