const module = require("../Modules/Timer.js");
const Timer = module.Timer;

describe("Unit test for the es6 module Timer.js", () => {

    // Testing constructor and getter for Seconds, Minutes and Hours.
    test.each( [
        {Seconds: 0, Minutes: 0, Hours: 0},
        {Seconds: 9, Minutes: 5, Hours: 2}, 
        {Seconds: 18, Minutes: 5, Hours: 0}
    ] )(
        `Testing Constructor and Set/Get for time unit.`,
        (timeUnits) => {
        const {Seconds, Minutes, Hours} = timeUnits;
        let instance = new Timer(Seconds, Minutes, Hours);
                
        let actual = {Seconds: instance.Seconds, Minutes: instance.Minutes, Hours: instance.Hours};
            
        expect(actual).toEqual(timeUnits);
        }
    );

    // Testing throwing of exceptions of the constructor.
    test.each( [ 
        {seconds: null, minutes: undefined, hours: "2"},
        {seconds: 2, minutes: null, hours: 3},
        {seconds: "2", minutes: 1, hours: 88},
        {seconds: [328, 58], minutes:23, hours: 88},
    ] )(
        "Should throw TypError if one of the parameter for the constructor is null " +
        "or not number for constructor is invalid",
        (parametersWithWrongType) => {
            const {seconds, minutes, hours} = parametersWithWrongType;
            const actualConstructor = () => {
                new Timer(seconds, minutes, hours);
            };
            expect(actualConstructor).toThrow(TypeError);
        }
    );

    test.each( [
        {seconds: -2, minutes: 5, hours: 8},
        {seconds: -2, minutes: -5, hours: 8},
        {seconds: 2, minutes: 5, hours: -8},
        {seconds: -2, minutes: -5, hours: -8}
    ] )("Should throw if constructor gets a negative parameter", (negativeParameters) => {
        const {seconds, minutes, hours} = negativeParameters;

        const actualConstructor = () => {
            new Timer(seconds, minutes, hours);
        }
        
        expect(actualConstructor).toThrow(RangeError);
    });
    
    // Testing rest of getters and setters.
    test("Testing getter TimeStamp", () => {
        let instance = new Timer(2, 0, 4);
        let actualTimeStamp = instance.TimeStamp;
        expect(actualTimeStamp).toBe("4:0:2");
    });
    

    // Testing methods.

    test("Method resetTimer:Should be rested with seconds: 0, minutes: 0, hours: 0", () => {
        let instance = new Timer(8, 7, 10);
        const expectedTime = {seconds: 0, minutes: 0, hours: 0};

        instance.resetTimer();
        const actualTime = {
            seconds: instance.Seconds, minutes: instance.Minutes, hours: instance.Hours
        };

        expect(actualTime).toEqual(expectedTime);

    });

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

        let instance = new Timer(seconds, minutes, hours);
        
        for (let i = 0; i < increment; i++) {
            instance._incrementSeconds();
        }

        expect( {
                seconds: instance.Seconds,
                minutes: instance.Minutes, 
                hours: instance.Hours
            } ).toEqual(expectedTime);
    });
}) 
