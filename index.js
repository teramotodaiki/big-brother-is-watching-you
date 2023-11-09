const fs = require("fs/promises");
const path = require("path");
const { OpenAI } = require("openai");
require("dotenv").config();

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const outputPath = path.join(__dirname, "output.txt");
  await fs.appendFile(outputPath, process.argv.join("\n"), {
    encoding: "utf8",
  });

  const imageFilePath = process.argv[2];
  const imageBase64 = await fs.readFile(imageFilePath, { encoding: "base64" });
  const dataUrl = `data:image/png;base64,${imageBase64}`;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

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
            },
          },
          {
            type: "text",
            text: "This is a screenshot of my desktop. Please describe what you see in Japanese.",
          },
        ],
      },
    ],
  });
  const { finish_reason, message } = result.choices[0];
  console.log(message.content);
  console.log(finish_reason);

  await fs.appendFile(outputPath, [message.content, finish_reason].join("\n"), {
    encoding: "utf8",
  });
}
