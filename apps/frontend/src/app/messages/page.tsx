"use client";

import { useEffect } from "react";

import Head from "next/head";

const Messages = () => {
  useEffect(() => {
    document.title = "Twitter / Messages";
  }, []);

  return (
    <>
      <Head>
        <title>{document.title}</title>
        <meta
          name="description"
          content="Home page of my attempt to make a clone of Twitter"
        />
      </Head>
      <div className="lg:w-[60vw] border-l border-r border-l-border border-r-border h-full relative ml-4">
        {/* Chat columns with chat rows, where I will render all the chats the user have */}

        {/* Render the chatroom from the chat rows */}
      </div>
    </>
  );
};

export default Messages;
