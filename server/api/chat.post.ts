import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

interface ChatEntry {
  role: string;
  parts: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Assuming your Gemini API key is stored in the runtime config
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-002",
  });

  const { conversation, message: newMessage } = await readBody(event);
  const chatHistory = conversation.map((m: any) => ({
    role: m.role,
    parts: m.message,
  }));

  // Define generation configuration settings
  const generationConfig = {
    temperature: 1,
    topK: 1,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  // Define safety settings
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  // Generate content using the Gemini Pro model
  const conversationModel = model.startChat({
    history: [
      {
        role: "user",
        parts: `You are Bogart, a search engine agent. Answer all inquiries based on the results of Google.`,
      },
      ...chatHistory,
    ],
    generationConfig,
    safetySettings,
  });

  const result = await conversationModel.sendMessage(newMessage);
  const text = result.response.text();

  // Return the generated message in the response
  return {
    status: 200,
    message: text,
  };
});
