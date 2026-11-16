---
description: AI 코딩 에이전트와 함께 react-simplikit 사용하기
---

# AI 연동

react-simplikit은 AI 코딩 에이전트(Claude Code, Codex, Cursor 등)가 훅을 직접 짜는 대신 라이브러리에서 알맞은 훅을 찾아 쓰도록 돕는 자료를 함께 제공해요.

## 에이전트 스킬

`react-simplikit` 스킬에는 모든 훅·컴포넌트·유틸리티를 한 줄 설명과 함께 정리한 카탈로그와 import·SSR 규칙이 들어 있어요. 스킬을 설치하면 에이전트는 디바운스, 스로틀, 바깥 클릭 감지, 키보드 회피 같은 로직을 작성하기 전에 카탈로그를 확인하고, API를 사용하기 전에 함께 제공되는 레퍼런스 페이지를 읽을 수 있어요.

::: code-group

```sh [skills.sh]
npx skills add toss/react-simplikit --skill react-simplikit
npx skills add toss/react-simplikit --skill react-simplikit-codemod
```

```sh [Claude Code]
claude plugin marketplace add https://github.com/toss/react-simplikit --sparse .claude-plugin packages/plugin
claude plugin install react-simplikit@react-simplikit
```

```sh [Codex]
codex plugin marketplace add https://github.com/toss/react-simplikit
codex plugin add react-simplikit@react-simplikit
```

:::

Claude Code와 Codex 플러그인에는 `react-simplikit-codemod` 스킬도 들어 있어요. 이 스킬은 에이전트에게 업그레이드용 codemod를 실행하는 방법을 안내해요. skills.sh를 쓴다면 두 번째 명령으로 설치하세요.

`react-simplikit` 스킬은 이 문서 페이지로 만들어지므로 라이브러리와 내용이 항상 일치해요. 소스는 [`packages/plugin`](https://github.com/toss/react-simplikit/tree/main/packages/plugin)에 있어요.

## llms.txt

영어 문서는 에이전트가 바로 읽을 수 있는 형식으로도 제공해요.

- [`llms.txt`](https://react-simplikit.slash.page/llms.txt): 영어 문서 목록과 한 줄 요약
- [`llms-full.txt`](https://react-simplikit.slash.page/llms-full.txt): 영어 문서를 하나로 합친 파일
- 영어 문서 URL의 `.html`을 `.md`로 바꾸면 원본 Markdown을 읽을 수 있어요. 예를 들어 [`useDebounce.md`](https://react-simplikit.slash.page/hooks/useDebounce.md)를 읽어 보세요.

## Context7

react-simplikit은 [Context7](https://context7.com/toss/react-simplikit)에 `/toss/react-simplikit`으로 등록되어 있어요. Context7 MCP 서버를 쓰는 에이전트는 별도 설정 없이 문서를 조회할 수 있어요.

## 에이전트 접근 확인하기

1. 설치한 스킬이나 [llms.txt](https://react-simplikit.slash.page/llms.txt)를 사용해 구체적인 작업에 맞는 API를 찾도록 요청하세요. 예를 들어 검색 입력이 멈춘 뒤 300ms가 지나면 검색 함수를 호출하는 작업을 요청할 수 있어요.
2. 에이전트에게 연결된 [useDebounce Markdown 레퍼런스](https://react-simplikit.slash.page/hooks/useDebounce.md)를 읽게 한 뒤, 코드를 쓰기 전에 import, 파라미터, 기본값, 정리 동작을 설명하도록 요청하세요.
3. `react-simplikit`의 named import를 사용하는지, 콜백을 늦추는 것과 값을 늦추는 것을 구분하는지, 대기 중인 콜백을 취소해도 이미 시작한 요청은 중단되지 않는다고 설명하는지 확인하세요.
4. 설치한 패키지 버전에서 해당 API를 제공하는지 확인하고, 에이전트가 작성한 코드를 프로젝트에서 실행하세요. 웹사이트는 최신 문서를 제공하므로 문서를 정확하게 찾았더라도 더 이전 버전을 설치했다면 호환된다고 보장할 수 없어요.

에이전트가 스킬을 불러오거나 사이트에 접근하지 못하면 필요한 Markdown 레퍼런스를 직접 제공하세요. 설치만으로 에이전트가 문서를 읽었다고 확인할 수는 없어요. 필요한 동작을 설명할 때는 [문제별 사용법](/ko/use-cases)을 참고하세요.
