import faker from "@faker-js/faker";
import React, { createContext, useContext, useEffect, useState } from "react";
import { geraPessoas } from "../helpers/gera-pessoa";
import { Mensagem } from "../types/Mensagem";
import { ParticipanteChat } from "../types/Participantes";

const geraParticipante = (usuarioAtual = false): ParticipanteChat => ({
  ...geraPessoas(1)[0],
  ativo: true,
  usuarioAtual,
})

export type ChatContextProps = {
  buscaMensagem: string;
  setBuscaMensagem: (buscaMensagem: string) => void;
  participantes: ParticipanteChat[];
  setParticipantes: (participantes: ParticipanteChat[]) => void;
}

export const ChatContext = createContext<ChatContextProps>({
  buscaMensagem: '',
  setBuscaMensagem: (_: string) => {},
  participantes: [],
  setParticipantes: (_: ParticipanteChat[]) => {},
});

export const ChatProvider: React.FC = ({ children }) => {
  const [ buscaMensagem, setBuscaMensagem ] = useState<string>('');
  const [ participantes, setParticipantes ] = useState<ParticipanteChat[]>([]);

  useEffect(() => {
    const participantes = [
      geraParticipante(false), // gera dados do usuário convidado.
      geraParticipante(true),  // gera dados do usuário atual.
    ];

    setParticipantes(participantes);

    // produz uma carga inicial de mensagens.
    // util para testes.
  
  }, []);
  

  return (
    <ChatContext.Provider
      value={{
        buscaMensagem,
        setBuscaMensagem,
        participantes,
        setParticipantes,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('Você somente pode usar este hook debaixo de um <AuthContextProvider>');
  }

  return context;
};


export type MessagesContextProps = {
  mensagens: Mensagem[];
  setMensagens: (mensagens: Mensagem[]) => void;
  adicionaMensagem: (texto: string, participante: ParticipanteChat) => void;
}

export const MessagesContext = createContext<MessagesContextProps>({
  mensagens: [],
  setMensagens: (_: Mensagem[]) => {},
  adicionaMensagem: (texto: string, participante: ParticipanteChat) => {},
});

export const MessagesProvider: React.FC = ({ children }) => {
  const [ mensagens, setMensagens ] = useState<Mensagem[]>([]);
  
  useEffect(() => {
    const participantes = [
      geraParticipante(false), 
      geraParticipante(true),  
    ];

    Array.from(new Array(100)).forEach(() => {
      const id = faker.datatype.number({ min: 0, max: 1 });
      const autor = participantes[id];
      const texto = faker.lorem.sentence();
      adicionaMensagem(texto, autor);
    });

    const interval = setInterval(() => {
      const texto = faker.lorem.words(6);
      adicionaMensagem(texto, participantes[0]);
    }, 3000);

    return () => {
      clearInterval(interval);
    }
  }, []);
  
  const adicionaMensagem = (texto: string, autor: ParticipanteChat) => {
    const mensagem: Mensagem = {
      id: faker.datatype.uuid(),
      texto,
      autor,
      data: new Date(),
      lida: false
    }
    setMensagens(mensagens => [ mensagem, ...mensagens ]);
  };

  return (
    <MessagesContext.Provider
      value={{
        mensagens,
        setMensagens,
        adicionaMensagem,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error('Você somente pode usar este hook debaixo de um <AuthContextProvider>');
  }
  return context;
};

