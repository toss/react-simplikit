---
description: AI 코딩 에이전트와 함께 react-simplikit 사용하기
---

# AI 연동

react-simplikit은 AI 코딩 에이전트(Claude Code, Codex, Cursor 등)가 훅을 직접 새로 짜는 대신 라이브러리에 있는 것을 찾아 쓰도록 돕는 자료를 함께 제공해요.

## 에이전트 스킬

`react-simplikit` 스킬은 모든 훅·컴포넌트·유틸리티를 한 줄 설명과 함께 정리한 카탈로그와, import·SSR 규칙을 담고 있어요. 설치해 두면 에이전트가 디바운스, 스로틀, 바깥 클릭 감지, 키보드 회피 같은 로직을 직접 작성하기 전에 카탈로그를 먼저 확인하고, 사용하기 전에 함께 들어 있는 레퍼런스 페이지를 읽어요.

::: code-group

```sh [skills.sh]
npx skills add toss/react-simplikit --skill react-simplikit
```

```sh [Claude Code]
claude plugin marketplace add https://github.com/toss/react-simplikit --sparse .claude-plugin packages/plugin
claude plugin install react-simplikit@react-simplikit
```

```sh [Codex]
codex plugin marketplace add https://github.com/toss/react-simplikit
# 이후 플러그인 UI에서 "react-simplikit"을 설치해요
```

:::

스킬은 이 문서 페이지들에서 생성되므로 라이브러리와 항상 같은 내용을 유지해요. 소스는 [`packages/plugin`](https://github.com/toss/react-simplikit/tree/main/packages/plugin)에 있어요.

## llms.txt

문서는 에이전트가 바로 읽을 수 있는 형식으로도 제공돼요.

- [`/llms.txt`](https://react-simplikit.slash.page/llms.txt) — 모든 페이지의 목록과 한 줄 요약
- [`/llms-full.txt`](https://react-simplikit.slash.page/llms-full.txt) — 전체 문서를 하나로 합친 파일
- 어떤 페이지든 주소 끝에 `.md`를 붙이면 원본 Markdown을 반환해요. 예: [`/core/hooks/useDebounce.md`](https://react-simplikit.slash.page/core/hooks/useDebounce.md)

## Context7

react-simplikit은 [Context7](https://context7.com/toss/react-simplikit)에 `/toss/react-simplikit`으로 등록되어 있어요. Context7 MCP 서버를 쓰는 에이전트는 별도 설정 없이 문서를 조회할 수 있어요.
