export default {
  async fetch(expenses) {
    const prompt = `
You are an expense insights agent.
Analyze the provided expenses and respond ONLY in valid JSON.
for summary of spending dont provide information on the totals or top spends, focus on other insights.
For transactions causing highest spend, provide highest individual transactions only, not totals per category.
Each of the fields in the response should be as concise as possible but maintain clarity.
Required fields:
{
 "summaryOfSpending": string,
 "suggestion": string[],
 "spendingPlanForNextWeek": string[],
 "transactionPatterns": string[],
 "transactionsCausingHighestSpend": string[]
}

Data:
${JSON.stringify(expenses)}
`;

    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GOOGLE_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await r.json();

    if (data.error) {
      throw new Error(data.error.message);
    }
    console.log("Insights", data);

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    const cleaned = text
      .replace(/```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    console.log("Cleaned Insights JSON:", JSON.parse(cleaned));
    return JSON.parse(cleaned);
  },
};
