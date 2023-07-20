import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";

const AudioButton = ({ sourceTitle, audioFileCreated, isPlaying, handlePlayStop }) => {
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

export default AudioButton;