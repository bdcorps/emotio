var express = require('express');

var cfenv = require('cfenv');
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var util = require('util');

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

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
    console.log(process.env);
    res.render('main.ejs');
});

app.post('/getstarted', function(req, res) {
    var upload = multer({
        storage: storage
    }).single('upl')
    upload(req, res, function(err) {
        if (req.file != null && req.body.imageurl != "") {
            submitURL(req.body.imageurl, res);

        } else if (req.file != null) {
            submitFile(res);

        } else if (req.body.imageurl != "") {
            submitURL(req.body.imageurl, res);

        } else if (req.file == null && req.body.imageurl == "") {
            res.render('getstarted.ejs', {
                classifyLabel: "Specify an Image URL or choose an Image file",
                uploadedImage: 'image'
            });
        }
    })
})

function submitURL(url, res) {
    var visual_recognition = new VisualRecognitionV3({
        api_key: '16a616ca2498eb685a5b5c9bee70511cba2ae2f',
        version_date: VisualRecognitionV3.VERSION_DATE_2016_05_20
    });

    var params = {
        // images_file: fs.createReadStream('./uploads/upl.jpg'),
        url: url,
        classifier_ids: ['emotio']
    };
    visual_recognition.classify(params, function(err, result) {
        if (err) {
            res.render('getstarted.ejs', {
                classifyLabel: err,
                uploadedImage: 'error'
            });
        } else {
            res.render('getstarted.ejs', {
                classifyLabel: JSON.stringify(result, null, 2),
                uploadedImage: url
            });
        }
    });
}

function submitFile(res) {
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
            res.render('getstarted.ejs', {
                classifyLabel: err,
                uploadedImage: 'image'
            });
        } else {
            res.render('getstarted.ejs', {
                classifyLabel: JSON.stringify(result, null, 2),
                uploadedImage: 'image'
            });
        }
    });
}


app.get('/getstarted', function(req, res) {
    res.render('getstarted.ejs', {
        classifyLabel: 'no response',
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
