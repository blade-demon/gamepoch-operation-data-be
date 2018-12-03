var fs = require('fs');

fs.appendFile('./test.txt', '123','utf-8', function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("Done!");
    }
})