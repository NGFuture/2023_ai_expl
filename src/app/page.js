"use client"; // This is a client component

import React, { useEffect, useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import Skeleton from 'react-loading-skeleton';



export default function Home() {
  // for translation
  const [textRussian, setTextRussian] = useState('');
  const [textTranstatedToEnglish, setTextTranstatedToEnglish] = useState('');
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  // for text-to-speech
  const [textEng, setTextEng] = useState('');
  const [audioGoogle, setAudioGoogle] = useState('');
  const [audioAWS, setAudioAWS] = useState('');

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
    const respone = await fetch('/api/speech/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textEng })
    })
    const data = await respone.json();
    setAudioGoogle('/audio/output-google.mp3');
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
    setAudioAWS('/audio/output-aws.mp3');
  }

  // useEffect to play Google audio when play button is clicked
  useEffect(() => {
    const handlePlayGoogleAudio = () => {
      const audio = new Audio(audioGoogle);
      console.log(audioGoogle);
      audio.play();
    };

    const playButton = document.querySelector('.play-button-google');
    playButton.addEventListener('click', handlePlayGoogleAudio);

    return () => {
      playButton.removeEventListener('click', handlePlayGoogleAudio);
    };
  }, [audioGoogle]);


  // useEffect to play AWS audio when play button is clicked
  useEffect(() => {
    const handlePlayAWSAudio = () => {
      const audio = new Audio(audioAWS);
      audio.play();
    };

    const playButton = document.querySelector('.play-button-aws');
    playButton.addEventListener('click', handlePlayAWSAudio);

    return () => {
      playButton.removeEventListener('click', handlePlayAWSAudio);
    };
  }, [audioAWS]);


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
            {isLoadingTranslation &&
              <>
                {/* <div className="flex-1 h-10 px-4  text-base text-left text-gray-700 placeholder-gray-600 focus:shadow-outline">
                  Loading...
                </div> */}
                <Skeleton count={2} />
              </>
            }
            <div className="flex-1 h-10 px-4 italic text-base text-gray-700 placeholder-gray-600 focus:shadow-outline">
              {textTranstatedToEnglish}
            </div>
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

          {/* experementing with 2 colums style */}
          {/* <div className="container flex items-center justify-center w-full h-full mt-4 relative flex flex-col lg:flex-row " >
            <div className="card-container bg-white rounded-xl shadow-lg dark:bg-neutral-800">
              <div className="card flex-1 h-10 px-4  text-base text-gray-700 placeholder-gray-600 focus:shadow-outline pt-2 ">
                <p>Output by Google Cloud API</p>
              </div>
              <div className="play-button-aws flex items-center justify-center w-1/6 h-10 ml-4 text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline">
                <PlayIcon className="h-6 w-6 text-gray-100" />
              </div>
            </div>

            <div className="card-container bg-white rounded-xl shadow-lg dark:bg-neutral-800">
              <div className="card flex-1 h-10 px-4  text-base text-gray-700 placeholder-gray-600 focus:shadow-outline pt-2">
                <p>Output by AWS API</p>
              </div>
              <div className="play-button-aws flex items-center justify-center w-1/6 h-10 ml-4 text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline">
                <PlayIcon className="h-6 w-6 text-gray-100" />
              </div>
            </div>
          </div> */}



          <div className="flex items-center justify-center w-full h-full mt-4">
            <div className="flex-1 h-10 px-4  text-base text-gray-700 placeholder-gray-600 focus:shadow-outline pt-2">
              <p>Google text-to-speech output</p>
            </div>
            <div className="play-button-google flex items-center justify-center w-1/6 h-10 ml-4 text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline">
              <PlayIcon className="h-6 w-6 text-gray-100" />
            </div>

          </div>
          <div className="flex items-center justify-center w-full h-full mt-4">
            <div className="flex-1 h-10 px-4  text-base text-gray-700 placeholder-gray-600 focus:shadow-outline pt-2">
              <p>AWS text-to-speech Polly output</p>
            </div>
            <div className="play-button-aws flex items-center justify-center w-1/6 h-10 ml-4 text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline">
              <PlayIcon className="h-6 w-6 text-gray-100" />
            </div>
          </div>




        </div>
      </div>



    </main>
  )
}
