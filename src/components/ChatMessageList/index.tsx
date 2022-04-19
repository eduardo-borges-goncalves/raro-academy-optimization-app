import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useChat, useMessages } from "../../contexts/chat.context";
import { useScroll } from "../../hooks/useScroll";
import { Button } from "../Button";
import { ChatMessage } from "../ChatMessage";
import { ChatMessageListBottomScrollButton } from "../ChatMessageListBottomScrollButton";
import { MyChatMessage } from "../MyChatMessage";

// número totalmente arbitrário...
const TAMANHO_MEDIO_MENSAGEM_PX = 300;
export const ChatMessageList = () => {
  const scrollRef: MutableRefObject<Element | null> = useRef(null);
  const { buscaMensagem } = useChat();
  const { mensagens, setMensagens} = useMessages();
  
  const [ quaisMensagens, setQuaisMensages ] = useState([...mensagens])
  const [ num, setNum ] = useState(50)
  
  // pagination
  useEffect(() => {
    setQuaisMensages([...mensagens].splice(0, num));
    endOfScroll && scrollBottom()
  }, [mensagens, num]);

  const {
    scrollBottom,
    endOfScroll,
    updateEndOfScroll,
    getDistanceFromBottom
  } = useScroll(scrollRef);
  
  useEffect(() => {
    scrollRef.current = document.querySelector('#mensagens');
    lerNovasMensagens();
  }, []);

  useEffect(() => {
    updateEndOfScroll();
  }, [mensagens, updateEndOfScroll]);

  useEffect(() => {
    const novaMensagem = mensagens[0];
    const distanceFromBottom = getDistanceFromBottom();
    const lerProximaMensagem = distanceFromBottom < TAMANHO_MEDIO_MENSAGEM_PX;
    const minhaMensagem = novaMensagem?.autor.usuarioAtual

    if (minhaMensagem || lerProximaMensagem) {
      lerNovasMensagens();
    }
  }, [mensagens.length]);

  const lerNovasMensagens = () => {
    scrollBottom();
    mensagens.forEach(mensagem => {
      mensagem.lida = true;
    });
    setMensagens([...mensagens]);
  };
  
  return (
    <div id="mensagens" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-purple scrollbar-thumb-rounded scrollbar-track-indigo-lighter scrollbar-w-2 scrolling-touch">
      <div className="w-max flex justify-center flex-row content-center m-auto opacity-40 hover:opacity-60">
        <Button onClick={() => setNum(num+50)}>carregar mensagens</Button>
      </div>
      {
        [...quaisMensagens]
          .reverse()
          .filter(mensagem => mensagem.texto.match(new RegExp(buscaMensagem, 'i')))
          .map(mensagem => (
            mensagem.autor.usuarioAtual ?
              <MyChatMessage key={mensagem.id} mensagem={ mensagem }  /> :
              <ChatMessage key={mensagem.id} mensagem={ mensagem } />
          ))
      }
      {
        !endOfScroll ? (
          <ChatMessageListBottomScrollButton
            onClick={() => lerNovasMensagens()}
            naoLidos={mensagens.filter(m => !m.lida).length}
          />
        ) : <></>
      }
    </div>
  );
}