'use strict';

const bars = getSlALL('.volume-bar');

let scriptProcessor = null;

/**
 * Check if audio context is supported
 * @returns {boolean}
 */
function isAudioContextSupported() {
    return !!(window.AudioContext || window.webkitAudioContext);
}

/**
 * Start to handle microphone volume indicator
 * @param {MediaStream} stream Media stream audio
 */
async function getMicrophoneVolumeIndicator(stream) {
    if (isAudioContextSupported() && hasAudioTrack(stream)) {
        stopMicrophoneProcessing();
        console.log('Start microphone volume indicator for audio track', stream.getAudioTracks()[0]);
        const audioContext = new (window.AudioContext || window.webkitAudioContext)({sampleRate: 16000});
        const microphone = audioContext.createMediaStreamSource(stream);

        let compressor, mediaStreamSource;

        const highPassFilter = audioContext.createBiquadFilter();
        highPassFilter.type = 'highpass';
        highPassFilter.frequency.value = 300; // 300Hz 이하 제거
        microphone.connect(highPassFilter);

        const lowPassFilter = audioContext.createBiquadFilter();
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.value = 3400; // 3400Hz 이상 제거
        highPassFilter.connect(lowPassFilter);

        compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -50; // 소리를 억제하는 데 필요한 최소 볼륨
        compressor.knee.value = 40;      // 압축이 부드럽게 시작되는 지점
        compressor.ratio.value = 12;     // 압축 비율 (높을수록 강한 압축)
        compressor.attack.value = 0.003; // 압축 시작까지의 지연 (초 단위)
        compressor.release.value = 0.25; // 압축 해제까지의 시간 (초 단위)

        lowPassFilter.connect(compressor);
        compressor.connect(audioContext.destination);

        mediaStreamSource = audioContext.createMediaStreamSource( stream );
        mediaStreamSource.connect( lowPassFilter );

        scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
        scriptProcessor.onaudioprocess = function (event) {
            const inputBuffer = event.inputBuffer.getChannelData(0);
            let sum = 0;
            for (let i = 0; i < inputBuffer.length; i++) {
                sum += inputBuffer[i] * inputBuffer[i];
            }
            const rms = Math.sqrt(sum / inputBuffer.length);
            const volume = Math.max(0, Math.min(1, rms * 10));
            const finalVolume = Math.round(volume * 100);
            if (myAudioStatus && finalVolume > 10) {
                const config = {
                    type: 'micVolume',
                    peer_id: myPeerId,
                    volume: finalVolume,
                };
                handleMyVolume(config);
                sendToDataChannel(config);
            }
            updateVolumeIndicator(volume);
        };
        microphone.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
    } else {
        console.warn('Microphone volume indicator not supported for this browser');
    }
}

/**
 * Stop microphone processing
 */
function stopMicrophoneProcessing() {
    console.log('Stop microphone volume indicator');
    if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor = null;
    }
}

/**
 * Update volume indicator
 * @param {number} volume
 */
function updateVolumeIndicator(volume) {
    const activeBars = Math.ceil(volume * bars.length);
    bars.forEach((bar, index) => {
        bar.classList.toggle('active', index < activeBars);
    });
}
