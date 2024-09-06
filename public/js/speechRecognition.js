'use strict';

if (isMobileDevice) {
    setTimeout(() => {
        document.querySelector('#captionTheme').click();
    }, 5000);
}

const langs = [
    ['Afrikaans', ['af-ZA']],
    ['Bahasa Indonesia', ['id-ID']],
    ['Bahasa Melayu', ['ms-MY']],
    ['Català', ['ca-ES']],
    ['Čeština', ['cs-CZ']],
    ['Deutsch', ['de-DE']],
    [
        'English',
        ['en-US', 'United States'],
        ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-NZ', 'New Zealand'],
        ['en-ZA', 'South Africa'],
        ['en-GB', 'United Kingdom'],
        ['en-NG', 'Nigeria'],
        ['en-GH', 'Ghana'],
        ['en-KE', 'Kenya'],
    ],
    [
        'Español',
        ['es-AR', 'Argentina'],
        ['es-BO', 'Bolivia'],
        ['es-CL', 'Chile'],
        ['es-CO', 'Colombia'],
        ['es-CR', 'Costa Rica'],
        ['es-EC', 'Ecuador'],
        ['es-SV', 'El Salvador'],
        ['es-ES', 'España'],
        ['es-US', 'Estados Unidos'],
        ['es-GT', 'Guatemala'],
        ['es-HN', 'Honduras'],
        ['es-MX', 'México'],
        ['es-NI', 'Nicaragua'],
        ['es-PA', 'Panamá'],
        ['es-PY', 'Paraguay'],
        ['es-PE', 'Perú'],
        ['es-PR', 'Puerto Rico'],
        ['es-DO', 'República Dominicana'],
        ['es-UY', 'Uruguay'],
        ['es-VE', 'Venezuela'],
    ],
    ['Euskara', ['eu-ES']],
    ['Français', ['fr-FR']],
    ['Galego', ['gl-ES']],
    ['Hrvatski', ['hr_HR']],
    ['IsiZulu', ['zu-ZA']],
    ['Íslenska', ['is-IS']],
    ['Italiano', ['it-IT', 'Italia'], ['it-CH', 'Svizzera']],
    ['Magyar', ['hu-HU']],
    ['Nederlands', ['nl-NL']],
    ['Norsk bokmål', ['nb-NO']],
    ['Polski', ['pl-PL']],
    ['Português', ['pt-BR', 'Brasil'], ['pt-PT', 'Portugal']],
    ['Română', ['ro-RO']],
    ['Slovenčina', ['sk-SK']],
    ['Suomi', ['fi-FI']],
    ['Svenska', ['sv-SE']],
    ['Türkçe', ['tr-TR']],
    ['български', ['bg-BG']],
    ['Pусский', ['ru-RU']],
    ['Српски', ['sr-RS']],
    ['한국어', ['ko-KR']],
    [
        '中文',
        ['cmn-Hans-CN', '普通话 (中国大陆)'],
        ['cmn-Hans-HK', '普通话 (香港)'],
        ['cmn-Hant-TW', '中文 (台灣)'],
        ['yue-Hant-HK', '粵語 (香港)'],
    ],
    ['日本語', ['ja-JP']],
    ['Lingua latīna', ['la']],
];

const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionLanguage = getId('recognitionLanguage');
const recognitionDialect = getId('recognitionDialect');

let isWebkitSpeechRecognitionSupported = false;
let recognitionRunning = false;
let isPersistentMode = false;
let isPersistent = false;
let recognition;

if (speechRecognition) {
    handleRecognitionLanguages();
    // init webkitSpeechRecognition...
    recognition = new speechRecognition();
    recognition.maxAlternatives = 1;
    recognition.continuous = true;
    recognition.lang = recognitionDialect.value;

    recognition.onstart = function () {
        console.log('Speech recognition started');
        elemDisplay(speechRecognitionStart, false);
        elemDisplay(speechRecognitionStop, true, 'block');
        setColor(speechRecognitionIcon, 'lime');
        !isPersistentMode ? userLog('toast', 'TSpeech recognition started') : (isPersistent = true);
    };

    // Detect the said words
    recognition.onresult = (e) => {
        let current = e.resultIndex;
        // Get a transcript of what was said.
        let transcript = e.results[current][0].transcript;
        if (transcript) {
            let config = {
                type: 'speech',
                room_id: roomId,
                peer_name: myPeerName,
                text_data: transcript,
                time_stamp: new Date(),
            };
            // save also my speech to text
            handleSpeechTranscript(config);
            sendToDataChannel(config);
        }
    };

    recognition.onaudiostart = () => {
        console.log('Speech recognition start to capture your voice');
    };

    recognition.onaudioend = () => {
        console.log('Speech recognition stop to capture your voice');
    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error', event.error);
        if (!isPersistent || !isPersistentMode) userLog('toast', `Transcription error ${event.error}`, 6000);
    };

    recognition.onend = function () {
        console.log('Speech recognition stopped');
        // if (recognitionRunning) recognition.start();
        elemDisplay(speechRecognitionStop, false);
        elemDisplay(speechRecognitionStart, true, 'block');
        setColor(speechRecognitionIcon, 'white');
        // Prevent stopping in the absence of speech...
        if (isPersistentMode && isPersistent && recognitionRunning) {
            setTimeout(() => {
                startSpeech();
            }, 2000);
        } else {
            isPersistent = false;
            userLog('toast', 'Speech recognition stopped');
        }
    };

    isWebkitSpeechRecognitionSupported = true;
    console.info('00. Browser supports webkitSpeechRecognition');
} else {
    console.warn(
        'This browser not supports webkitSpeechRecognition, check out supported browsers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#browser_compatibility',
    );
}

/**
 * Update speech recognition country
 */
function updateCountry() {
    for (let i = recognitionDialect.options.length - 1; i >= 0; i--) {
        recognitionDialect.remove(i);
    }
    let list = langs[recognitionLanguage.selectedIndex];
    for (let i = 1; i < list.length; i++) {
        recognitionDialect.options.add(new Option(list[i][1], list[i][0]));
    }
    recognitionDialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

/**
 * Handle recognition languages
 */
function handleRecognitionLanguages() {
    for (let i = 0; i < langs.length; i++) {
        recognitionLanguage.options[i] = new Option(langs[i][0], i);
    }
    recognitionLanguage.selectedIndex = 6;
    updateCountry();
    recognitionLanguage.addEventListener('change', () => {
        updateCountry();
    });
}

/**
 * Start speech recognition
 */
function startSpeech() {
    try {
        isPersistent = true;
        isPersistentMode = true;
        recognitionRunning = true;
        recognition.lang = recognitionDialect.value;
        recognitionSelectDisabled(true);
        recognition.start();
    } catch (error) {
        console.error('Speech recognition start error', error);
    }
}

/**
 * Stop speech recognition
 */
function stopSpeech() {
    isPersistent = false;
    isPersistentMode = false;
    recognitionRunning = false;
    recognitionSelectDisabled(false);
    recognition.stop();
}

/**
 * Disable recognition select options
 * @param {boolean} disabled
 */
function recognitionSelectDisabled(disabled = false) {
    recognitionLanguage.disabled = disabled;
    recognitionDialect.disabled = disabled;
}




/***** Google Cloud Speech Node Socket *****/



//  Google Cloud Speech Playground with node.js and socket.io
//  Created by Vinzenz Aubry for sansho 24.01.17
//  Feel free to improve!
//  Contact: v@vinzenzaubry.com

//connection to socket
const speechSocket = io.connect(':1337');

//================= CONFIG =================
// Stream Audio
let bufferSize = 2048,
    AudioContext,
    context,
    processor,
    input,
    globalStream;

//vars
let audioElement = document.querySelector('audio'),
    finalWord = false,
    resultText = document.getElementById('ResultText'),
    removeLastSentence = true,
    streamStreaming = false;

//audioStream constraints
const constraints = {
    audio: true,
    video: false,
};

//================= RECORDING =================

async function initRecording() {
    speechSocket.emit('startGoogleCloudStream', ''); //init socket Google Speech Connection
    speechSocket.emit('setLanguageCode', recognitionDialect.value);
    streamStreaming = true;
    AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext({
        // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
        latencyHint: 'interactive',
    });

    await context.audioWorklet.addModule('../js/recorderWorkletProcessor.js')
    context.resume();

    globalStream = await navigator.mediaDevices.getUserMedia(constraints)
    input = context.createMediaStreamSource(globalStream)
    processor = new window.AudioWorkletNode(
        context,
        'recorder.worklet'
    );
    processor.connect(context.destination);
    context.resume()
    input.connect(processor)
    processor.port.onmessage = (e) => {
        const audioData = e.data;
        microphoneProcess(audioData)
    }
}

function microphoneProcess(buffer) {
    speechSocket.emit('binaryData', buffer);
}

//================= INTERFACE =================
var startButton = document.getElementById('startRecButton');
startButton.addEventListener('click', startRecording);

var endButton = document.getElementById('stopRecButton');
endButton.addEventListener('click', stopRecording);
endButton.disabled = true;

var recordingStatus = document.getElementById('recordingStatus');

function startRecording() {
    startButton.disabled = true;
    endButton.disabled = false;
    recordingStatus.style.visibility = 'visible';
    initRecording();
}

function stopRecording() {
    // waited for FinalWord
    startButton.disabled = false;
    endButton.disabled = true;
    recordingStatus.style.visibility = 'hidden';
    streamStreaming = false;
    speechSocket.emit('endGoogleCloudStream', '');

    let track = globalStream.getTracks()[0];
    track.stop();

    input.disconnect(processor);
    processor.disconnect(context.destination);
    context.close().then(function () {
        input = null;
        processor = null;
        context = null;
        AudioContext = null;
        startButton.disabled = false;
    });

    // context.close();

    // audiovideostream.stop();

    // microphone_stream.disconnect(script_processor_node);
    // script_processor_node.disconnect(audioContext.destination);
    // microphone_stream = null;
    // script_processor_node = null;

    // audiovideostream.stop();
    // videoElement.srcObject = null;
}

//================= SOCKET IO =================
speechSocket.on('connect', function (data) {
    console.log('connected to socket');
    speechSocket.emit('joinSpeechRecognition', 'Server Connected to Client');
});

speechSocket.on('messages', function (data) {
    console.log(data);
});

speechSocket.on('speechData', function (data) {
    // console.log(data.results[0].alternatives[0].transcript);
    var dataFinal = undefined || data.results[0].isFinal;

    if (dataFinal === false) {
        // console.log(resultText.lastElementChild);
        if (removeLastSentence) {
            resultText.lastElementChild.remove();
        }
        removeLastSentence = true;

        //add empty span
        let empty = document.createElement('span');
        resultText.appendChild(empty);

        //add children to empty span
        let edit = addTimeSettingsInterim(data);

        for (var i = 0; i < edit.length; i++) {
            resultText.lastElementChild.appendChild(edit[i]);
            resultText.lastElementChild.appendChild(
                document.createTextNode('\u00A0')
            );
        }
    } else if (dataFinal === true) {
        resultText.lastElementChild.remove();

        //add empty span
        let empty = document.createElement('span');
        resultText.appendChild(empty);

        //add children to empty span
        let edit = addTimeSettingsFinal(data);
        let editText = '';
        for (var i = 0; i < edit.length; i++) {
            if (i === 0) {
                edit[i].innerText = capitalize(edit[i].innerText);
            }
            resultText.lastElementChild.appendChild(edit[i]);
            editText += edit[i].innerText + '&nbsp;';

            if (i !== edit.length - 1) {
                resultText.lastElementChild.appendChild(
                    document.createTextNode('\u00A0')
                );
            }
        }
        let transcript = editText;
        let recognitionLang = recognitionDialect.value;
        if (transcript && transcript.length > 0) {
            let config = {
                type: 'speech',
                room_id: roomId,
                peer_name: myPeerName,
                text_data: transcript,
                time_stamp: new Date(),
                recognition_lang: recognitionLang,
            };
            // save also my speech to text
            handleSpeechTranscript(config);
            sendToDataChannel(config);
        }
        resultText.lastElementChild.appendChild(
            document.createTextNode('\u002E\u00A0')
        );

        console.log("Google Speech sent 'final' Sentence.");
        finalWord = true;
        endButton.disabled = false;

        removeLastSentence = false;
    }
});

//================= Juggling Spans for nlp Coloring =================
function addTimeSettingsInterim(speechData) {
    let wholeString = speechData.results[0].alternatives[0].transcript;
    console.log(wholeString);

    let nlpObject = nlp(wholeString).out('terms');

    let words_without_time = [];

    for (let i = 0; i < nlpObject.length; i++) {
        //data
        let word = nlpObject[i].text;
        let tags = [];

        //generate span
        let newSpan = document.createElement('span');
        newSpan.innerHTML = word;

        //push all tags
        for (let j = 0; j < nlpObject[i].tags.length; j++) {
            tags.push(nlpObject[i].tags[j]);
        }

        //add all classes
        for (let j = 0; j < nlpObject[i].tags.length; j++) {
            let cleanClassName = tags[j];
            // console.log(tags);
            let className = `nl-${cleanClassName}`;
            newSpan.classList.add(className);
        }

        words_without_time.push(newSpan);
    }

    finalWord = false;
    endButton.disabled = true;

    return words_without_time;
}

function addTimeSettingsFinal(speechData) {
    let wholeString = speechData.results[0].alternatives[0].transcript;

    let nlpObject = nlp(wholeString).out('terms');
    let words = speechData.results[0].alternatives[0].words;

    let words_n_time = [];

    for (let i = 0; i < words.length; i++) {
        //data
        let word = words[i].word;
        let startTime = `${words[i].startTime.seconds}.${words[i].startTime.nanos}`;
        let endTime = `${words[i].endTime.seconds}.${words[i].endTime.nanos}`;
        let tags = [];

        //generate span
        let newSpan = document.createElement('span');
        newSpan.innerHTML = word;
        newSpan.dataset.startTime = startTime;

        //push all tags
        for (let j = 0; j < nlpObject[i].tags.length; j++) {
            tags.push(nlpObject[i].tags[j]);
        }

        //add all classes
        for (let j = 0; j < nlpObject[i].tags.length; j++) {
            let cleanClassName = nlpObject[i].tags[j];
            // console.log(tags);
            let className = `nl-${cleanClassName}`;
            newSpan.classList.add(className);
        }

        words_n_time.push(newSpan);
    }

    return words_n_time;
}

window.onbeforeunload = function () {
    if (streamStreaming) {
        speechSocket.emit('endGoogleCloudStream', '');
    }
};


//================= SANTAS HELPERS =================

// sampleRateHertz 16000 //saved sound is awefull
function convertFloat32ToInt16(buffer) {
    let l = buffer.length;
    let buf = new Int16Array(l / 3);

    while (l--) {
        if (l % 3 == 0) {
            buf[l / 3] = buffer[l] * 0xffff;
        }
    }
    return buf.buffer;
}

function capitalize(s) {
    if (s.length < 1) {
        return s;
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
}