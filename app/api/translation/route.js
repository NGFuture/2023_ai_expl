import openai from "@/app/_utils/openai";
import { NextResponse } from "next/server"

export async function POST(req) {

  const body = await req.json();
  const text = body.text;
  const prompt = "Translate following from Russian into English in 2-3 sentences, so if input is to long, then summarize if input is too short then expand in polite professional manner:";
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: `${prompt}: ${text}`}],
  });
  const responseText = chatCompletion.data.choices[0].message.content;
  console.log(responseText);

  return NextResponse.json({item: responseText});
}   