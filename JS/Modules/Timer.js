class Timer {

    constructor(seconds = 0, minutes = 0, hours = 0) {
        this._seconds = seconds;
        this._minutes = minutes;
        this._hours = hours;
        this._active = false; 
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

    reset() {
        this._active = false;
        this._seconds = 0;
        this._minutes = 0;
        this._hours = 0;
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


    _startTimer() {
        // Implement setInterval().
    }

}

export {Timer};