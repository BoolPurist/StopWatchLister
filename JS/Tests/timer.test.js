const module = require("../Modules/Timer.js");

describe("Unit test for the es6 module Timer.js", () => {

    let dataParameterConstructor = [
        {Seconds: null, Minutes: null, Hours: null},
        {Seconds: -9, Minutes: 5, Hours: -2}, 
        {Seconds: -9, Minutes: 5, Hours: null}
    ];

    test.each(dataParameterConstructor)(
        `Testing Constructor and Set/Get for time unit.`,
        (testObject) => {
        const {Seconds, Minutes, Hours} = testObject;
        let instance;
        
        if (Seconds === null && Minutes === null && Hours === null) {
            instance = new module.Timer();
            testObject = {Seconds: 0, Minutes: 0, Hours: 0};            
        }
        else if (Hours === 0) {
            instance = new module.Timer(Seconds, Minutes, 0);
            testObject = {Seconds: Seconds, Minutes: Minutes, Hours: 0};  
        } else {
            instance = new module.Timer(Seconds, Minutes, Hours);
        }
        
        let actual = {Seconds: instance.Seconds, Minutes: instance.Minutes, Hours: instance.Hours};
            
        expect(actual).toEqual(testObject);
        }
    );

    
    test("Testing getter TimeStamp", () => {
        let instance = new module.Timer(2, 0, 4);
        let actual = instance.TimeStamp;
        expect(actual).toBe("4:0:2");
    })
    
    test.each(
    [
        [1, {seconds: 0, minutes: 0, hours: 0}, {seconds: 1, minutes: 0, hours: 0}],        
        [59, {seconds: 0, minutes: 0, hours: 0}, {seconds: 59, minutes: 0, hours: 0}],        
        [60, {seconds: 0, minutes: 0, hours: 0}, {seconds: 0, minutes: 1, hours: 0}],        
        [10, {seconds: 59, minutes: 0, hours: 0}, {seconds: 9, minutes: 1, hours: 0}],
        [300, {seconds: 30, minutes: 0, hours: 0}, {seconds: 30, minutes: 5, hours: 0}],
        [1, {seconds: 59, minutes: 59, hours: 0}, {seconds: 0, minutes: 0, hours: 1}],
    ]
    )("Testing _incrementSeconds method with (%i).", (
            increment, inputTime, expectedTime
        ) => {
        const {seconds, minutes, hours} =  inputTime;

        let instance = new module.Timer(seconds, minutes, hours);
        
        for (let i = 0; i < increment; i++) {
            instance._incrementSeconds();
        }

        expect( {
                seconds: instance.Seconds,
                minutes: instance.Minutes, 
                hours: instance.Hours
            } ).toEqual(expectedTime);
    })
}) 
