import * as dotenv from "dotenv";
import fs from "fs";

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

const mineConcepts = async (input) => {
  intro("Welcome to the Concept Miner!");

  const askAI = spinner();

  let concepts = null;
  let result = null;
  let hasInitial = false;
  let conceptCount = 0;

  while (true) {
    if (!hasInitial) {
      askAI.start("Generating Conceptualization...");

      try {
        concepts = await getCompletion(getPrompt("conceptualize", { input }));
      } catch (e) {
        askAI.stop("Error generating concepts, bailing out");
        log.error(e.message);
        break;
      }

      try {
        result = JSON.parse(concepts);
      } catch (e) {
        askAI.stop("Invalid JSON, let's try again");
        log.error(e.message);
        continue;
      }

      hasInitial = true;

      conceptCount = Object.keys(result).length;

      askAI.stop(`Concepts generated: ${conceptCount}`);

      log.info(`Concepts: ${Object.keys(result).join(", ")}`);
    }

    askAI.start("Refining concepts...");

    try {
      concepts = await getCompletion(getPrompt("refine", { input, concepts }));
    } catch (e) {
      askAI.stop("Error refining concepts, bailing out");
      log.error(e.message);
      break;
    }

    try {
      result = JSON.parse(concepts);
    } catch (e) {
      askAI.stop("Invalid JSON, assuming refinement cycle completed.");
      log.error(e.message);
      break;
    }

    if (Object.keys(result).length === conceptCount) {
      askAI.stop("No new concepts, refinement cycle completed.");
      break;
    }

    conceptCount = Object.keys(result).length;

    askAI.stop(`Concept count after refining : ${conceptCount}`);

    log.info(`Concepts: ${Object.keys(result).join(", ")}`);
  }
  outro("Thank you for using the Concept Miner!");

  return concepts;
};

const main = async () => {
  const filename = process.argv[2];
  const file = fs.readFileSync(process.argv[2], "utf-8");
  const concepts = await mineConcepts(file);
  fs.writeFileSync(`${filename}.concepts.json`, concepts);
};

main();
