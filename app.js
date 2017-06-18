/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var multer = require('multer'),
    bodyParser = require('body-parser'),
    path = require('path');

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

// create a new express server
var app = express();
app.use(bodyParser.json());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads')
    },
    filename: function(req, file, callback) {
        console.log(file)
        callback(null, file.fieldname + path.extname(file.originalname))
    }
})

app.post('/', function(req, res) {
    var upload = multer({
        storage: storage
    }).single('upl')
    upload(req, res, function(err) {


        var visual_recognition = new VisualRecognitionV3({
            api_key: '87b5622939ff33ac0bd7a2909a4dd10650a07e7a',
            version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
        });

        var params = {
            images_file: fs.createReadStream('./uploads/upl.jpg')
        };

        visual_recognition.classify(params, function(err, result) {
            if (err) {
                console.log(err);
                res.send('classified ' + err);
            } else {
                console.log(JSON.stringify(result, null, 2));
                res.send('classified ' + JSON.stringify(result, null, 2));
            }
        });
    })

})

app.get('/classify', function(req, res) {


})









// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});
