export default {
  async fetch(expenses) {
    const prompt = `
You are an expense insights agent.
Analyze the provided expenses and respond ONLY in valid JSON.

Required fields:
{
 "totalSpend": number,
 "topCategories": [ { "category": string, "total": number } ],
 "topTags": [ { "tag": string, "count": number } ],
 "largestExpenses": [ { "amount": number, "category": string, "note": string } ],
 "summary": string,
 "suggestions": string[]
}

Data:
${JSON.stringify(expenses)}
`;

    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": "API_KEY",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await r.json();

    console.log("Insights", data);

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return Response.json(JSON.parse(text));
  },
};

// "```json
// {
//   "totalSpend": 885,
//   "topCategories": [
//     {
//       "category": "Food & Dining",
//       "total": 585
//     },
//     {
//       "category": "Groceries",
//       "total": 300
//     }
//   ],
//   "topTags": [
//     {
//       "tag": "TEA",
//       "count": 4
//     },
//     {
//       "tag": "FOOD",
//       "count": 2
//     },
//     {
//       "tag": "SNACKS",
//       "count": 2
//     },
//     {
//       "tag": "CURD",
//       "count": 2
//     },
//     {
//       "tag": "Tiffin",
//       "count": 1
//     }
//   ],
//   "largestExpenses": [
//     {
//       "amount": 300,
//       "category": "Groceries",
//       "note": "Minutes order"
//     },
//     {
//       "amount": 100,
//       "category": "Food & Dining",
//       "note": "Mana restaurant chicken 65 Biryani "
//     },
//     {
//       "amount": 80,
//       "category": "Food & Dining",
//       "note": "Olive mithai ribbon pakoda"
//     },
//     {
//       "amount": 80,
//       "category": "Food & Dining",
//       "note": "Tiffin "
//     },
//     {
//       "amount": 66,
//       "category": "Food & Dining",
//       "note": "Bicha reddy Karapusa "
//     }
//   ],
//   "summary": "Your total spending amounted to 885 across 15 transactions. The majority of your expenses, 585, were in 'Food & Dining', significantly outweighing 'Groceries' which accounted for 300. Your largest single expense was a 300 grocery order, followed by a 100 biryani from Mana restaurant. Frequent purchases include tea, snacks, and curd.",
//   "suggestions": [
//     "Consider preparing snacks or meals at home to reduce frequent 'Food & Dining' expenses, especially for items like tea and snacks.",
//     "Review your 'Groceries' spending to ensure the 300 order was for essential items and if there are opportunities for cost savings.",
//     "If you often purchase multiple small items like 'Tea' or 'Curd', consider buying them in bulk or finding more economical alternatives to save over time."
//   ]
// }
// ```"
