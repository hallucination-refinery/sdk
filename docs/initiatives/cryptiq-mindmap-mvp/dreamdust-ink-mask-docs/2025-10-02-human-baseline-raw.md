# 2025-10-02 Human Baseline — Raw Capture

## 0) What you will produce (save these exact files)

- Screenshot: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-02-human-baseline.png`
- Console log: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-02-human-baseline-console.txt`
- Spector capture: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-02-human-baseline-spector.json`
- This raw report (the file you are reading): `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-02-human-baseline-raw.md`

---

## 1) Metadata

- Branch / PR: `codex/instrument-vertex-positions-for-debugging`
- Latest commit: `01c1039a` — docs(telemetry): empty reply investigation — no issue found
- Prior fix commit: `6684e467` — fix(telemetry): restore collector to client effect
- Date & Time (local): 2025-10-02 7:30 PM ET
- Environment (host): macOS, Node v20 (nvm), Next.js 15.3.5
- Device & Browser: (fill: e.g., “MacBook Pro M1 Pro, Chrome 128 incognito”)
- Diagnostic URL (exact):
  `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1&forceAlpha=1&vertexLog=1`

---

## 2) Preflight (run exactly in a macOS terminal)

```
williambarron@Williams-MacBook-Pro refinery-sdk % cd /Users/williambarron/hallucination-refinery/refinery-sdk
williambarron@Williams-MacBook-Pro refinery-sdk % nvm use 20
Now using node v20.19.5 (npm v10.8.2)
williambarron@Williams-MacBook-Pro refinery-sdk % rm -rf apps/cryptiq-mindmap-demo/.next
williambarron@Williams-MacBook-Pro refinery-sdk % lsof -ti:3000 | xargs kill -9 || true
williambarron@Williams-MacBook-Pro refinery-sdk % pnpm --filter cryptiq-mindmap-demo run build

> cryptiq-mindmap-demo@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-sdk/apps/cryptiq-mindmap-demo
> next build

   ▲ Next.js 15.3.5
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 10.0s
   Skipping validation of types
   Skipping linting
 ⚠ Using edge runtime on a page currently disables static generation for that page
 ✓ Collecting page data
 ✓ Generating static pages (7/7)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                                 Size  First Load JS
┌ ○ /                                    3.71 kB         106 kB
├ ○ /_not-found                            143 B         102 kB
├ ƒ /api/brain-acceptance                  143 B         102 kB
├ ƒ /api/og                                143 B         102 kB
├ ○ /brain                                 27 kB         357 kB
├ ○ /debug/caps                          5.38 kB         107 kB
├ ○ /draw3d                              7.83 kB         335 kB
├ ƒ /quiz/[slug]                         31.9 kB         362 kB
└ ƒ /result/[id]                         2.04 kB         104 kB
+ First Load JS shared by all             102 kB
  ├ chunks/226-98d803d27003ca72.js       46.6 kB
  ├ chunks/8d5daf79-879d5759a0deefd7.js  53.2 kB
  └ other shared chunks (total)          2.22 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

williambarron@Williams-MacBook-Pro refinery-sdk % PORT=3000 pnpm --filter cryptiq-mindmap-demo run start

> cryptiq-mindmap-demo@0.1.0 start /Users/williambarron/hallucination-refinery/refinery-sdk/apps/cryptiq-mindmap-demo
> next start

   ▲ Next.js 15.3.5
   - Local:        http://localhost:3000
   - Network:      http://192.168.123.38:3000

 ✓ Starting...
 ✓ Ready in 502ms
```

- Leave the server running after the “Ready” banner. Only paste errors here if a step fails.

---

## 3) Server health check (paste the result below)

- Command (new terminal):

```
williambarron@Williams-MacBook-Pro refinery-sdk % curl -v "http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1&forceAlpha=1&vertexLog=1"
*   Trying 127.0.0.1:3000...
* Connected to 127.0.0.1 (127.0.0.1) port 3000
> GET /quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1&forceAlpha=1&vertexLog=1 HTTP/1.1
> Host: 127.0.0.1:3000
> User-Agent: curl/8.7.1
> Accept: */*
>
* Request completely sent off
< HTTP/1.1 200 OK
< Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Accept-Encoding
< link: </_next/static/media/62c97acc3aa63787-s.p.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/98e207f02528a563-s.p.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/d3ebbfd689654d3a-s.p.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2"
< X-Powered-By: Next.js
< Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
< Content-Type: text/html; charset=utf-8
< Date: Thu, 02 Oct 2025 23:38:49 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< Transfer-Encoding: chunked
<
<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="/_next/static/css/56f64c2e772a219d.css" data-precedence="next"/><link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/webpack-637dc46fbeaa6522.js"/><script src="/_next/static/chunks/8d5daf79-879d5759a0deefd7.js" async=""></script><script src="/_next/static/chunks/226-98d803d27003ca72.js" async=""></script><script src="/_next/static/chunks/main-app-f1bb941543fc0657.js" async=""></script><script src="/_next/static/chunks/app/error-46f15186f1e1c1ef.js" async=""></script><script src="/_next/static/chunks/app/not-found-2ad43349425391ef.js" async=""></script><script src="/_next/static/chunks/8e69f44d-63a8a1d2707f0648.js" async=""></script><script src="/_next/static/chunks/e26c7fe5-7e39a566d4b7fd02.js" async=""></script><script src="/_next/static/chunks/97c4d9bb-ba25738685b10510.js" async=""></script><script src="/_next/static/chunks/378-5961cd1ca460479a.js" async=""></script><script src="/_next/static/chunks/248-641043f09b85aaed.js" async=""></script><script src="/_next/static/chunks/488-a0e72c78960ec3b7.js" async=""></script><script src="/_next/static/chunks/app/quiz/%5Bslug%5D/page-c08c0c9554e451be.js" async=""></script><meta name="next-size-adjust" content=""/><title>Cryptiq Mind Map Demo</title><meta name="description" content="Interactive mind map visualization with 1000+ nodes"/><link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16"/><script>document.querySelectorAll('body link[rel="icon"], body link[rel="apple-touch-icon"]').forEach(el => document.head.appendChild(el))</script><script src="/_next/static/chunks/polyfills-42372ed130431b0a.js" noModule=""></script></head><body class="__variable_ec6dc7 __variable_46fe82" style="background:#000"><div hidden=""><!--$--><!--/$--></div><div style="padding:24px;color:#9ab">Loading…</div><!--$--><!--/$--><script src="/_next/static/chunks/webpack-637dc46fbeaa6522.js" async=""></script><script>(self.__next_f=self.__next_f||[]).push([0])</script><script>self.__next_f.push([1,"1:\"$Sreact.fragment\"\n2:I[6185,[],\"\"]\n3:I[1454,[\"39\",\"static/chunks/app/error-46f15186f1e1c1ef.js\"],\"default\"]\n4:I[1053,[],\"\"]\n5:I[9288,[\"345\",\"static/chunks/app/not-found-2ad43349425391ef.js\"],\"default\"]\n6:I[4320,[],\"ClientPageRoot\"]\n7:I[194,[\"611\",\"static/chunks/8e69f44d-63a8a1d2707f0648.js\",\"190\",\"static/chunks/e26c7fe5-7e39a566d4b7fd02.js\",\"255\",\"static/chunks/97c4d9bb-ba25738685b10510.js\",\"378\",\"static/chunks/378-5961cd1ca460479a.js\",\"248\",\"static/chunks/248-641043f09b85aaed.js\",\"488\",\"static/chunks/488-a0e72c78960ec3b7.js\",\"938\",\"static/chunks/app/quiz/%5Bslug%5D/page-c08c0c9554e451be.js\"],\"default\"]\n8:I[3215,[],\"OutletBoundary\"]\nb:I[1125,[],\"AsyncMetadataOutlet\"]\nd:I[3215,[],\"ViewportBoundary\"]\nf:I[3215,[],\"MetadataBoundary\"]\n11:I[3176,[],\"\"]\n12:\"$Sreact.suspense\"\n13:I[1125,[],\"AsyncMetadata\"]\n:HL[\"/_next/static/media/62c97acc3aa63787-s.p.woff2\",\"font\",{\"crossOrigin\":\"\",\"type\":\"font/woff2\"}]\n:HL[\"/_next/static/media/98e207f02528a563-s.p.woff2\",\"font\",{\"crossOrigin\":\"\",\"type\":\"font/woff2\"}]\n:HL[\"/_next/static/media/d3ebbfd689654d3a-s.p.woff2\",\"font\",{\"crossOrigin\":\"\",\"type\":\"font/woff2\"}]\n:HL[\"/_next/static/css/56f64c2e772a219d.css\",\"style\"]\n"])</script><script>self.__next_f.push([1,"0:{\"P\":null,\"b\":\"BPf_p2YwRtnutF7HjnTkA\",\"p\":\"\",\"c\":[\"\",\"quiz\",\"archetype-v1?pc=scene-02\u0026debug=1\u0026engine=sim\u0026inkProbe=1\u0026simProbe=1\u0026simStats=1\u0026inkStats=1\u0026forceAlpha=1\u0026vertexLog=1\"],\"i\":false,\"f\":[[[\"\",{\"children\":[\"quiz\",{\"children\":[[\"slug\",\"archetype-v1\",\"d\"],{\"children\":[\"__PAGE__?{\\\"pc\\\":\\\"scene-02\\\",\\\"debug\\\":\\\"1\\\",\\\"engine\\\":\\\"sim\\\",\\\"inkProbe\\\":\\\"1\\\",\\\"simProbe\\\":\\\"1\\\",\\\"simStats\\\":\\\"1\\\",\\\"inkStats\\\":\\\"1\\\",\\\"forceAlpha\\\":\\\"1\\\",\\\"vertexLog\\\":\\\"1\\\"}\",{}]}]}]}* Connection #0 to host 127.0.0.1 left intact
,\"$undefined\",\"$undefined\",true],[\"\",[\"$\",\"$1\",\"c\",{\"children\":[[[\"$\",\"link\",\"0\",{\"rel\":\"stylesheet\",\"href\":\"/_next/static/css/56f64c2e772a219d.css\",\"precedence\":\"next\",\"crossOrigin\":\"$undefined\",\"nonce\":\"$undefined\"}]],[\"$\",\"html\",null,{\"lang\":\"en\",\"children\":[\"$\",\"body\",null,{\"className\":\"__variable_ec6dc7 __variable_46fe82\",\"style\":{\"background\":\"#000\"},\"children\":[\"$\",\"$L2\",null,{\"parallelRouterKey\":\"children\",\"error\":\"$3\",\"errorStyles\":[],\"errorScripts\":[],\"template\":[\"$\",\"$L4\",null,{}],\"templateStyles\":\"$undefined\",\"templateScripts\":\"$undefined\",\"notFound\":[[\"$\",\"$L5\",null,{}],[]],\"forbidden\":\"$undefined\",\"unauthorized\":\"$undefined\"}]}]}]]}],{\"children\":[\"quiz\",[\"$\",\"$1\",\"c\",{\"children\":[null,[\"$\",\"$L2\",null,{\"parallelRouterKey\":\"children\",\"error\":\"$undefined\",\"errorStyles\":\"$undefined\",\"errorScripts\":\"$undefined\",\"template\":[\"$\",\"$L4\",null,{}],\"templateStyles\":\"$undefined\",\"templateScripts\":\"$undefined\",\"notFound\":\"$undefined\",\"forbidden\":\"$undefined\",\"unauthorized\":\"$undefined\"}]]}],{\"children\":[[\"slug\",\"archetype-v1\",\"d\"],[\"$\",\"$1\",\"c\",{\"children\":[null,[\"$\",\"$L2\",null,{\"parallelRouterKey\":\"children\",\"error\":\"$undefined\",\"errorStyles\":\"$undefined\",\"errorScripts\":\"$undefined\",\"template\":[\"$\",\"$L4\",null,{}],\"templateStyles\":\"$undefined\",\"templateScripts\":\"$undefined\",\"notFound\":\"$undefined\",\"forbidden\":\"$undefined\",\"unauthorized\":\"$undefined\"}]]}],{\"children\":[\"__PAGE__\",[\"$\",\"$1\",\"c\",{\"children\":[[\"$\",\"$L6\",null,{\"Component\":\"$7\",\"searchParams\":{\"pc\":\"scene-02\",\"debug\":\"1\",\"engine\":\"sim\",\"inkProbe\":\"1\",\"simProbe\":\"1\",\"simStats\":\"1\",\"inkStats\":\"1\",\"forceAlpha\":\"1\",\"vertexLog\":\"1\"},\"params\":{\"slug\":\"archetype-v1\"}}],null,[\"$\",\"$L8\",null,{\"children\":[\"$L9\",\"$La\",[\"$\",\"$Lb\",null,{\"promise\":\"$@c\"}]]}]]}],{},null,false]},null,false]},null,false]},null,false],[\"$\",\"$1\",\"h\",{\"children\":[null,[\"$\",\"$1\",\"RvVDo5QMVZUJIaNJ1RBNhv\",{\"children\":[[\"$\",\"$Ld\",null,{\"children\":\"$Le\"}],[\"$\",\"meta\",null,{\"name\":\"next-size-adjust\",\"content\":\"\"}]]}],[\"$\",\"$Lf\",null,{\"children\":\"$L10\"}]]}],false]],\"m\":\"$undefined\",\"G\":[\"$11\",\"$undefined\"],\"s\":false,\"S\":false}\n"])</script><script>self.__next_f.push([1,"10:[\"$\",\"div\",null,{\"hidden\":true,\"children\":[\"$\",\"$12\",null,{\"fallback\":null,\"children\":[\"$\",\"$L13\",null,{\"promise\":\"$@14\"}]}]}]\na:null\ne:[[\"$\",\"meta\",\"0\",{\"charSet\":\"utf-8\"}],[\"$\",\"meta\",\"1\",{\"name\":\"viewport\",\"content\":\"width=device-width, initial-scale=1\"}]]\n9:null\nc:{\"metadata\":[[\"$\",\"title\",\"0\",{\"children\":\"Cryptiq Mind Map Demo\"}],[\"$\",\"meta\",\"1\",{\"name\":\"description\",\"content\":\"Interactive mind map visualization with 1000+ nodes\"}],[\"$\",\"link\",\"2\",{\"rel\":\"icon\",\"href\":\"/favicon.ico\",\"type\":\"image/x-icon\",\"sizes\":\"16x16\"}]],\"error\":null,\"digest\":\"$undefined\"}\n14:{\"metadata\":\"$c:metadata\",\"error\":null,\"digest\":\"$undefined\"}\n"])</script></body></html>%
williambarron@Williams-MacBook-Pro refinery-sdk %
```

---

## 4) Visual baseline (Chrome) — produce the screenshot and console log

1. Open Chrome (regular or incognito) and visit the URL above; the DevTools Console _is open_.
2. Let the scene settle for ~15 seconds (expect sim logs to tick).
3. Take a full-window screenshot and save to:
   `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-02-human-baseline.png`
4. I then continued to let the scene run for ~15 _more_ seconds before switching to another tab to stop the console from firing.
5. Copy all lines beginning with `[engine]`, `[sim]`, `[dreamdust]`, `[vertex]`, `[PC]` for ~30 seconds.
6. Save those console lines to:
   `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-02-human-baseline-console.txt`

---

## 5) Spector.js capture — produce the GPU evidence

1. With the page still open and settled, start Spector.js recording.
2. Capture a single frame (no interactions), then save the capture JSON to:
   `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-02-human-baseline-spector.json`
3. Note any suspicious passes/targets here:

```
I don't even know what I would put here
```

---

## 6) Observations (short bullets)

- Visuals seen (e.g., dark canvas, cloud/speck, HUD state): There was a flash of red **during** the countdown overlay and the same small white speck + jittering after the countdown overlay disappears.
- Any lag or glitches: It's very laggy.

---

## 7) Follow-ups / Next

- If telemetry logs include `[vertex]` samples, proceed with tap/stroke tests next (capture logs + screenshots for each interaction).
- If telemetry logs are absent, flag here so we can pivot to telemetry export checks in `PointCloudStage.tsx` and `vertexTelemetry.ts`.
