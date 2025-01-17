// import { imageString } from "../../../data/imagestring.js";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import MarkdownIt from "markdown-it";

export async function POST(req) {
  // const imgData = imageString;
  const body = await req.json();
  const promptMessage = body?.message || "What is NextJs?";
  const modelName = body?.modelName || "gemini-1.5-pro";

  const contents = [
    new HumanMessage({
      content: [
        {
          type: "text",
          text: promptMessage,
        },
        // {
        //   type: "image_url",
        //   image_url: { url: imgData },
        // },
      ],
    }),
  ];

  let model = null;
  if (modelName === "mistral-large-latest") {
    model = new ChatMistralAI({
      model: "mistral-large-latest",
      temperature: 0,
    });
  } else {
    model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "gemini-1.5-pro",
    });
  }

  // Multi-modal streaming
  const streamRes = await model.stream(contents);

  // Read from the stream and interpret the output as markdown
  const buffer = [];
  const md = new MarkdownIt();
  let outputRes = "";
  for await (const chunk of streamRes) {
    buffer.push(chunk.content);
    outputRes = buffer.join("");
  }

  return Response.json({ response: outputRes });
}
