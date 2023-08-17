import { useState } from "react";
import * as TranscribeClient from '../_utils/transcribeClient'


const RecordButton = () => {
    
    const [transcribedText, setTranscribedText] = useState("")
    const [recording, setRecording] = useState(false)

    const onTranscriptionDataReceived = (data) => {
        setTranscribedText(data)
    }

    const handleStartRecordingStream = () => {
        recording ? stopRecording() : startRecording()
    }

    const handleClearText = () => {
        setTranscribedText("")
    }

    const startRecording = async () => {
        setTranscribedText("")
        const selectedLanguage = "en-US";
        setRecording(true)

        try {
            await TranscribeClient.startRecording(selectedLanguage, onTranscriptionDataReceived);
        } catch (error) {
            alert("An error occurred while recording: " + error.message);
            stopRecording();
        }
    };

    const stopRecording = function () {
        setRecording(false)
        TranscribeClient.stopRecording();
    };

    return (
        <>
            <div className="flex">
                <button
                    className={`button-translate-into-english flex items-center justify-center w-20 h-10 ml-10 text-gray-100 rounded-lg focus:outline-none focus:shadow-outline ${recording ? "bg-rose-600" : "bg-gray-800"} }`}
                    onClick={handleStartRecordingStream}
                > {recording ? "Stop" : "Record"}
                </button>

                <button
                    className="button-translate-into-english flex items-center justify-center w-20 h-10 ml-10 text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline"
                    onClick={handleClearText}
                > Clear
                </button>
            </div>
            

            <div className="flex-1 h-10 px-4  text-center text-gray-700 placeholder-gray-600 focus:shadow-outline pt-2">
                <p className="p-5 m-5 bg-gray-100 rounded-lg">{transcribedText}</p>
            </div>
        </>
    );
}

export default RecordButton;