import { NextResponse } from "next/server"
import path from "path";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly"; // ES Modules import
const config = require('../../../../config/aws.json');
const fs = require('fs');
const client = new PollyClient(config);
const input = { // SynthesizeSpeechInput
    Engine: "standard", //"neural",
    LanguageCode: "en-US", //"arb" || "cmn-CN" || "cy-GB" || "da-DK" || "de-DE" || "en-AU" || "en-GB" || "en-GB-WLS" || "en-IN" || "en-US" || "es-ES" || "es-MX" || "es-US" || "fr-CA" || "fr-FR" || "is-IS" || "it-IT" || "ja-JP" || "hi-IN" || "ko-KR" || "nb-NO" || "nl-NL" || "pl-PL" || "pt-BR" || "pt-PT" || "ro-RO" || "ru-RU" || "sv-SE" || "tr-TR" || "en-NZ" || "en-ZA" || "ca-ES" || "de-AT" || "yue-CN" || "ar-AE" || "fi-FI" || "en-IE",
    //   LexiconNames: [ // LexiconNameList
    //     "STRING_VALUE",
    //   ],
    OutputFormat: "mp3", // "json" || "mp3" || "ogg_vorbis" || "pcm", // required
    //   SampleRate: "STRING_VALUE",
    //   SpeechMarkTypes: [ // SpeechMarkTypeList
    //     "sentence" || "ssml" || "viseme" || "word",
    //   ],
    //   Text: "STRING_VALUE", // required
    TextType: "text", //"ssml" || "text",
    VoiceId: "Justin", //"Aditi" || "Amy" || "Astrid" || "Bianca" || "Brian" || "Camila" || "Carla" || "Carmen" || "Celine" || "Chantal" || "Conchita" || "Cristiano" || "Dora" || "Emma" || "Enrique" || "Ewa" || "Filiz" || "Gabrielle" || "Geraint" || "Giorgio" || "Gwyneth" || "Hans" || "Ines" || "Ivy" || "Jacek" || "Jan" || "Joanna" || "Joey" || "Justin" || "Karl" || "Kendra" || "Kevin" || "Kimberly" || "Lea" || "Liv" || "Lotte" || "Lucia" || "Lupe" || "Mads" || "Maja" || "Marlene" || "Mathieu" || "Matthew" || "Maxim" || "Mia" || "Miguel" || "Mizuki" || "Naja" || "Nicole" || "Olivia" || "Penelope" || "Raveena" || "Ricardo" || "Ruben" || "Russell" || "Salli" || "Seoyeon" || "Takumi" || "Tatyana" || "Vicki" || "Vitoria" || "Zeina" || "Zhiyu" || "Aria" || "Ayanda" || "Arlet" || "Hannah" || "Arthur" || "Daniel" || "Liam" || "Pedro" || "Kajal" || "Hiujin" || "Laura" || "Elin" || "Ida" || "Suvi" || "Ola" || "Hala" || "Andres" || "Sergio" || "Remi" || "Adriano" || "Thiago" || "Ruth" || "Stephen" || "Kazuha" || "Tomoko" || "Niamh" || "Sofie", // required
};

const targetFile = path.join(process.cwd(), "public/audio/output-aws.mp3");

export async function POST(req) {
    // extracting text from request
    const body = await req.json();
    const text = body.text;

    const command = new SynthesizeSpeechCommand({ ...input, Text: text });
    const response = await client.send(command);

    const audioStream = response.AudioStream;

    // Create a write stream to the target file
    const writeStream = fs.createWriteStream(targetFile);

    return new Promise((resolve, reject) => {
        audioStream.on("data", (chunk) => {
            // Write each chunk of audio data to the file
            writeStream.write(chunk);
        });

        audioStream.on("end", () => {
            // Close the write stream when the audio stream ends
            writeStream.end();
        });

        audioStream.on("error", (error) => {
            // Handle any errors that occur during the audio stream
            reject(error);
        });

        writeStream.on("finish", () => {
            console.log("Audio content written to file: output-aws.mp3");
            resolve(NextResponse.json({ name: "John Doe" }));
        });

        writeStream.on("error", (error) => {
            console.error("Error writing audio file:", error);
            reject(NextResponse.error());
        });
    });

}