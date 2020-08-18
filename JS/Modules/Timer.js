class Timer {

    constructor(seconds = 0, minutes = 0, hours = 0) {

        const wantedType = "number";

        if ( seconds === null || minutes === null || hours === null ) {
            throw new TypeError('Constructor does not take a parameter which is null.');
        } else if (
            typeof(seconds) !== wantedType || typeof(minutes) !== wantedType || 
            typeof(hours) !== wantedType
            )  {
            throw new TypeError(
                `Constructor does only take parameters of the type \"${wantedType}\"`
            );
        } else if (seconds < 0 || minutes < 0 || hours < 0) {
            throw new RangeError("Constructor does not take negative numeric parameters");
        }   else {
            this._seconds = seconds;
            this._minutes = minutes;
            this._hours = hours;
            this._intervalId = null;
        }
                
    }

    get Seconds() {
        return this._seconds;
    }
    get Minutes() {
        return this._minutes;
    }
    get Hours() {
        return this._hours;
    }

    get TimeStamp() {
        return `${this._hours}:${this._minutes}:${this._seconds}`;
    }

    activate() {
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    resetTimer() {
        this._seconds = 0;
        this._minutes = 0;
        this._hours = 0;

        this.stopTimer();
    }

    _incrementSeconds () {
        this._seconds++;
        this._seconds %= 60;
        
        if (this._seconds === 0) this._incrementMinutes();         
    }

    _incrementMinutes () {
        this._minutes++;
        this._minutes %= 60;

        if (this._minutes === 0) this._hours++;;
    }

    startTimer() {
        this._intervalId = setInterval(() => {
           this._incrementSeconds(); 
        }, 1000);
    }

    stopTimer() {
        if (this._intervalId !== null) {
            clearInterval(this._intervalId);
            this._intervalId = null;
        }
    }    

}


export {Timer};