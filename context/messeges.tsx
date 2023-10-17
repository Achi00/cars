import { Message } from "@/lib/validators/message";
import { createContext } from "react";

export const MessegesContext = createContext<{
  messages: Message[];
  isMessageUpdating: boolean;
  // addMessage: (message: Message) =>
}>;
