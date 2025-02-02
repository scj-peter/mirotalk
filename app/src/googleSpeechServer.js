'use strict';

//  Google Cloud Speech Playground with node.js and socket.io
//  Created by Vinzenz Aubry for sansho 24.01.17
//  Feel free to improve!
//	Contact: v@vinzenzaubry.com

require('dotenv').config();
const googleTranslate = require('./googleTranslate');

const express = require('express'); // const bodyParser = require('body-parser'); // const path = require('path');
const cors = require('cors');

// Google Cloud
const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient(); // Creates a client

const app = express();
// const port = 1337; // process.env.PORT || 1337
const http = require('http');
const https = require('https');
const fs = require('fs');
const Logs = require("./logs");
const log = new Logs('server');

const path = require('path');
const isHttps = process.env.HTTPS == 'true'; // Use self-signed certificates instead of Certbot and Let's Encrypt

let server;

if (isHttps) {
    // Define paths to the SSL key and certificate files
    const keyPath = path.join(__dirname, '../ssl/key.pem');
    const certPath = path.join(__dirname, '../ssl/cert.pem');

    // Check if SSL key file exists
    if (!fs.existsSync(keyPath)) {
        log.error('SSL key file not found.');
        process.exit(1); // Exit the application if the key file is missing
    }

    // Check if SSL certificate file exists
    if (!fs.existsSync(certPath)) {
        log.error('SSL certificate file not found.');
        process.exit(1); // Exit the application if the certificate file is missing
    }

    // Read SSL key and certificate files securely
    const options = {
        key: fs.readFileSync(keyPath, 'utf-8'),
        cert: fs.readFileSync(certPath, 'utf-8'),
    };

    // Create HTTPS server using self-signed certificates
    server = https.createServer(options, app);
} else {
    server = http.createServer(app);
}

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use('/assets', express.static(__dirname + '/public'));
app.use('/session/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// =========================== ROUTERS ================================ //

app.get('/', function (req, res) {
    res.render('index', {});
});

app.use('/', function (req, res, next) {
    next(); // console.log(`Request Url: ${req.url}`);
});

// =========================== GOOGLE CLOUD SETTINGS ================================ //

// The encoding of the audio file, e.g. 'LINEAR16'
// The sample rate of the audio file in hertz, e.g. 16000
// The BCP-47 language code to use, e.g. 'en-US'
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const defaultLanguageCode = 'es-CL'; //en-US ko-KR
const request = {
    config: {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: defaultLanguageCode,
        profanityFilter: false,
        enableWordTimeOffsets: true,
        // enableAutomaticPunctuation: false,  // 자동 구두점 비활성화
        speechContexts: [{
            phrases: [
                "hola",
                "buenos días",
                "buenas tardes",
                "buenas noches",
                "¿cómo estás?",
                "hacer",
                "ir",
                "comer",
                "ver",
                "decir",
                "qué",
                "cuándo",
                "dónde",
                "por qué",
                "cómo",
                "rápido",
                "lento",
                "bien",
                "mal",
                "cerca",
                "cocina",
                "sala",
                "baño",
                "teléfono",
                "computador",
                "refrigerador",
                "coche",
                "autobús",
                "tren",
                "bicicleta",
                "calle",
                "tienda",
                "supermercado",
                "comprar",
                "precio",
                "descuento",
                "pan",
                "agua",
                "carne",
                "pescado",
                "fruta",
                "café",
                "té",
                "jugo",
                "vino",
                "sol",
                "lluvia",
                "viento",
                "frío",
                "calor",
                "feliz",
                "triste",
                "cansado",
                "emocionado",
                "enojado",
                "hora",
                "minuto",
                "segundo",
                "mañana",
                "tarde",
                "noche"
            ]
        }] // add your own speech context for better recognition
    },
    interimResults: true, // If you want interim results, set this to true
};

// =========================== SOCKET.IO ================================ //

io.on('connection', function (client) {
    console.log('Client Connected to server');
    let recognizeStream = null;

    client.on('joinSpeechRecognition', function () {
        client.emit('messages', 'Socket Connected to Server');
    });

    client.on('messages', function (data) {
        client.emit('broad', data);
    });

    client.on('translate', function (data) {
        const {text, peer_id} = JSON.parse(data);
        googleTranslate.translateText(
            text,
            request.config.languageCode == 'ko-KR' ? 'es' : 'ko'
        ).then(result => {
            client.emit('translated', {
                peer_id: peer_id,
                text: result,
            });
        });
    });

    client.on('setLanguageCode', function (data) {
        setLanguageCode(data);
    });

    client.on('startGoogleCloudStream', function (data) {
        startRecognitionStream(this, data);
    });

    client.on('endGoogleCloudStream', function () {
        stopRecognitionStream();
    });

    client.on('binaryData', function (data) {
        // console.log(data); //log binary data
        if (recognizeStream !== null) {
            recognizeStream.write(data);
        }
    });

    function setLanguageCode(langCode) {
        // Warn... fix const dictionary...
        request.config.languageCode = langCode;
    }

    function startRecognitionStream(client) {
        recognizeStream = speechClient
            .streamingRecognize(request)
            .on('error', console.error)
            .on('data', (data) => {
                process.stdout.write(
                    data.results[0] && data.results[0].alternatives[0]
                        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                        : '\n\nReached transcription time limit, press Ctrl+C\n'
                );
                client.emit('speechData', data);

                // if end of utterance, let's restart stream
                // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
                // if (data.results[0] && data.results[0].isFinal) {
                //     stopRecognitionStream();
                //     startRecognitionStream(client);
                    // console.log('restarted stream serverside');
                // }
            });
    }

    function stopRecognitionStream() {
        if (recognizeStream) {
            recognizeStream.end();
        }
        recognizeStream = null;
    }
});

module.exports = server;