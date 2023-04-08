import * as dotenv from "dotenv";

import { intro, text, outro, spinner, log } from "@clack/prompts";
import { OpenAIApi, Configuration } from "openai";

import { getPrompt } from "./prompts.js";

dotenv.config();
const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

const getCompletion = async (prompt) => {
  const request = {
    prompt,
    model: "text-davinci-003",
    temperature: 0.7,
    max_tokens: 2048,
  };
  const completion = await openai.createCompletion(request);
  const result = completion.data.choices[0].text?.trim() || "";
  return result;
};

const main = async () => {
  intro("Welcome to the Conceptualizer!");

  while (true) {
    const input = await text({
      message: "Please provide the text to be conceptualized",
    });

    if (!input || !input.length) {
      log.error("No input provided. Please try again.");
      continue;
    }

    const askAI = spinner();

    askAI.start("Generating Conceptualization...");

    const completion = await getCompletion(
      getPrompt("conceptualize", { input })
    );

    const result = JSON.parse(completion);

    askAI.stop(`Concepts generated: ${Object.keys(result).length}`);

    break;
  }
  outro("Thank you for using the Conceptualizer!");
};

main();
