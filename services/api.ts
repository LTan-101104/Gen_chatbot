"use server"
import { textObj } from "@/components/ChatUI";
import * as dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai"

// Note: if you use text generation model, you have to save all the messages so far into a variable to send each time you send a request to open ai API

const openai = new OpenAI({
    apiKey: process.env.OPENAI
});

export async function sendRequest(messages: textObj[]): Promise<textObj> {
    try {
        console.log(messages)
        const respond = await openai.chat.completions.create({
            messages,
            model: "gpt-4o-mini",
        })
        return { content: respond.choices[0].message.content as string, role: respond.choices[0].message.role }
    }
    catch (err) {
        console.error(err)
        throw err;
    }
}
