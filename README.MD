# Codeforces++ 🚀

Hey, competitive programmer! **Codeforces++** is a Tampermonkey userscript that makes your Codeforces experience faster and smarter. Navigate problems, copy statements, watch tutorials, and get AI help—all from one handy sidebar. Ready to level up?

## 🎬 Demo  

<img src="Media/file.gif" alt="file" style="zoom:200%;" />



## ✨ Features

-   **Problem Navigation**: Switch between problems with **Previous** and **Next** buttons.
-   **Copy Problem Statement**: Grab the whole problem (with examples!) in one click.
-   **Solutions & Tutorials**: Find video help for the problem instantly.
-   **AI Explanations**: Understand problems better with:
    -   Perplexity AI
    -   ChatGPT
-   **Coding Tools**: Quick access to essential development tools:
    -   Whiteboard for brainstorming
    -   Online IDE (Ideone) for quick code testing

(No API key needed!)

## 🛠️ Installation

1. Install the [Tampermonkey](https://www.tampermonkey.net/) extension for your browser.
2. Click the Tampermonkey icon and pick **"Create a new script"**.
3. Clear out any text in the editor.
4. Copy all of `tamper.js` and paste it in.
5. Hit **Ctrl+S** (or File → Save) to save it.

**Tip**: Double-check Tampermonkey is turned on!

## 📖 Usage

Visit a Codeforces problem page, and the script kicks in:

-   **Navigation Buttons**: See **Previous** and **Next** at the top—jump between problems easily.
-   **Codeforces++ Sidebar**: A cool sidebar pops up with:
    -   **Copy Problem**: Copies everything to your clipboard.
    -   **Solutions Tutorials**: Opens YouTube with problem-related videos.
    -   **Perplexity Explain/ChatGPT Explain**: Get clear explanations to learn, not cheat!
-   **Coding Tools Sidebar**: Quick access to external tools:
    -   **Whiteboard**: Opens a new whiteboard for diagramming algorithms.
    -   **Code in Ideone**: Opens Ideone's online IDE for quick code testing.

**Note**: AI and YouTube need internet, but the script keeps your data private.

## 🔍 How It Works

Here's the magic behind Codeforces++:

-   Adds sidebars that fit right into Codeforces' look.
-   Pulls problem details using webpage tricks (DOM manipulation).
-   Links problems for easy navigation.
-   Uses smart AI questions to help you learn.
-   Integrates with external coding tools to speed up your workflow.

It's all vanilla JavaScript—fast and simple!

## 🤖 AI Learning Help

The script asks AI tools to explain problems in a way that boosts your skills—like a tutor! It's about understanding, not just solving.

## 👨‍🏫 AI Coach Prompts

Here's the exact prompt that turns ChatGPT and Perplexity into your personal competitive programming coach:

```
You are an expert competitive programming coach with decades of experience. Your goal is to explain this problem clearly and help the user understand how to approach it, without providing any actual code solution.

Please analyze this problem and provide:
1. A clear explanation of what the problem is asking in simple terms with examples
2. Identify the key constraints and requirements that will impact your solution approach
3. Break down the problem into smaller, more manageable parts with a step-by-step plan
4. Suggest 2-3 potential approaches or algorithms that could work, explaining the tradeoffs of each
5. Explain the time and space complexity considerations of each approach
6. Point out potential edge cases or tricky aspects of the problem that might lead to bugs
7. Explain any mathematical concepts, formulas, or theorems needed to understand the problem
8. Provide a visual explanation with a diagram, graph, or flowchart to help understand the problem
9. Use simple, friendly language appropriate for someone with basic programming knowledge (A2-B1 level)
10. Include 1-2 hints that guide toward the solution without giving it away completely

Remember, do NOT provide any actual code in your response, just guide the user toward understanding the problem and developing their own solution approach.
```

This prompt is carefully designed to help you learn rather than just get answers. The AI will:

-   Break down complex problems into understandable steps
-   Point out the important parts to focus on
-   Suggest different approaches without giving away the solution
-   Help you become a better problem solver!

## 🌐 Where It Works

These Codeforces pages are supported:

-   `https://codeforces.com/contest/*/problem/*`
-   `https://codeforces.com/problemset/problem/*/*`
-   `https://codeforces.com/gym/*/problem/*`
-   `https://codeforces.com/group/*/contest/*/problem/*`
-   `https://codeforces.com/edu/*/problem/*`

## 🚀 What's Next?

Future ideas:

-   More platforms (like AtCoder).
-   Offline problem saving.
-   Hints from the community.
-   Additional coding tools integration.

**Got ideas?** Share them with us!

## 🛡️ Troubleshooting

-   **Not working?** Check Tampermonkey is on.
-   **Buttons missing?** Make sure you're on a supported page.
-   **AI stuck?** Test your internet connection.

## 📄 License

MIT
