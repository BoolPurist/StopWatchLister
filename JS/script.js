const _ = require('lodash');

const numbers = [33, 40, 40, 44, 32, 3];

_.each(numbers, function(number, i) {
    console.log(number);
});