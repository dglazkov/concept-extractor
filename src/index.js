import { intro, text, outro, log } from "@clack/prompts";
import { OpenAIApi, Configuration } from "openai";

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

    break;
  }
  outro("Thank you for using the Conceptualizer!");
};

main();
