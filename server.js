var http = require("http");
var url  = require("url");
var fs   = require("fs");
var path = require("path");
var port = process.env.PORT || 8000;


var server = http.createServer(function(request, response) {

  var uri        = url.parse(request.url).pathname;
  var fileName   = path.join(process.cwd(), uri);
  var serverName = request.headers.host;
  var params     = url.parse(request.url, true).query; 
  var singleItem = -1;
  
  // which object fields to show in slimmed-down list views.
  
  var reductions = {
    "organisations" : ["id", "name"],
    "users" : ["id", "username", "forenames", "surname"],
    "datasets" : ["id", "organisation_id", "user_id", "name", "status"]
  };


  var getSimpleFilename = function(data){
      var start = data.lastIndexOf('/')+1;
      var end = data.lastIndexOf('.');
      if (end == -1){
        end = data.length;
      }
      var res = data.substring(start , end);
      return res;
  };


  var sfn = getSimpleFilename(fileName);
  if(sfn != 'favicon'){
    sfn = parseInt(sfn);    
  }


  if( typeof sfn == 'number' && !isNaN(sfn) ){
    var fNameParts =  fileName.split("/");
    fNameParts.pop();
    singleItem = sfn;
    fileName = fNameParts.join('/') + '.json';
  }
  
  fs.exists(fileName, function(exists) {    
  
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      console.log('File not found: ' + fileName);
      return;
    }

    function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    var contentType = {"Content-Type": "text/html"};
    
    if(endsWith(fileName, '.js')){
     contentType["Content-Type"] = "application/javascript";
    }
    if(endsWith(fileName, '.css')){
      contentType["Content-Type"] = "text/css";
    }
    if(fs.statSync(fileName).isDirectory()){
      fileName += 'index.html';
    }

    fs.readFile(fileName, "binary", function(err, file) {

      if(err) {
        console.log('Error reading ' + fileName + ': ' + err);  
        response.writeHead(500, contentType);
        response.write('Error reading file ' + fileName + ':\n\nserverName: ' + serverName + ', uri: ' + uri + ', params: ' + JSON.stringify(params));
        response.write(err + "\n");
        response.end();
        return;
      }
    
      response.writeHead(200, contentType);

      var regexExt    = /\.[0-9a-z]+$/i;
      var ext      = fileName.match(regexExt);
      var simpleName  = getSimpleFilename( fileName );
        
      if(ext == '.json'){
        var data  = require(fileName);
        var start = isNaN(parseInt(params.start)) ? null : parseInt(params.start);
        var rows  = isNaN(parseInt(params.rows))  ? null : parseInt(params.rows);

        if(data.length > 0){
          if(singleItem && singleItem >-1){
            if(data.length <= singleItem){
              response.write('invalid index');              
            }
            else{
              data = data[singleItem-1];
              response.write(JSON.stringify(data));
            }
          }
          else{
        	  
        	var reductionsObject = reductions[simpleName];
        	if(simpleName == 'users' && data.length > 0 && typeof data[0].fullname != 'undefined'){
        		console.log('override reductions for api data');
        		reductionsObject = ["id", "fullname", "email"];
        	}
        	    
        	  
            // sort
            var sortField  = params.sort;

            if(typeof(sortField) == 'string' ){            
              var sortFieldExists  = false;
                            
              //reductions[simpleName].forEach(function(fieldName) {
              reductionsObject.forEach(function(fieldName) {
                if(fieldName == sortField){
                  sortFieldExists = true;                
                }
              });

              if(sortFieldExists){
                var comparator = function (a,b) {
                  if(typeof data[0][sortField] == 'string'){
                    return a[sortField].localeCompare(b[sortField]);                  
                  }
                  else{
                    return parseInt(a[sortField]) - parseInt(b[sortField]);
                  }
                };
                data = data.sort(comparator);
              }
              else{
                data = '';
                response.write('Invalid sort field specified: ' + sortField);              
              }
            }

            // reverse 
              
            data = params.reverse == "true" ? data.reverse() : data;
      
            if(params.reverse == "true"){
              console.log('REVERSED');
            }
              
            if(start !== null && rows !== null){
      
              var reducedData = [];
    
              data = data.slice(start, start + rows);
              
              data.forEach(function(item) {
              
                var reducedItem = {};
            
                reductionsObject.forEach(function(fieldName) {
                  reducedItem[fieldName] = item[fieldName];
                });
              
                reducedData.push(reducedItem);
              });
              response.write(JSON.stringify( reducedData ));
            }
            else if(isNaN(parseInt(fileName.split("/").pop().split('.')[0]))){
              response.write('{"total":' + data.length + '}');
            }
            else{
              response.write(JSON.stringify(data));
            }            
          }
        }
      }
      else{
        response.write(file, "binary");
      }
      response.end();
    });
  });
}).listen(port);
 
console.log('Server running on port ' + server.address().port);

