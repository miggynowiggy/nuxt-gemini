import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Assuming your Gemini API key is stored in the runtime config
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });

  let messages: Record<any, any>[] = [];
  const previousMessages = await readBody(event);
  messages = messages.concat(previousMessages);
  let prompt =
    messages
      .map((message) => `${message.role}: ${message.message}`)
      .join("\n") + `\nAI:`;

  // Define generation configuration settings
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  // Define safety settings
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // Add other categories as needed
  ];

  // Generate content using the Gemini Pro model
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
      {
        role: "assistant",
        parts: [{ text: "AI: " }],
      },
      {
        role: "assistant",
        parts: [{ text: "Sorry, an error occurred." }],
      },
    ],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  const text = response.text();

  // Return the generated message in the response
  return {
    message: text,
  };
});
