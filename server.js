var express = require('express');
var app = express();

function mongodbURI() {
  if (process.env.VCAP_SERVICES) {
    var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    for (var label in vcapServices) {
      var services = vcapServices[label];
      for (var index in services) {
        var uri = services[index].credentials.uri;
        if (uri.lastIndexOf("mongodb", 0) == 0) {
          return uri;
        }
      }
    }
  }
  console.log('No MongoDB service found at VCAP_SERVICES');
  return null;
}

var ParseServer = require('parse-server').ParseServer;
var parseServer = new ParseServer({
  databaseURI: process.env.MongoDB_URI || mongodbURI(),
  cloud: __dirname + '/cloud/main.js',
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  fileKey: process.env.FILE_KEY
});
app.use('/parse', parseServer);

app.get('/', function(req, res) {
  res.status(200).send('Nothing useful here!');
});

var port = process.env.PORT || 8080;
var server = app.listen(port, function() {
  console.log('Parse Server listening on port %s', port);
});
