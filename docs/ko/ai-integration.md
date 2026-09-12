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
- 어떤 페이지든 주소 끝에 `.md`를 붙이면 원본 Markdown을 반환해요. 예: [`/hooks/useDebounce.md`](https://react-simplikit.slash.page/hooks/useDebounce.md)

## Context7

react-simplikit은 [Context7](https://context7.com/toss/react-simplikit)에 `/toss/react-simplikit`으로 등록되어 있어요. Context7 MCP 서버를 쓰는 에이전트는 별도 설정 없이 문서를 조회할 수 있어요.

## 에이전트 접근 확인하기

1. 설치한 스킬이나 [llms.txt](https://react-simplikit.slash.page/llms.txt)를 사용해 구체적인 작업에 맞는 API를 찾도록 요청하세요. 예를 들어 검색 콜백을 300ms 늦추는 작업을 요청할 수 있어요.
2. 연결된 [useDebounce Markdown 레퍼런스](https://react-simplikit.slash.page/hooks/useDebounce.md)를 읽고, 코드를 쓰기 전에 import, 파라미터, 기본값과 정리 동작을 설명하도록 요청하세요.
3. `react-simplikit`의 named import를 사용하는지, 콜백을 늦추는 것과 값을 늦추는 것을 구분하는지, 대기 중인 콜백 취소가 이미 시작한 요청을 중단하지 않는다고 설명하는지 확인하세요.
4. 설치한 패키지 버전에서 해당 API를 제공하는지 확인하고 프로젝트에서 코드를 실행하세요. 웹사이트는 최신 문서를 제공하므로, 문서를 정확하게 찾았더라도 이전 설치 버전과 호환된다고 보장할 수는 없어요.

에이전트가 스킬을 불러오거나 사이트에 접근하지 못하면 필요한 Markdown 레퍼런스를 직접 제공하세요. 설치만으로 에이전트가 문서를 읽었다고 확인할 수는 없어요. 생성된 스킬 카탈로그에는 API 항목이 있어요. 필요한 동작을 설명할 때는 [문제별 사용법](/ko/use-cases)을 참고하세요.
