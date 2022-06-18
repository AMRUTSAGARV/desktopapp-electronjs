//Buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;

const { desktopCapturer, remote } = require('electron');
const { Menu } = remote;


//get the available video sources
async function getVideoSources() {
    const inputSources = await desktopCapturer.getSources({
        types: ['window' , 'screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            };
        })
    );
    videoOptionsMenu.popup();
}

//media recorder instance to capture footage
let mediaRecorder;
const recordedChunkz = [];

//change the video sorce window to record
async function selectSource(source) {
    videoSelectBtn.innerText = source.name;

    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };

    //create a stream
    const stream = await navigator.mediaDevices
    .getUserMedia(constraints);

//preview the sorce in a video element
videoElement.srcObject = stream;
videoElement.play();


//create the media recorder
const options = { mimeType: 'video/webm; codecs=vp9'};
mediaRecorder = new MediaRecorder(stream, options);

mediaRecorder.ondataavailable = handleDataAvailable;
mediaRecorder.onstop = handleStop;

}

//captures all recorded chukz
function handleDataAvailable(e) {
    console.log('video data avilable');
    recordedChunkz.push(e.data)
}
const { dialog } = remote;
const { writeFile } = require('fs')

//Saves the video file on stop
async function handleStop(e) {
    const blob = new Blob(recordedChunkz, {
        type: 'video/webm; codecs=vp9'
    });
    const buffer = Buffer.from(await blob.arrayBuffer());

    const { filePath } = await dialog.showSaveDialog({
        bhttonLabel: 'save video',
        defaultPath: `vid-${Date.now()}.webm`
    });

    console.log(filePath);

    writeFile(filePath, buffer, () => console.log('video saved succesfully!'));
}
