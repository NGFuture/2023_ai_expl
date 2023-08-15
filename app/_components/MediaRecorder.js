
const MediaRecorder = () => {
    
    // Access user's microphone and start recording
    const mediaRecorder = MediaRecorder(navigator.mediaDevices.getUserMedia({ audio: true }));
    let recordedChunks = [];

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
        recordedChunks = [];

        const audioFile = new File([audioBlob], 'recorded_audio.wav', { type: 'audio/wav' });

        // Transcribe captured audio using Google Cloud Speech-to-Text API
        const audioBytes = await audioFile.arrayBuffer();
        const audioContent = Buffer.from(audioBytes);
    };

    // Start recording when a button is clicked
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', () => {
        mediaRecorder.start();
    });

    // Stop recording when a button is clicked
    const stopButton = document.getElementById('stopButton');
    stopButton.addEventListener('click', () => {
        mediaRecorder.stop();
    });

    return (
        <>
            <div className="flex-1 h-10 px-4  text-center text-gray-700 placeholder-gray-600 focus:shadow-outline pt-2">
                <p>{sourceTitle} text-to-speech output</p>
            </div>
            {audioFileCreated ?
                <button className="flex items-center justify-center w-1/6 h-10 text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline mt-2" onClick={handlePlayStop}>
                    {isPlaying ?
                        <PauseIcon className="h-6 w-6 text-gray-100" />
                        :
                        <PlayIcon className="h-6 w-6 text-gray-100" />
                    }
                </button>
                :
                <button className="flex items-center justify-center w-1/6 h-10 text-gray-100 bg-gray-400 rounded-lg focus:outline-none focus:shadow-outline mt-2" disabled>
                    <PlayIcon className="h-6 w-6 text-gray-100" />
                </button>
            }
        </>
    )
};

export default MediaRecorder;