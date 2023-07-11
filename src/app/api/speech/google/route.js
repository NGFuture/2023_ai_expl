import { NextResponse } from "next/server"
import path from "path";

// const targetFile = path.join(__dirname,"../../../../public/audio/output-google.mp3");
const targetFile = path.join(process.cwd(),"public/audio/output-google.mp3");

// export async function GET(req) {
//   const textToSpeech = require('@google-cloud/text-to-speech');
//   const fs = require('fs');
//   const util = require('util');
//   const client = new textToSpeech.TextToSpeechClient();
//   const text = 'I am fishman';
//   const request = {
//     input: { text: text },
//     voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
//     audioConfig: { audioEncoding: 'MP3' },
//   };

//   const [response] = await client.synthesizeSpeech(request);
//   const writeFile = util.promisify(fs.writeFile).bind(fs);
//   await writeFile(targetFile, response.audioContent, 'binary');
//   console.log('Audio content written to file: output.mp3');


//   return NextResponse.json({ name: 'John Doe' });
// }   

export async function POST(req) {
  const textToSpeech = require('@google-cloud/text-to-speech');
  const fs = require('fs');
  const util = require('util');
  const client = new textToSpeech.TextToSpeechClient();
  // extracting text from request
  const body = await req.json();
  const text = body.text;

  const request = {
    input: { text: text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile).bind(fs);
  await writeFile(targetFile, response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');


  return NextResponse.json({ name: 'John Doe' });
}