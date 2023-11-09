const fs = require("fs/promises");
const path = require("path");
const { OpenAI } = require("openai");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const imageFilePath = process.argv[2];
  const outputPath = imageFilePath.replace(/\.[^.]*$/, ".txt");

  await fs.writeFile(outputPath, imageFilePath + "\n", { encoding: "utf8" });

  const imageBase64 = await fs.readFile(imageFilePath, { encoding: "base64" });
  const dataUrl = `data:image/png;base64,${imageBase64}`;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const prompt = [
    "This is a screenshot of my desktop.",
    "Please tell me in detail what applications you have open, what web pages you are viewing in your browser, and what you infer from them so that I can look back at your work later.",
    "Please answer in Japanese.",
  ].join("\n");
  const result = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: dataUrl,
              detail: "high",
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  });
  const { message } = result.choices[0];
  console.log(message);

  await fs.appendFile(
    outputPath,
    ["PROMPT:", prompt, "OUTPUT:", message.content].join("\n"),
    {
      encoding: "utf8",
    }
  );
}
