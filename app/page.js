"use client"; // This is a client component

import React, { useState } from 'react';
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import AudioButton from './_components/AudioButton';
import VoiceRecorder from './_components/VoiceRecorder';

export default function Home() {
  // for translation
  const [textRussian, setTextRussian] = useState('');
  const [textTranstatedToEnglish, setTextTranstatedToEnglish] = useState('');
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  // for text-to-speech
  const [textEng, setTextEng] = useState('');
  // we save Audio object separate for Google and AWS
  const [audioGoogle, setAudioGoogle] = useState(null);
  const [audioAWS, setAudioAWS] = useState(null);
  // state for play/stop
  const [audioPlaying, setAudioPlaying] = useState(null);

  // Function to send Russian text to openAI API for translation and summarization
  const handleRusTextSubmit = async () => {
    setTextTranstatedToEnglish('');
    setIsLoadingTranslation(true);
    const response = await fetch('/api/translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textRussian }),
    })
    const data = await response.json();
    setTextTranstatedToEnglish(data.item);
    setIsLoadingTranslation(false);
  };

  // function to send English text to Google API for text to speech
  const handleEngTextSubmitGoogle = async () => {
    const respone = await fetch('/api/speech/google?mode=TTS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textEng })
    })
    const data = await respone.json();
    setAudioGoogle(new Audio('/audio/output-google.mp3?v=' + Date.now()));
  }

  // function to send English text to AWS API for text to speech
  const handleEngTextSubmitAWS = async () => {
    const respone = await fetch('/api/speech/aws-polly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textEng })
    })
    if (!respone.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await respone.json();
    setAudioAWS(new Audio('/audio/output-aws.mp3?v=' + Date.now()));
  }

  // function toggle play/stop 
  const handlePlayStop = (sourceType) => {
    if (!audioPlaying) {
      // if no audio is playing, play the audio of the sourceType
      setAudioPlaying(sourceType);
      sourceType === 'google' ? audioGoogle.play() : audioAWS.play();
    }
    else if (audioPlaying === sourceType) {
      setAudioPlaying(null);
      sourceType === 'google' ? audioGoogle.pause() : audioAWS.pause();
    } else {
      setAudioPlaying(sourceType);
      if (sourceType === 'google') {
        audioGoogle.play();
        audioAWS.pause();
      } else {
        audioAWS.play();
        audioGoogle.pause();
      }
    }
  }



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="relative flex flex-col items-center justify-center w-full max-w-5xl h-full px-4 mx-auto mt-24 lg:mt-0 lg:px-0 lg:flex-row">
        <div className="card flex flex-col items-center justify-center w-full h-full p-8 bg-white rounded-xl shadow-lg dark:bg-neutral-800">

          <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
            Exploring APIs  of openAI, AWS and Google
          </h2>

          <hr className="my-4 border-gray-300 dark:border-neutral-700" />

          <h3 className="mb-4 text-1xl font-semibold text-left text-gray-800 dark:text-gray-100">
            Enter text in Russian for translation and summarization.
          </h3>
          <div className="flex items-center justify-center w-full h-full">
            <textarea
              type="text"
              className="flex-1 h-50 px-4  text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
              placeholder="Enter text in Russian / Введите текст на русском"
              rows={5}
              value={textRussian}
              onChange={(e) => setTextRussian(e.target.value)}
            />

            <button
              className="button-translate-into-english flex items-center justify-center w-1/6 h-10 ml-4 text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline"
              onClick={handleRusTextSubmit}
            > Submit </button>
          </div>

          <div className="flex flex-col justify-center w-full h-full mt-4">
            <div className="flex-1 h-10 px-4  text-base text-left font-bold text-gray-700 placeholder-gray-600 focus:shadow-outline">
              Summarized translation (by openAI):
            </div>
            {isLoadingTranslation ?
              <>
                <Skeleton count={2} />
              </>
              :
              <div className="flex-1 h-10 px-4 italic text-base text-gray-700 placeholder-gray-600 focus:shadow-outline">
                {textTranstatedToEnglish}
              </div>

            }
          </div>


          <hr className="my-4 border-gray-300 dark:border-neutral-700" />

          <h3 className="mb-4 text-1xl font-semibold text-left text-gray-800 dark:text-gray-100">
            Text to voice options.
          </h3>

          <div className="flex items-center justify-center w-full h-full">
            <input
              type="text"
              className="flex-1 h-10 px-4  text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
              placeholder="Enter your text to convert to speech"
              value={textEng}
              onChange={(e) => setTextEng(e.target.value)}
            />

            <button
              className="flex items-center justify-center w-1/6 h-10 ml-4 text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline"
              onClick={(e) => { handleEngTextSubmitGoogle(); handleEngTextSubmitAWS(); }}
            >
              Submit
            </button>
          </div>

          <div className="cards flex flex-col justify-center w-full h-full mt-4 md:flex-row gap-4">

            <div className="card flex flex-col items-center justify-center w-full h-full p-8 bg-white rounded-xl shadow-lg">
              <AudioButton sourceTitle="Google" audioFileCreated={audioGoogle} isPlaying={audioPlaying === "google"} handlePlayStop={() => handlePlayStop("google")} />
            </div>

            <div className="card flex flex-col items-center justify-center w-full h-full p-8 bg-white rounded-xl shadow-lg">
              <AudioButton sourceTitle="AWS" audioFileCreated={audioAWS} isPlaying={audioPlaying === "aws"} handlePlayStop={() => handlePlayStop("aws")} />
            </div>
          </div>
          
          <hr className="my-4 border-gray-300 dark:border-neutral-700" />

          <h3 className="mb-4 text-1xl font-semibold text-left text-gray-800 dark:text-gray-100">
            Speech to text options.
          </h3>
          
          <div>
            <VoiceRecorder/>
          </div>
        </div>
      </div>



    </main>
  )
}
