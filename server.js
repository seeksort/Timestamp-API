var http = require('http');
var url = require('url');
var fs = require('fs');

var PORT = 3000;

var server = http.createServer(handleRequest);

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function handleRequest(req, res) {
    var newObj = {
        "unix": "",
        "natural": ""
    }
    var urlParts = url.parse(req.url);
    var searchTerm = new RegExp(urlParts.pathname.slice(1,3), 'i');
    var match = '';
    months.forEach(function(item, index){
        var a = item.search(searchTerm);
        if (a > -1) {
            match = months[index];
        }
    });

    if ((urlParts.pathname === '/') || (urlParts.pathname === '')){
        fs.readFile('index.html', function(err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('success')
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    }
    else if (match !== '') {
        console.log('path 1')
        var dateStrArray = urlParts.pathname.slice(1).split('%20');
        var month = match;
        var day = dateStrArray[1];
        var year = dateStrArray[2];
        if (day.slice(-1) === ',') {
            day = day.slice(0,-1);
        }
        var tempTime = new Date(parseInt(year), months.indexOf(month), parseInt(day));
        var naturalTime = month + ' ' + day + ', ' + year;
        console.log(tempTime)
        console.log(tempTime.getTime()/1000)
        newObj["unix"] = tempTime.getTime()/1000;
        newObj["natural"] = naturalTime;
        console.log(newObj)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<div>'+JSON.stringify(newObj)+'</div>');
        console.log(JSON.stringify(newObj));
    }
    else {
        console.log('path 2')
        var timeStr = parseInt(urlParts.pathname.slice(1)) * 1000;
        var tempTime = new Date(timeStr);
        var naturalTime = "";
        naturalTime += months[tempTime.getMonth()] + ' ' + tempTime.getDate() + ', ' + tempTime.getFullYear();
        newObj["unix"] = tempTime.getTime()/1000;
        newObj["natural"] = naturalTime;
        console.log(newObj)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<div>'+JSON.stringify(newObj)+'</div>');
        console.log(JSON.stringify(newObj));
    }
}

server.listen(PORT, function(err) {
    if (err) throw err;
    else {
        console.log('server listening on port: ' + PORT);
    }
});