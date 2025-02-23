// import { imageString } from "../../../data/imagestring.js";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatOllama } from "@langchain/ollama";

export async function POST(req) {
  const body = await req.json();
  const promptMessage = body?.message || "What is NextJs?";
  const prevMessages = body?.messages || [];
  const modelName = body?.modelName || "gemini-1.5-pro";
  const imageUrls = body?.imageUrls || [];

  const images = [];
  let model = null;
  if (modelName === "m") {
    model = new ChatMistralAI({
      model: "mistral-large-latest",
      temperature: 0,
    });
  } else if (modelName === "o") {
    imageUrls.forEach((imageUrl) => {
      images.push(imageUrl.split(",")[1]);
    });
    model = new ChatOllama({
      model: "llava",
      temperature: 0,
      maxRetries: 2,
    }).bind({ images });
  } else {
    model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: "gemini-1.5-pro",
    });

    imageUrls.forEach((imageUrl) => {
      images.push({
        type: "image_url",
        image_url: {
          url: imageUrl,
        },
      });
    });
  }

  const prevConversation = [];
  prevMessages.forEach((msg) => {
    if (msg.name === "User") {
      prevConversation.push(
        new HumanMessage({
          content: [
            {
              type: "text",
              text: msg.text,
            },
          ],
        })
      );
    }
    if (msg.name === "AI") {
      prevConversation.push(
        new AIMessage({
          content: [
            {
              type: "text",
              text: msg.text,
            },
          ],
        })
      );
    }
  });

  const contents = [
    ...prevConversation,
    new HumanMessage({
      content: [
        {
          type: "text",
          text: promptMessage,
        },
        ...images,
      ],
    }),
  ];

  // if (modelName === "o") {
  //   console.log({ images });
  //   const response = await model.invoke(
  //     contents
  //     // "Extract text from the image and return the extracted text as a response, ignore the personal information. Also consider only the portion that is in eglish and ignore other languages."
  //   );

  //   return Response.json({ response: response });
  // }
  // Multi-modal streaming
  const streamRes = await model.stream(contents);

  // Read from the stream and interpret the output as markdown
  const buffer = [];
  // const md = new MarkdownIt();
  let outputRes = "";
  for await (const chunk of streamRes) {
    buffer.push(chunk.content);
    outputRes = buffer.join("");
  }

  return Response.json({ response: outputRes });
}
