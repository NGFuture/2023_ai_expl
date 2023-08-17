const config = require('../../config/aws.json');
import { TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";
import MicrophoneStream from "microphone-stream";
import { StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import { Buffer } from "buffer";
import concat from "concat-stream";

const SAMPLE_RATE = 44100;
let microphoneStream = undefined;
let transcribeClient = undefined;
let write = concat(function(data) {})

export const startRecording = async (language, callback) => {
    if (!language) {
      return false;
    }
    if (microphoneStream || transcribeClient) {
      stopRecording();
    }
    createTranscribeClient();
    createMicrophoneStream();
    await startStreaming(language, callback);
};

export const stopRecording = function () {
  if (microphoneStream) {
    microphoneStream.stop();
    microphoneStream.destroy();
    microphoneStream = undefined;
  }
  if (transcribeClient) {
    transcribeClient.destroy();
    transcribeClient = undefined;
  }
};

const createTranscribeClient = () => {
  transcribeClient = new TranscribeStreamingClient(config);
}

const createMicrophoneStream = async () => {
  microphoneStream = new MicrophoneStream()
  microphoneStream.setStream(
    await window.navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    })
  );
}

const startStreaming = async (language, callback) => {
  const command = new StartStreamTranscriptionCommand({
    LanguageCode: language,
    MediaEncoding: "pcm",
    MediaSampleRateHertz: SAMPLE_RATE,
    AudioStream: getAudioStream(),
  });
  const data = await transcribeClient.send(command);
  let content = ""
  for await (const event of data.TranscriptResultStream) {
    for (const result of event.TranscriptEvent.Transcript.Results || []) {
      if (result.IsPartial === false) {
        const noOfResults = result.Alternatives[0].Items.length;
        for (let i = 0; i < noOfResults; i++) {
          content += result.Alternatives[0].Items[i].Content + " "
          callback(content);
        }
      }
    }
  }
  content = ""
}

const getAudioStream = async function* () {
  for await (const chunk of microphoneStream) {
    if (chunk.length <= SAMPLE_RATE) {
      yield {
        AudioEvent: {
          AudioChunk: encodePCMChunk(chunk),
        },
      };
    }
  }
};

const encodePCMChunk = (chunk) => {
  const input = MicrophoneStream.toRaw(chunk);
  let offset = 0;
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return Buffer.from(buffer);
};