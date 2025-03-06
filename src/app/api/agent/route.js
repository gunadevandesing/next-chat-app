// pages/api/agent.js

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatMistralAI } from "@langchain/mistralai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const runAgent = async (topic) => {
  // Define the tools for the agent to use
  const agentTools = [new TavilySearchResults({ maxResults: 3 })];
  const agentModel = new ChatMistralAI({ temperature: 0 });

  // Initialize memory to persist state between graph runs
  const agentCheckpointer = new MemorySaver();
  const agent = createReactAgent({
    llm: agentModel,
    tools: agentTools,
    checkpointSaver: agentCheckpointer,
  });

  // Now it's time to use!
  const agentFinalState = await agent.invoke(
    {
      messages: [new HumanMessage("Get the latest news about " + topic)],
    },
    { configurable: { thread_id: "42" } }
  );

  const firstResult =
    agentFinalState.messages[agentFinalState.messages.length - 1].content;

  const agentNextState = await agent.invoke(
    {
      messages: [
        new HumanMessage("Provide summary about each result in 20 words each"),
      ],
    },
    { configurable: { thread_id: "42" } }
  );

  const secondResult =
    agentNextState.messages[agentNextState.messages.length - 1].content;

  return { firstResult, secondResult };
};

export async function POST(req) {
  const body = await req.json();
  const topic = body?.topic || "RBI that will be useful for RBI exam.";

  try {
    const results = await runAgent(topic);
    return Response.json(results);
  } catch (error) {
    console.error(error);
    return Response.json({ firstResult: "Error", secondResult: "Error" });
  }
}
