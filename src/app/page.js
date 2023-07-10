"use client"; // This is a client component

import React, { useEffect, useState } from 'react';
// import textToSpeechGoogle from './_components/textToSpeechGoogle';
import { PlayIcon } from '@heroicons/react/24/solid';


export default function Home() {
  // for translation
  const [textRussian, setTextRussian] = useState('');
  const [textTranstatedToEnglish, setTextTranstatedToEnglish] = useState('');
  // 
  const [textEng, setTextEng] = useState('');
  const [audioGoogle, setAudioGoogle] = useState('');
  const [audioAWS, setAudioAWS] = useState('');

  const hardCodedText = 'В некотором царстве, в некотором государстве жил-был царь, и было у него три сына. Младшего звали Иван-царевич.Позвал однажды царь сыновей и говорит им:— Дети мои милые, вы теперь все на возрасте, пора вам и о невестах подумать!— За кого же нам, батюшка, посвататься?— А вы возьмите по стреле, натяните свои тугие луки и пустите стрелы в разные стороны. Где стрела упадет — там и сватайтесь.Вышли братья на широкий отцовский двор, натянули свои тугие луки и выстрелили.Пустил стрелу старший брат. Упала стрела на боярский двор, и подняла ее боярская дочь.Пустил стрелу средний брат — полетела стрела к богатому купцу во двор. Подняла ее купеческая дочь.Пустил стрелу Иван-царевич — полетела его стрела прямо в топкое болото, и подняла ее лягушка-квакушка…Старшие братья как пошли искать свои стрелы, сразу их нашли: один — в боярском тереме, другой — на купеческом дворе. А Иван-царевич долго не мог найти свою стрелу. Два дня ходил он по лесам и по горам, а на третий день зашел в топкое болото. Смотрит — сидит там лягушка-квакушка, его стрелу держит.Иван-царевич хотел было бежать и отступиться от своей находки, а лягушка и говорит:— Ква-ква, Иван-царевич! Поди ко мне, бери свою стрелу, а меня возьми замуж.Опечалился Иван-царевич и отвечает:— Как же я тебя замуж возьму? Меня люди засмеют!— Возьми, Иван-царевич, жалеть не будешь!Подумал-подумал Иван-царевич, взял лягушку-квакушку, завернул ее в платочек и принес в свое царство-государство.Пришли старшие братья к отцу, рассказывают, куда чья стрела попала.Рассказал и Иван-царевич. Стали братья над ним смеяться, а отец говорит:— Бери квакушку, ничего не поделаешь!Вот сыграли три свадьбы, поженились царевичи: старший царевич — на боярышне, средний — на купеческой дочери, а Иван-царевич — на лягушке-квакушке.На другой день после свадьбы призвал царь своих сыновей и говорит:— Ну, сынки мои дорогие, теперь вы все трое женаты. Хочется мне узнать, умеют ли ваши жены хлебы печь. Пусть они к утру испекут мне по караваю хлеба.Поклонились царевичи отцу и пошли. Воротился Иван-царевич в свои палаты невесел, ниже плеч буйну голову повесил';

  const hardcodedTextEnglish = "In a certain kingdom, there was a king who had three sons. The youngest son's name was Ivan. One day, the king called his sons and told them it was time for them to think about getting married. He instructed them to shoot their arrows and whichever direction the arrow landed, that's where they should find a bride. Ivan's arrow landed in a muddy swamp where a frog was sitting. Ivan was initially hesitant, but the frog convinced him to marry her. They got married along with his brothers who found brides from noble and merchant families. Later, the king asked his sons' wives to bake him a loaf of bread, leaving Ivan sad and dejected.";

  const handleEngTextSubmit = async () => {
    await textToSpeechGoogle(textEng);
    setAudioGoogle('output.mp3');
  }

  const handleRusTextSubmit = async () => {
    const response = await fetch('/api/translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textRussian }),
    })
      const data = await response.json();
      setTextTranstatedToEnglish(data.item);
  };


  useEffect(() => {
    const handlePlayGoogleAudio = () => {
      const audio = new Audio(audioGoogle);
      audio.play();
    };

    const playButton = document.querySelector('.play-button');
    playButton.addEventListener('click', handlePlayGoogleAudio);

    return () => {
      playButton.removeEventListener('click', handlePlayGoogleAudio);
    };
  }, [audioGoogle]);

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

            <button className="flex items-center justify-center w-1/6 h-10 ml-4 text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline"> Submit </button>
          </div>
          <div className="flex items-center justify-center w-full h-full mt-4">
            <div className="flex-1 h-10 px-4  text-base text-gray-700 placeholder-gray-600 focus:shadow-outline pt-2">
              <p>Output will be displayed here</p>
            </div>
            <div className="play-button flex items-center justify-center w-1/6 h-10 ml-4 text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline">
              <PlayIcon className="h-6 w-6 text-gray-100" />
            </div>

          </div>
          <div className="flex items-center justify-center w-full h-full mt-4">
            <div className="flex-1 h-10 px-4  text-base text-gray-700 placeholder-gray-600 focus:shadow-outline pt-2">
              <p>Output will be displayed here for AWS</p> 
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
