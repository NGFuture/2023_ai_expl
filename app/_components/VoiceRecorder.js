import React, { useState, useEffect } from 'react';

const VoiceRecorder = () => {
    const [recorder, setRecorder] = useState(null)
    const [transcription, setTranscription] = useState("")
    let recordedChunks = [];

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
            let rec = new MediaRecorder(stream)
            rec.ondataavailable = event => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
        
            rec.onstop = async () => {
                const audioBlob = new Blob(recordedChunks, { type: 'audio/mp3' });
                recordedChunks = [];

                const audioBytes = await audioBlob.arrayBuffer();
                const audioContent = Buffer.from(audioBytes);
                const respone = await fetch('/api/speech/google?mode=S2Text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: audioContent.toString('base64') })
                })
                const data = await respone.json();
                console.log(data)
                setTranscription(data.data)
            };

            setRecorder(rec)
        })
        .catch(e => {
            console.log(e)
        })
    }, [])

    const start = () => {
        recorder.start()
    }

    const stop = () => {
        recorder.stop()
    }

    return (
        <>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
            {
                transcription ? <div>{transcription}</div> : null
            }
        </>
    )
};

export default VoiceRecorder;