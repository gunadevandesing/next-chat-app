// import { imageString } from "../../../data/imagestring.js";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";

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
