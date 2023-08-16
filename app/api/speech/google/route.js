import { NextResponse } from "next/server"
import { SpeechClient } from '@google-cloud/speech';
import path from "path";
const targetFile = path.join(process.cwd(), "public/audio/output-google.mp3");

// Set up Google Cloud Speech-to-Text client
const speechClient = new SpeechClient();
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient();


export async function POST(req) {
  const mode = req.nextUrl.searchParams.get('mode');
  const body = await req.json();

  if (mode) {
    if (mode === 'TTS') {
      try {
        const text = body.text;
    
        const request = {
          input: { text: text },
          voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        };
    
        const [response] = await client.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile).bind(fs);
        await writeFile(targetFile, response.audioContent, 'binary');
        console.log('Audio content written to file: output-google.mp3');
    
    
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error(error);
        return NextResponse.error(new Error('Something went wrong on Google API'));
      }
    } else {
      const request = {
        audio: {
          content: body.text
        },
        config: {
          encoding: 'MP3',
          languageCode: 'en-US',
          sampleRateHertz: 48000
        },
      };

      try {
        const [response] = await speechClient.recognize(request);
        console.log(response)
        const transcription = response.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        console.log('Transcription:', transcription);
        return NextResponse.json({ success: true, data: transcription });
      } catch (err) {
        console.error('Error transcribing:', err);
        return NextResponse.error(new Error('Something went wrong on Google API'));
      }
    }
  }
}