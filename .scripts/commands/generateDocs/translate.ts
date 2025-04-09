import OpenAI from '@openai/openai';

export async function translate(origin: string) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
### WHAT TO DO
Translate given markdown in Korean.

### TRANSLATION  RULES
- ALWAYS finish every korean sentenses with "요".
- Do not translate or delete title.
- Do not change structure of document
- ALWAYS translate this subtitles to
  - Interface : 인터페이스
  - Parameters : 파라미터
  - Return Value : 반환 값
  - Example : 예시
- Do not translate contents in backticks and triple backticks, but translate "string values" in codes inside triple backticks
- Do not translate body and other props of Interface component, but only "description infos" in it. "description infos" mean value of description props, value of each item's description prop in nested array.
- If there are any unnatural or awkward sentences, please rewrite them in a more natural and fluent way.

### RETURN FORMAT
\`\`\`json
{
  "result": "<TRANSLATED MARKDOWN HERE>"
}
\`\`\`

---

### INPUT
\`\`\`
${origin}
\`\`\`
  `;

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  const translatedItem = response.choices[0].message.content;

  if (translatedItem == null) {
    throw new Error(`API Error while translating.`);
  }

  const translatedDoc: string = JSON.parse(translatedItem).result;

  return translatedDoc;
}
