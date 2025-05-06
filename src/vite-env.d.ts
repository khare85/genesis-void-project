
/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      'agent-id': string;
    }, HTMLElement>;
  }
}

// Add types for @11labs/react if not available from the package
declare module '@11labs/react' {
  export interface ConversationOptions {
    clientTools?: Record<string, (params: any) => any>;
    overrides?: {
      agent?: {
        prompt?: {
          prompt?: string;
        };
        firstMessage?: string;
        language?: string;
      };
      tts?: {
        voiceId?: string;
      };
    };
    onConnect?: () => void;
    onDisconnect?: () => void;
    onMessage?: (message: any) => void;
    onError?: (error: any) => void;
  }

  export interface ConversationSession {
    startSession: (options: { url?: string; agentId?: string }) => Promise<string>;
    endSession: () => Promise<void>;
    setVolume: (options: { volume: number }) => Promise<void>;
    status: "connected" | "disconnected";
    isSpeaking: boolean;
  }

  export function useConversation(options?: ConversationOptions): ConversationSession;
}
