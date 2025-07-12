# Codeforces++ 🚀

_A one‑file Tampermonkey script that turns every Codeforces problem page into a mini‑IDE._

|                                                    |                                                        |
| -------------------------------------------------- | ------------------------------------------------------ |
| **Write • Run • Submit** right under the statement | Copy, navigate, or get AI help without leaving the tab |

---

## ⚡ Quick look

![demo](Media/file.gif)

---

## 🔑 Why you’ll love it

| ✨ Feature                     | 1‑liner                                                             |
| ------------------------------ | ------------------------------------------------------------------- |
| **VS‑Code‑like Monaco editor** | dark theme, C++/Py/Java/JS/C colouring, smart width                 |
| **One‑tap Submit**             | preview ➜ confirm ➜ done                                            |
| **Prev / Next**                | keyboard‑friendly problem hopping                                   |
| **Copy statement**             | problem + samples to clipboard                                      |
| **AI coach buttons**           | _Perplexity_ & _ChatGPT_ explain (no code leaked) and no api needed |
| **YouTube jump**               | open tutorials on youtube instantly                                 |
| **Tool shortcuts**             | Excalidraw whiteboard, cpp.sh, etc.                                 |
| **Dark UI & smooth pops**      | gradient header, toast notifications                                |

---

## 🛠 Install (60 s)

1.  **Add Tampermonkey** → [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) • [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/)
2.  _Create new script_ → paste content of `tamper.js` → **Save**
3.  Refresh a Codeforces problem page. That’s it.

---

## 💡 Usage cheatsheet

| Action               | How                                     |
| -------------------- | --------------------------------------- |
| **Code**             | Editor appears below statement          |
| **Switch lang**      | Dropdown in blue header (auto‑template) |
| **Submit**           | 🚀 button → preview → confirm           |
| **Jump problems**    | ← / → buttons at top                    |
| **Copy statement**   | Sidebar ➜ **Copy Problem**              |
| **AI Explain**       | Sidebar ➜ Perplexity / ChatGPT          |
| **Toggle dark mode** | Moon / Sun in Codeforces navbar         |
| **Settings**         | ⚙️ in sidebar (enable/disable modules)  |

---

## 🧠 Under the hood (TL;DR)

-   Vanilla JS + Monaco CDN
-   Injected only on problem URLs
-   Cleans up observers to avoid leaks
-   Never sends code anywhere (AI opens in new tab with prompt)

---

## 🛠 Troubleshoot

-   Editor missing → refresh / check Tampermonkey enabled
-   CDN blocked → pause ad‑blockers
-   Buttons gone → ensure you’re on a _problem_ URL pattern above

---

## 📜 License

MIT – fork, tweak, enjoy.  
PRs & ideas welcome!
