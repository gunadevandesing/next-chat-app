import Head from "next/head";
import ChatWrapper from "../../components/agent-components/ChatWrapper";

export default function Home() {
  return (
    <>
      <Head>
        <title>Langchain Agent</title>
        <meta name="description" content="Langchain agent" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <main>
          <ChatWrapper />
        </main>
      </div>
    </>
  );
}
