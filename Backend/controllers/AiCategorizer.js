const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function categorizeEmail(emailText) {
    const prompt = `
  You are an AI email assistant. Categorize the following email based on the subject and the email content or text only and categorised them into one of the labels:
  - Interested
  - Meeting Booked
  - Not Interested
  - Spam
  - Out of Office

  Email Content:
  ${emailText}

  Category:
  `;

    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: "system",
                    content: "You are an AI email categorizer.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        const label = response.choices[0].message.content.trim();
        return label;
    } catch (error) {
        console.error("OpenAI categorization failed:", error.message);
        return "Uncategorized";
    }
}

module.exports = categorizeEmail;
