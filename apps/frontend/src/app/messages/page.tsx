"use client";

import ChatRows from "@/app/messages/components/chat-rows";
import { Mail } from "lucide-react";

import { useEffect } from "react";

import Head from "next/head";

import { ActionButton } from "@/components/button";

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
      <div className="lg:w-[70vw] border-l border-r border-l-border border-r-border h-full relative ml-4 flex">
        <div className="w-[35%] h-full flex flex-col gap-8 border-r border-r-border">
          <div>
            <h1 className="text-text text-xl font-bold p-4">Chat</h1>
          </div>

          {/* Chat columns with chat rows, where I will render all the chats the user have */}
          <ChatRows></ChatRows>
        </div>

        {/* Render the chatroom from the chat rows */}
        <div className="w-[65%] flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="p-6 bg-accent rounded-full w-fit">
              <Mail size={32}></Mail>
            </div>
            <h1 className="font-bold text-xl">Start a conversation</h1>
            <p className="text-darker font-light">
              Choose from your existing conversations, or start a new one.
            </p>
            <ActionButton className="mt-4">New Chat</ActionButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
