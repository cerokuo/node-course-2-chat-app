
var moment = require('moment');


var createdAt = 1234;
var date = moment(createdAt);


var date = moment(createdAt);

var someTimeStamp = moment().valueOf();
console.log(someTimeStamp);

console.log(date.format('LT'));
console.log(date.format('h:mm a'));
