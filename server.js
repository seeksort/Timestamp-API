var http = require('http');
var url = require('url');
var fs = require('fs');

var $PORT = process.env.PORT || 3000;
var server = http.createServer(handleRequest);
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var unixTime, naturalTime;

function handleRequest(req, res) {
    var urlParts = url.parse(req.url);
    // Determine if first part of search term is in months array, this determines how to handle the timestamp processing
    var searchTerm = new RegExp(urlParts.pathname.slice(1,3), 'i');
    var match = '';
    months.forEach(function(item, index){
        var a = item.search(searchTerm);
        if (a > -1) {
            match = months[index];
        }
    });
    //Direct to main page
    if ((urlParts.pathname === '/') || (urlParts.pathname === '')){
        fs.readFile('index.html', function(err, data) {
            if (err) {
                console.log(err);
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    }
    // Processes pathname differently if user entered natural language or unix
    else {
        if (match !== '') {
            var dateStrArray = urlParts.pathname.slice(1).split('%20');
            var month = match;
            var day = dateStrArray[1];
            var year = dateStrArray[2];
            if (day.slice(-1) === ',') {
                day = day.slice(0,-1);
            }
            unixTime = new Date(parseInt(year), months.indexOf(month), parseInt(day));
            naturalTime = month + ' ' + day + ', ' + year;
        }
        else {
            var timeStr = parseInt(urlParts.pathname.slice(1)) * 1000;
            unixTime = new Date(timeStr);
            naturalTime = months[unixTime.getMonth()] + ' ' + unixTime.getDate() + ', ' + unixTime.getFullYear();
        }
        var timestampObj = {"unix": unixTime.getTime()/1000, "natural": naturalTime};
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(JSON.stringify(timestampObj));
    }
}

server.listen($PORT, function(err) {
    if (err) throw err;
    else {
        console.log('server listening on port: ' + $PORT);
    }
});