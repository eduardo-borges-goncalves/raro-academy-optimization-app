import { ChatHeader } from "../../components/ChatHeader";
import { ChatMessageList } from "../../components/ChatMessageList";
import { ChatTextArea } from "../../components/ChatTextArea";
import { ChatProvider, MessagesProvider } from "../../contexts/chat.context";

export const Chat = () => {
  return (
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen"> 
      <ChatProvider>
        <ChatHeader />
        <MessagesProvider>
          <ChatMessageList />
          <ChatTextArea />
        </MessagesProvider>
      </ChatProvider>
    </div>
  );
}
