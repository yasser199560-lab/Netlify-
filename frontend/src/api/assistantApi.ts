import api from "./axiosInstance";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSuggestion {
  type: "store" | "product";
  id: string;
  partnerId: string;
  name: string;
}

export interface ChatResponse {
  reply: string;
  suggestions: ChatSuggestion[];
}

export interface ChatAttachment {
  mimeType: string;
  data: string; // base64, no "data:...;base64," prefix
}

// history should be the prior turns only — the new message is passed
// separately and appended server-side.
export async function sendAssistantMessage(
  message: string,
  history: ChatMessage[],
  attachment?: ChatAttachment
): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>("/assistant/chat", { message, history, attachment });
  return data;
}

export interface GeneratedListing {
  title: string;
  description: string;
  category: string;
}

export async function generateProductListing(hint: string): Promise<GeneratedListing> {
  const { data } = await api.post<GeneratedListing>("/assistant/generate-description", { hint });
  return data;
}
