import OpenAI from 'openai';

export async function translate(origin: string) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
### WHAT TO DO
Translate given markdown in Korean.

### ALWAYS finish every korean sentenses with "요".

[example]
<input>
That is apple
</input>

<correct-output>
그것은 사과예요
</correct-output>

<wrong-output>
그것은 사과입니다
</wrong-output>

### Do not translate or delete title.

[example]
<input>
# Title

Welcome to the world of React
</input>

<correct-output>
# Title

리액트 세상에 오신 것을 환영해요
</correct-output>

<wrong-output>
# 제목

리액트 세상에 오신 것을 환영해요
</wrong-output>

### Do not change structure of document

[example]
<input>
# Title

## Subtitle 1

content 1

## Subtitle 2

content 2
</input>

<correct-output>
# Title

## 서브타이틀 1

내용 1

## 서브타이틀 2

내용 2
</correct-output>

<wrong-output>
# Title

## 서브타이틀 2

내용 2
</wrong-output>

### ALWAYS translate subtitles with below rules
  - Translate \`Interface\` to \`인터페이스\`
  - Translate \`Parameters\` to \`파라미터\`
  - Translate \`Return Value\` to \`반환 값\`
  - Translate \`Example\` to \`예시\`

### Do not translate contents in backticks and triple backticks, but translate "string values" in codes inside triple backticks.
- example of "string values"
  - values in \`console.log\`
  - text nodes in HTML tags
  - comments in code blocks

[example]
<input>
Value of \`result\` is \`true\`

\`\`\`ts
function sum(a, b) {
  console.log(\`sum of \${a} and \${b} is \${a + b}\`);
  return a + b;
}

const result = sum(1, 3) === 4;
console.log(\`result is \${result}\`);
\`\`\`
</input>

<correct-output>
\`result\`의 값은 \`true\`예요

\`\`\`ts
function sum(a, b) {
  console.log(\`\${a}와 \${b}의 합은 \${a + b}예요\`);
  return a + b;
}

const result = sum(1, 3) === 4;
console.log(\`result는 \${result}예요\`);
\`\`\`
</correct-output>

<wrong-output>
\`결과\`의 값은 \`참\`이에요

\`\`\`ts
function 더하기(a, b) {
  console.log(\`\${a}와 \${b}의 합은 \${a + b}예요\`);
  return a + b;
}

const 결과 = 더하기(1, 3) === 4;
console.log(\`결과는 \${결과}예요\`);
\`\`\`
</wrong-output>

<wrong-output-2>
\`result\`의 값은 \`true\`예요

\`\`\`ts
function sum(a, b) {
  console.log(\`sum of \${a} and \${b} is \${a + b}\`);
  return a + b;
}

const result = sum(1, 3) === 4;
console.log(\`result is \${result}\`);
\`\`\`
</wrong-output-2>

### Do not translate body and other props of \`Interface\` component in Interface section, but only "description infos" in it. 
- "description infos" mean value of description prop, values of each item's description prop in nested array.

<input>
<Interface
  name="options"
  type="DebounceOptions"
  description="Configuration options for debounce behavior."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'If <code>true</code>, the function is called at the start of the sequence.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'If <code>true</code>, the function is called at the end of the sequence.',
    },
  ]"
/>
</input>

<correct-output>
<Interface
  name="options"
  type="DebounceOptions"
  description="디바운스 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      defaultValue: 'false',
      description:
        '만약 <code>true</code>이면, 함수는 시퀀스의 시작에 호출돼요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      defaultValue: 'true',
      description:
        '만약 <code>true</code>이면, 함수는 시퀀스의 끝에 호출돼요.',
    },
  ]"
/>
</correct-output>

<wrong-output>
<인터페이스
  name="옵션"
  type="디바운스옵션"
  description="디바운스 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: '옵션.leading',
      type: '불리언',
      defaultValue: 'false',
      description:
        '만약 <code>true</code>이면, 함수는 시퀀스의 시작에 호출돼요.',
    },
    {
      name: '옵션.trailing',
      type: '불리언',
      defaultValue: 'true',
      description:
        '만약 <code>true</code>이면, 함수는 시퀀스의 끝에 호출돼요.',
    },
  ]"
/>
</wrong-output>

<correct-output-2>
<Interface
  name="options"
  type="DebounceOptions"
  description="디바운스 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      defaultValue: 'false',
      description:
        '만약 <코드>참</코드>이면, 함수는 시퀀스의 시작에 호출돼요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      defaultValue: 'true',
      description:
        '만약 <코드>참</코드>이면, 함수는 시퀀스의 끝에 호출돼요.',
    },
  ]"
/>
</correct-output-2>

### If possible, use easy-to-understand words.
- If there is no pure-korean word to translate, use naturalized words.
- If you translated jargon to easy-to-understand words, comment the translated jargon in the end of the sentences with brackets.

[example]
<input>
'pending' means waiting for something to be done.
'debounce' means delaying the execution of a function until a certain amount of time has passed.
</input>

<correct-output>
'보류'는 무언가가 완료될 때까지 기다리는 것을 의미해요.
'디바운스'는 함수의 실행을 지연시키는 것을 의미해요.
</correct-output>

<wrong-output>
'펜딩'은 무언가가 완료될 때까지 기다리는 것을 의미해요.
'디바운스'는 함수의 실행을 지연시키는 것을 의미해요.
</wrong-output>

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
    model: 'gpt-3.5-turbo',
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
