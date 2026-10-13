# MetaMystia 문서 기여 가이드

이 문서는 [**meta-mystia-doc**](https://github.com/MetaMystia/meta-mystia-doc) 저장소에서 [**mdBook**](https://rust-lang.github.io/mdBook/index.html)으로 문서를 작성하고 유지하는 방법을 안내합니다. 기본 흐름, 로컬 미리보기, 디렉터리 구조, 커밋 규칙을 다루므로 처음 기여하는 개발자도 빠르게 시작할 수 있습니다.

## 1. 저장소와 도구

- **저장소**: [https://github.com/MetaMystia/meta-mystia-doc](https://github.com/MetaMystia/meta-mystia-doc)
- **문서 도구**: [mdBook](https://rust-lang.github.io/mdBook/index.html)(Rust 프로젝트가 유지하는 문서 생성 도구)
- **패키지 관리자**: [pnpm](https://pnpm.io/installation)

mdBook은 Markdown을 작성 형식으로 사용하고 `SUMMARY.md`로 문서 구조를 관리하므로, 구조가 명확하고 유지하기 쉬운 기술 문서에 적합합니다.

Markdown 내용만 수정한다면 저장소를 복제한 뒤 바로 편집할 수 있습니다. 포맷, 로컬 빌드, 실시간 미리보기까지 하려면 Node.js, pnpm, mdBook을 미리 설치하세요.

## 2. 기본 작성 흐름(로컬 실시간 미리보기 불필요)

문서 내용을 추가하거나 수정만 하고 로컬에서 렌더링 결과를 확인할 필요가 없다면 다음의 가장 간단한 흐름을 사용하세요. 본문은 언어별로 `content/<언어>` 디렉터리에 있으며, 중국어 간체는 `content/zh-CN`이고 다른 언어의 번역 원본이기도 합니다.

### 1단계: 저장소 복제

```bash
git clone https://github.com/MetaMystia/meta-mystia-doc
cd meta-mystia-doc
```

### 2단계: 의존성 설치(로컬에서 확인할 때)

```bash
pnpm i
```

이 단계는 프로젝트의 Node.js 의존성을 설치합니다. 순수한 텍스트 수정이라면 건너뛸 수 있지만, 제출 전에 로컬 포맷과 빌드 확인을 하는 것을 권장합니다.

### 3단계: 문서 파일 추가

- `content/zh-CN` 디렉터리에 하위 폴더 생성(문서 분류용)
- 해당 폴더에 `.md` 파일 생성

예:

```text
content/zh-CN/
 └─ guide/
    └─ getting_started.md
```

### 4단계: `content/zh-CN/SUMMARY.md` 수정

방금 만든 파일을 `SUMMARY.md`에 선언해 문서 목차에 나타나게 합니다.

`SUMMARY.md`에 선언하지 않으면 그 문서는 mdBook으로 빌드되거나 표시되지 않습니다.

## 3. 로컬 실시간 미리보기가 있는 작성 흐름

작성하면서 렌더링 결과를 실시간으로 보고 싶다면 mdBook의 로컬 서버 기능을 사용하세요.

### 1-2단계: 저장소 복제 및 의존성 설치

기본 흐름과 같습니다:

```bash
git clone https://github.com/MetaMystia/meta-mystia-doc
cd meta-mystia-doc
pnpm i
```

### 3단계: mdBook 설치

공식 가이드에 따라 mdBook을 설치하세요:
[https://rust-lang.github.io/mdBook/guide/installation.html](https://rust-lang.github.io/mdBook/guide/installation.html)

### 4단계: `content/zh-CN/SUMMARY.md` 수정

만들 예정인 문서 경로를 `SUMMARY.md`에 미리 선언하세요. 해당 `.md` 파일이 아직 없어도 괜찮습니다.

### 5단계: 로컬 미리보기 서버 시작

```bash
pnpm i18n:serve
```

이 명령은 mdBook으로 5개 언어를 빌드하고 병합한 뒤:

- `SUMMARY.md`를 읽고
- 없는 Markdown 파일을 자동으로 만들고
- 로컬 HTTP 서버를 시작합니다

터미널에 로컬 접속 주소(보통 `http://localhost:3000`)가 출력됩니다.

### 6단계: 문서 편집

`content/zh-CN` 디렉터리의 Markdown 파일을 직접 편집하세요. 저장하면 브라우저가 자동으로 새로고침되어 최신 내용을 보여 줍니다.

## 4. `SUMMARY.md` 파일 설명

`SUMMARY.md`는 문서 전체의 구조를 설명하며 '목차'와 같은 역할을 합니다.

### 기본 규칙

- Markdown 목록 문법 사용
- 각 항목이 `.md` 파일 하나에 대응
- 여러 단계의 중첩을 지원하며 장 계층 관계를 나타냄

mdBook 공식 문서의 작성법을 참고하세요:
[SUMMARY.md](https://github.com/rust-lang/mdBook/blob/master/guide/src/SUMMARY.md)

다음을 반드시 확인하세요:

- 경로가 `content/zh-CN` 디렉터리의 실제 파일 경로와 일치하는지
- 파일 이름은 소문자를 쓰고 공백 대신 밑줄(snake_case)을 사용하는지

다른 언어도 `content/zh-CN`과 완전히 같은 디렉터리 구조와 파일 이름을 사용하며 본문만 번역합니다. 중국어 원문을 수정했다면 다른 언어도 함께 갱신해 언어별 버전이 어긋나지 않게 하세요.

## 5. 변경 커밋과 풀 리퀘스트

### 커밋 전 확인

저장소 루트에서 실행합니다:

```bash
pnpm format
pnpm i18n:sync
```

`pnpm format`은 저장소에서 Prettier가 지원하는 파일을 정리하고, `pnpm i18n:sync`는 소스로 문서 사이트 전체를 빌드합니다. 실행 후 `git diff`를 확인해 이번 수정과 무관한 포맷 변경이 섞이지 않았는지 확인하세요.

### 변경 커밋

확인을 통과하면 이번 작업과 관련된 파일만 스테이징하고 커밋합니다. 예:

```bash
git add content/zh-CN/guide/getting_started.md content/zh-CN/SUMMARY.md
git commit -m "docs: add getting started guide"
```

### 커밋 메시지 규칙

[**@commitlint/config-conventional**](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)이 이 저장소의 커밋 규칙 검증 기준입니다.

커밋 메시지가 Conventional Commits 규칙을 따르는지 확인하세요. 그렇지 않으면 커밋이 거부될 수 있습니다.

### 풀 리퀘스트 만들기

- 커밋을 자신의 Fork 브랜치에 푸시
- GitHub에서 Pull Request 생성
- 수정 내용과 목적을 간단히 설명

## 6. 추가 조언

- 각 Markdown 파일은 하나의 주제에 집중해 내용이 지나치게 커지지 않게 하세요
- 중국어와 영어 사이에 **공백을 직접 넣을 필요가 없습니다**. 사이트 CSS가 중국어와 영문/숫자 사이의 자간을 자동으로 처리하므로 Markdown은 자연스럽게 작성하고, 레이아웃을 위해 불필요한 공백을 넣지 마세요

mdBook의 더 고급 사용법이 궁금하다면 공식 가이드에서 테마 설정, 플러그인, 사용자 지정 빌드 흐름을 확인하세요.

위 단계를 마치면 프로젝트에 문서로 기여할 수 있습니다.
