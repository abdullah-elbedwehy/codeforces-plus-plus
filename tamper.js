// ==UserScript==
// @name         Codeforces++
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds a button to copy the entire Codeforces problem statement, including test cases
// @author       Eng. Abdullah
// @match        https://codeforces.com/contest/*/problem/*
// @match        https://codeforces.com/problemset/problem/*/*
// @match        https://codeforces.com/gym/*/problem/*
// @match        https://codeforces.com/group/*/contest/*/problem/*
// @match        https://codeforces.com/edu/*/problem/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    "use strict";

    // Get site styles to use for our elements
    function getSiteStyles() {
        // Get computed styles of existing elements to match site design
        const linkStyle = window.getComputedStyle(
            document.querySelector("a") || document.createElement("a")
        );
        const buttonStyle = window.getComputedStyle(
            document.querySelector(".submit") || document.createElement("div")
        );

        return {
            // Primary color palette - coordinated blues
            linkColor: "#3b82f6", // Bright blue for links
            linkHoverColor: "#2563eb", // Slightly darker blue for hover
            buttonBg: "#f0f7ff", // Very light blue for button backgrounds
            buttonHoverBg: "#dbeafe", // Slightly darker light blue for hover
            borderColor: "#d1d5db", // Light gray for borders
            borderHoverColor: "#9ca3af", // Medium gray for hover borders
            successColor: "#10b981", // Emerald green for success
            errorColor: "#ef4444", // Modern red for errors
            fontFamily: linkStyle.fontFamily || "verdana, arial, sans-serif",
        };
    }

    const styles = getSiteStyles();

    // Create button style function
    function applyButtonStyle(button, isAction) {
        button.style.display = "inline-block";
        button.style.margin = "0 10px";
        button.style.padding = "8px 15px";
        button.style.backgroundColor = isAction
            ? styles.buttonBg
            : "transparent";
        button.style.color = styles.linkColor;
        button.style.border = `1px solid ${styles.borderColor}`;
        button.style.borderRadius = "4px";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.zIndex = "9999";
        button.style.fontWeight = "bold";
        button.style.fontFamily = styles.fontFamily;
        button.style.textDecoration = "none";

        // Add hover effects
        button.addEventListener("mouseover", function () {
            if (!button.disabled) {
                this.style.backgroundColor = styles.buttonHoverBg;
                this.style.borderColor = styles.borderHoverColor;
                this.style.color = styles.linkHoverColor;
            }
        });

        button.addEventListener("mouseout", function () {
            if (!button.disabled) {
                this.style.backgroundColor = isAction
                    ? styles.buttonBg
                    : "transparent";
                this.style.borderColor = styles.borderColor;
                this.style.color = styles.linkColor;
            }
        });
    }

    // Create the copy button
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy Problem";

    // Create the YouTube search button
    const youtubeButton = document.createElement("button");
    youtubeButton.textContent = "Search YouTube Tutorials";

    // Create the Explain Problem button
    const explainButton = document.createElement("button");
    explainButton.textContent = "Ask Perplexity to Explain Problem";

    // Create the ChatGPT Explain Problem button
    const chatgptButton = document.createElement("button");
    chatgptButton.textContent = "Ask ChatGPT to Explain Problem";

    // Create navigation buttons
    const navContainer = document.createElement("div");
    navContainer.id = "cf-nav-container";
    navContainer.style.position = "relative";
    navContainer.style.marginTop = "15px";
    navContainer.style.display = "inline-block";
    navContainer.style.marginBottom = "15px";
    navContainer.style.padding = "0";
    navContainer.style.textAlign = "center";
    navContainer.style.zIndex = "1000";
    navContainer.style.fontFamily = styles.fontFamily;

    const prevButton = document.createElement("a");
    prevButton.textContent = "← Previous Problem";
    prevButton.href = "#";
    applyButtonStyle(prevButton, false);
    prevButton.id = "cf-prev-problem";

    const nextButton = document.createElement("a");
    nextButton.textContent = "Next Problem →";
    nextButton.href = "#";
    applyButtonStyle(nextButton, false);
    nextButton.id = "cf-next-problem";

    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);

    // Helper function to get problem ID and contest ID
    function getProblemContext() {
        const url = window.location.href;
        let problemLetter = "";

        // Extract the problem letter from the URL
        if (url.includes("/problem/")) {
            // For URLs like /contest/123/problem/A or /group/123/contest/456/problem/B
            const matches = url.match(/\/problem\/([A-Za-z0-9]+)$/);
            if (matches && matches.length > 1) {
                problemLetter = matches[1];
            } else {
                const parts = url.split("/");
                problemLetter = parts[parts.length - 1];
            }
        }

        if (problemLetter) {
            // Handle single letter case (most common)
            if (problemLetter.length === 1 && problemLetter.match(/[A-Za-z]/)) {
                const prevLetter = String.fromCharCode(
                    problemLetter.charCodeAt(0) - 1
                );
                const nextLetter = String.fromCharCode(
                    problemLetter.charCodeAt(0) + 1
                );

                // Create URLs for previous and next problems
                const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
                const prevUrl = baseUrl + prevLetter;
                const nextUrl = baseUrl + nextLetter;

                // Disable previous button if current problem is 'A' or 'a'
                if (problemLetter === "A" || problemLetter === "a") {
                    prevButton.disabled = true;
                    prevButton.style.opacity = "0.5";
                    prevButton.style.cursor = "default";
                    prevButton.style.pointerEvents = "none";
                    prevButton.title = "This is the first problem";
                } else {
                    prevButton.disabled = false;
                    prevButton.style.opacity = "1";
                    prevButton.style.cursor = "pointer";
                    prevButton.style.pointerEvents = "auto";
                    prevButton.title = "Go to previous problem";
                    prevButton.href = prevUrl;
                    prevButton.onclick = function (e) {
                        e.preventDefault();
                        window.location.href = prevUrl;
                    };
                }

                // Disable next button if current problem is 'Z' or 'z'
                if (problemLetter === "Z" || problemLetter === "z") {
                    nextButton.disabled = true;
                    nextButton.style.opacity = "0.5";
                    nextButton.style.cursor = "default";
                    nextButton.style.pointerEvents = "none";
                    nextButton.title = "This is the last problem";
                } else {
                    nextButton.disabled = false;
                    nextButton.style.opacity = "1";
                    nextButton.style.cursor = "pointer";
                    nextButton.style.pointerEvents = "auto";
                    nextButton.title = "Go to next problem";
                    nextButton.href = nextUrl;
                    nextButton.onclick = function (e) {
                        e.preventDefault();
                        window.location.href = nextUrl;
                    };
                }
            }
            // Handle alphanumeric case (like A1, B2, etc.)
            else {
                const match = problemLetter.match(/^([A-Za-z])(\d*)$/);
                if (match) {
                    const letter = match[1];
                    const number = match[2] || "";

                    const prevLetter = String.fromCharCode(
                        letter.charCodeAt(0) - 1
                    );
                    const nextLetter = String.fromCharCode(
                        letter.charCodeAt(0) + 1
                    );

                    const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
                    const prevUrl = baseUrl + prevLetter + number;
                    const nextUrl = baseUrl + nextLetter + number;

                    if (letter === "A" || letter === "a") {
                        prevButton.disabled = true;
                        prevButton.style.opacity = "0.5";
                        prevButton.style.cursor = "default";
                        prevButton.style.pointerEvents = "none";
                        prevButton.title = "This is the first problem";
                    } else {
                        prevButton.disabled = false;
                        prevButton.style.opacity = "1";
                        prevButton.style.cursor = "pointer";
                        prevButton.style.pointerEvents = "auto";
                        prevButton.title = "Go to previous problem";
                        prevButton.href = prevUrl;
                        prevButton.onclick = function (e) {
                            e.preventDefault();
                            window.location.href = prevUrl;
                        };
                    }

                    if (letter === "Z" || letter === "z") {
                        nextButton.disabled = true;
                        nextButton.style.opacity = "0.5";
                        nextButton.style.cursor = "default";
                        nextButton.style.pointerEvents = "none";
                        nextButton.title = "This is the last problem";
                    } else {
                        nextButton.disabled = false;
                        nextButton.style.opacity = "1";
                        nextButton.style.cursor = "pointer";
                        nextButton.style.pointerEvents = "auto";
                        nextButton.title = "Go to next problem";
                        nextButton.href = nextUrl;
                        nextButton.onclick = function (e) {
                            e.preventDefault();
                            window.location.href = nextUrl;
                        };
                    }
                }
                // Handle numeric problems (like problem/1, problem/2)
                else if (problemLetter.match(/^\d+$/)) {
                    const currentNum = parseInt(problemLetter);
                    const prevNum = currentNum - 1;
                    const nextNum = currentNum + 1;

                    const baseUrl = url.substring(0, url.lastIndexOf("/") + 1);
                    const prevUrl = baseUrl + prevNum;
                    const nextUrl = baseUrl + nextNum;

                    if (currentNum <= 1) {
                        prevButton.disabled = true;
                        prevButton.style.opacity = "0.5";
                        prevButton.style.cursor = "default";
                        prevButton.style.pointerEvents = "none";
                        prevButton.title = "This is the first problem";
                    } else {
                        prevButton.disabled = false;
                        prevButton.style.opacity = "1";
                        prevButton.style.cursor = "pointer";
                        prevButton.style.pointerEvents = "auto";
                        prevButton.title = "Go to previous problem";
                        prevButton.href = prevUrl;
                        prevButton.onclick = function (e) {
                            e.preventDefault();
                            window.location.href = prevUrl;
                        };
                    }

                    nextButton.disabled = false;
                    nextButton.style.opacity = "1";
                    nextButton.style.cursor = "pointer";
                    nextButton.style.pointerEvents = "auto";
                    nextButton.title = "Go to next problem";
                    nextButton.href = nextUrl;
                    nextButton.onclick = function (e) {
                        e.preventDefault();
                        window.location.href = nextUrl;
                    };
                }
            }
        } else {
            // Hide buttons if we can't determine problem letter
            prevButton.style.opacity = "0.5";
            nextButton.style.opacity = "0.5";
            prevButton.style.cursor = "default";
            nextButton.style.cursor = "default";
            prevButton.style.pointerEvents = "none";
            nextButton.style.pointerEvents = "none";
            prevButton.href = "javascript:void(0);";
            nextButton.href = "javascript:void(0);";
            prevButton.title = nextButton.title =
                "Cannot determine problem letter";
        }

        // Add buttons to the container
        navContainer.innerHTML = "";
        navContainer.appendChild(prevButton);
        navContainer.appendChild(document.createTextNode(" | "));
        navContainer.appendChild(nextButton);
    }

    // Function to extract problem content
    function extractProblemContent() {
        const problemStatement = document.querySelector(".problem-statement");
        if (!problemStatement) {
            alert("Could not find the problem statement container.");
            return "";
        }
        // Clone to avoid modifying the live DOM
        const cloned = problemStatement.cloneNode(true);
        // Remove unwanted elements
        const elementsToRemove = cloned.querySelectorAll(
            ".html2md-panel, .ojb_btn, .ojb_btn_popover, button, .btn, .ad, .advertisement, iframe, .sidebar, nav, header, footer, script, style"
        );
        elementsToRemove.forEach((el) => el.remove());

        let content = "";
        // Title
        const title = cloned.querySelector(".title");
        if (title) {
            content += title.textContent.trim() + "\n\n";
        }
        // Time/memory limits
        const timeMemory = cloned.querySelector(".time-limit, .memory-limit");
        if (timeMemory) {
            content += timeMemory.textContent.trim() + "\n";
        }
        // Main sections
        const sections = cloned.querySelectorAll(".problem-statement > div");
        sections.forEach((div) => {
            if (div.classList.contains("header")) return;
            // Input/Output
            const inputSection = div.querySelector(".input-specification");
            const outputSection = div.querySelector(".output-specification");
            if (inputSection) {
                content +=
                    "Input:\n" + inputSection.textContent.trim() + "\n\n";
            } else if (outputSection) {
                content +=
                    "Output:\n" + outputSection.textContent.trim() + "\n\n";
            } else {
                // Description or other
                const text = div.textContent.trim();
                if (text) content += text + "\n\n";
            }
        });
        // Examples
        const examples = cloned.querySelectorAll(
            ".sample-test .sample-test-io"
        );
        if (examples.length > 0) {
            content += "Examples:\n\n";
            examples.forEach((example, idx) => {
                const input = example.querySelector(".input pre");
                const output = example.querySelector(".output pre");
                if (input) {
                    content += `Example ${
                        idx + 1
                    } Input:\n${input.textContent.trim()}\n\n`;
                }
                if (output) {
                    content += `Example ${
                        idx + 1
                    } Output:\n${output.textContent.trim()}\n\n`;
                }
            });
        }
        // Clean up excessive newlines
        content = content.replace(/\n{3,}/g, "\n\n");

        return content;
    }

    copyButton.addEventListener("click", function () {
        const content = extractProblemContent();
        if (!content) return;

        // Copy to clipboard
        navigator.clipboard
            .writeText(content)
            .then(function () {
                copyButton.textContent = "Copied!";
                copyButton.style.backgroundColor = styles.successColor;
                copyButton.style.color = "white";
                copyButton.style.borderColor = styles.successColor;
                setTimeout(function () {
                    copyButton.textContent = "Copy Problem Statement";
                    copyButton.style.backgroundColor = "transparent";
                    copyButton.style.color = styles.linkColor;
                    copyButton.style.borderColor = styles.borderColor;
                }, 2000);
            })
            .catch(function (err) {
                // Fallback for browsers that don't support clipboard API
                fallbackCopyTextToClipboard(content);
                copyButton.textContent = "Failed to copy!";
                copyButton.style.backgroundColor = styles.errorColor;
                copyButton.style.color = "white";
                copyButton.style.borderColor = styles.errorColor;
                setTimeout(function () {
                    copyButton.textContent = "Copy Problem Statement";
                    copyButton.style.backgroundColor = "transparent";
                    copyButton.style.color = styles.linkColor;
                    copyButton.style.borderColor = styles.borderColor;
                }, 2000);
            });
    });

    explainButton.addEventListener("click", function () {
        const content = extractProblemContent();
        if (!content) return;

        // Create the prompt for explanation
        const prompt =
            `
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

Problem:
` + content;

        // Encode the prompt for URL
        const encodedPrompt = encodeURIComponent(prompt).replace(/%20/g, "%20");

        // Create Perplexity URL
        const perplexityUrl = `https://www.perplexity.ai/search?q=${encodedPrompt}`;

        // Open the URL in a new tab
        window.open(perplexityUrl, "_blank");

        // Update button to show success
        explainButton.textContent = "Opened in Perplexity!";
        setTimeout(function () {
            explainButton.textContent = "Ask Perplexity to Explain Problem";
        }, 2000);
    });

    chatgptButton.addEventListener("click", function () {
        const content = extractProblemContent();
        if (!content) return;

        // Create the prompt for explanation
        const prompt =
            `
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

Problem:
` + content;

        // Encode the prompt for URL
        const encodedPrompt = encodeURIComponent(prompt).replace(/%20/g, "%20");

        // Create ChatGPT URL
        const chatgptUrl = `https://chatgpt.com/?q=${encodedPrompt}`;

        // Open the URL in a new tab
        window.open(chatgptUrl, "_blank");

        // Update button to show success
        chatgptButton.textContent = "Opened in ChatGPT!";
        setTimeout(function () {
            chatgptButton.textContent = "Ask ChatGPT to Explain Problem";
        }, 2000);
    });

    youtubeButton.addEventListener("click", function () {
        // Find the problem title
        const titleElement = document.querySelector(".title");
        if (!titleElement) {
            alert("Could not find the problem title.");
            return;
        }

        const problemTitle = titleElement.textContent.trim();

        // Create search terms - add "codeforces" to get better results
        const searchQuery = encodeURIComponent(
            problemTitle + " codeforces tutorial"
        );

        // Create YouTube search URL
        const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

        // Open in a new tab
        window.open(youtubeUrl, "_blank");

        // Update button to show success
        youtubeButton.textContent = "Opened YouTube Search!";
        setTimeout(function () {
            youtubeButton.textContent = "Search YouTube Tutorials";
        }, 2000);
    });

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand("copy");
        } catch (err) {}
        document.body.removeChild(textArea);
    }

    // Add all elements to the page
    function addButtonsToPage() {
        const problemStatement = document.querySelector(".problem-statement");

        // Try different locations to place navigation buttons
        const titleDiv = document.querySelector(".title");
        const headerDiv = document.querySelector(".problem-statement .header");
        const contentDiv = document.querySelector(".content-with-sidebar");

        // Find the best place to insert navigation
        if (titleDiv && !document.body.contains(navContainer)) {
            // Insert after the title for a cleaner look
            titleDiv.parentNode.insertBefore(
                navContainer,
                titleDiv.nextSibling
            );
            getProblemContext();
        } else if (headerDiv && !document.body.contains(navContainer)) {
            // Or after the header
            headerDiv.parentNode.insertBefore(
                navContainer,
                headerDiv.nextSibling
            );
            getProblemContext();
        } else if (contentDiv && !document.body.contains(navContainer)) {
            // Fallback: insert before main content
            contentDiv.insertBefore(navContainer, contentDiv.firstChild);
            getProblemContext();
        }

        // Add copy button and other buttons to sidebar instead of below problem statement
        if (!document.body.contains(copyButton)) {
            const sidebarContainer = document.createElement("div");
            sidebarContainer.id = "cf-action-buttons";
            sidebarContainer.className = "roundbox sidebox borderTopRound";

            const caption = document.createElement("div");
            caption.className = "caption titled";
            caption.innerHTML = "→ Codeforces++";

            // Add dropdown icon
            const dropdownIcon = document.createElement("i");
            dropdownIcon.className = "sidebar-caption-icon las la-angle-down";
            caption.appendChild(dropdownIcon);

            sidebarContainer.appendChild(caption);

            const buttonsList = document.createElement("ul");
            buttonsList.style.display = "block"; // Start expanded

            // Add toggle functionality
            dropdownIcon.addEventListener("click", function () {
                this.classList.toggle("la-angle-down");
                this.classList.toggle("la-angle-right");
                if (buttonsList.style.display === "none") {
                    buttonsList.style.display = "block";
                } else {
                    buttonsList.style.display = "none";
                }
            });

            const copyButtonItem = document.createElement("li");
            copyButton.style.display = "inline-block";
            copyButton.style.margin = "0 10px";
            copyButton.style.padding = "8px 15px";
            copyButton.style.backgroundColor = "transparent";
            copyButton.style.color = styles.linkColor;
            copyButton.style.border = `1px solid ${styles.borderColor}`;
            copyButton.style.borderRadius = "4px";
            copyButton.style.cursor = "pointer";
            copyButton.style.fontSize = "14px";
            copyButton.style.zIndex = "9999";
            copyButton.style.fontWeight = "bold";
            copyButton.style.fontFamily = styles.fontFamily;
            copyButton.style.textDecoration = "none";
            copyButton.style.width = "85%";
            copyButtonItem.appendChild(copyButton);

            const youtubeButtonItem = document.createElement("li");
            youtubeButton.style.display = "inline-block";
            youtubeButton.style.margin = "0 10px";
            youtubeButton.style.padding = "8px 15px";
            youtubeButton.style.backgroundColor = "transparent";
            youtubeButton.style.color = styles.linkColor;
            youtubeButton.style.border = `1px solid ${styles.borderColor}`;
            youtubeButton.style.borderRadius = "4px";
            youtubeButton.style.cursor = "pointer";
            youtubeButton.style.fontSize = "14px";
            youtubeButton.style.zIndex = "9999";
            youtubeButton.style.fontWeight = "bold";
            youtubeButton.style.fontFamily = styles.fontFamily;
            youtubeButton.style.textDecoration = "none";
            youtubeButton.style.width = "85%";
            youtubeButtonItem.appendChild(youtubeButton);

            const explainButtonItem = document.createElement("li");
            explainButton.style.display = "inline-block";
            explainButton.style.margin = "0 10px";
            explainButton.style.padding = "8px 15px";
            explainButton.style.backgroundColor = "transparent";
            explainButton.style.color = styles.linkColor;
            explainButton.style.border = `1px solid ${styles.borderColor}`;
            explainButton.style.borderRadius = "4px";
            explainButton.style.cursor = "pointer";
            explainButton.style.fontSize = "14px";
            explainButton.style.zIndex = "9999";
            explainButton.style.fontWeight = "bold";
            explainButton.style.fontFamily = styles.fontFamily;
            explainButton.style.textDecoration = "none";
            explainButton.style.width = "85%";
            explainButtonItem.appendChild(explainButton);

            // Add ChatGPT button
            const chatgptButtonItem = document.createElement("li");
            chatgptButton.style.display = "inline-block";
            chatgptButton.style.margin = "0 10px";
            chatgptButton.style.padding = "8px 15px";
            chatgptButton.style.backgroundColor = "transparent";
            chatgptButton.style.color = styles.linkColor;
            chatgptButton.style.border = `1px solid ${styles.borderColor}`;
            chatgptButton.style.borderRadius = "4px";
            chatgptButton.style.cursor = "pointer";
            chatgptButton.style.fontSize = "14px";
            chatgptButton.style.zIndex = "9999";
            chatgptButton.style.fontWeight = "bold";
            chatgptButton.style.fontFamily = styles.fontFamily;
            chatgptButton.style.textDecoration = "none";
            chatgptButton.style.width = "85%";
            chatgptButtonItem.appendChild(chatgptButton);

            // Add the buttons to the list
            buttonsList.appendChild(copyButtonItem);
            buttonsList.appendChild(youtubeButtonItem);
            buttonsList.appendChild(explainButtonItem);
            buttonsList.appendChild(chatgptButtonItem);

            sidebarContainer.appendChild(buttonsList);

            // Add to sidebar after #1 element
            const sidebarElements = document.querySelectorAll(".sidebar-menu");
            if (sidebarElements.length > 0) {
                const firstSidebar = sidebarElements[0];
                firstSidebar.parentNode.insertBefore(
                    sidebarContainer,
                    firstSidebar.nextSibling
                );
            } else {
                // Fallback - add to right column
                const rightColumn = document.querySelector(".right-column");
                if (rightColumn) {
                    rightColumn.insertBefore(
                        sidebarContainer,
                        rightColumn.firstChild
                    );
                }
            }
        }
    }

    // Add buttons, ensuring dark mode button call is removed
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            addButtonsToPage();
        });
    } else {
        addButtonsToPage();
    }

    // Set up repeated checks, ensuring dark mode button call is removed
    setTimeout(function () {
        addButtonsToPage();
    }, 1000);

    setTimeout(function () {
        addButtonsToPage();
    }, 3000);

    const observer = new MutationObserver(function () {
        if (
            !document.body.contains(copyButton) ||
            !document.body.contains(navContainer) ||
            !document.body.contains(youtubeButton) ||
            !document.body.contains(explainButton) ||
            !document.body.contains(chatgptButton) ||
            !document.querySelector("#cf-action-buttons")
        ) {
            addButtonsToPage();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
