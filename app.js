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
var util = require('util');

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

// create a new express server
var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads')
    },
    filename: function(req, file, callback) {
        console.log(file)
        callback(null, file.fieldname + ".jpg")
    }
})

app.get('/', function(req, res) {
    res.render('main.ejs');
});

app.post('/', function(req, res) {
    console.log(util.inspect(req.body))
    res.send('sdafc');
});

app.post('/getstarted', function(req, res) {


    var upload = multer({
        storage: storage
    }).single('upl')
    upload(req, res, function(err) {
        var visual_recognition = new VisualRecognitionV3({
            api_key: '87b5622939ff33ac0bd7a2909a4dd10650a07e7a',
            version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
        });

        var params = {
            images_file: fs.createReadStream('./uploads/upl.jpg'),
            classifier_ids: ['emotion']
        };

        visual_recognition.classify(params, function(err, result) {
            if (err) {
                /*console.log(err);
                res.send('classified ' + err);*/
                res.render('getstarted.ejs', {
                    classifyLabel: 'classified ' + err,
                    uploadedImage: 'image'
                });
            } else {
                /*console.log(JSON.stringify(result, null, 2));
                res.send('classified ' + JSON.stringify(result, null, 2));*/
                res.render('getstarted.ejs', {
                    classifyLabel: 'classified ' + JSON.stringify(result, null, 2),
                    uploadedImage: 'image'
                });
            }
        });
    })

    console.log(util.inspect(req.body))
})

app.get('/getstarted', function(req, res) {
    res.render('getstarted.ejs', {
        classifyLabel: 'nothing ',
        uploadedImage: 'image'
    });
});

app.get('/image', function(req, res) {
    res.sendFile(path.resolve('./uploads/upl.jpg'));
});

app.get('/classify', function(req, res) {


})

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});
