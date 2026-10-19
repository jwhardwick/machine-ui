---
'@machine-ui/ui': patch
---

Sidebar and StreamingText no longer cause a hydration mismatch. On a phone-sized screen the Sidebar's first client render used to differ from the server HTML (a sheet instead of a panel), and StreamingText did the same for visitors who prefer reduced motion. React then re-rendered the whole page on the client, which in Next.js dropped attributes set before hydration, such as a site's theme on `<html>`. Both now render the server's version first and switch once hydrated.
