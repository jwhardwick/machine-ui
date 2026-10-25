# 0004: Voice for site copy

Date: 2026-10-25 · Status: accepted

## Context

The maintainer asked for the docs site copy to be more relaxed and less like AI-written marketing,
roughly following the [Google developer documentation style guide](https://developers.google.com/style).

## Decision

Site copy (pages, component and screen descriptions) follows the Google guide in spirit:

- Plain, conversational sentences in second person and present tense. Contractions are fine.
- Say what a thing does. No taglines, slogans, or metaphors ("the site is wearing", "take it with you").
- Sentence-case headings with no full stop.
- Short sentences instead of colon lists and semicolon chains.
- Serial comma in lists of three or more.
- "Might" for possibility, not "may".

## Defaults chosen

| Question | Default | Why |
| --- | --- | --- |
| US or British spelling? | British (colour, customise, labelled). | The rest of the repo, including the spec and token docs, is British. The Google guide's US spelling is the one rule we don't follow. |
| Does the install prompt and `llms.txt` prose follow this too? | No, only text written for people. | Agent-facing text is written as direct instructions, which is a different job. |
