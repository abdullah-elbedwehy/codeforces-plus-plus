// ==UserScript==
// @name         Codeforces++
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to copy the entire Codeforces problem statement, test cases, quick links, helpers, and an embedded VS Code editor with direct submission - All features are configurable!
// @author       Eng. Abdullah
// @match        https://codeforces.com/contest/*/problem/*
// @match        https://codeforces.com/problemset/problem/*/*
// @match        https://codeforces.com/gym/*/problem/*
// @match        https://codeforces.com/group/*/contest/*/problem/*
// @match        https://codeforces.com/edu/*/problem/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    "use strict";

    // Prevent multiple executions
    if (window.codeforcesPlusPlusLoaded) {
        console.log("Codeforces++ already loaded, skipping...");
        return;
    }
    window.codeforcesPlusPlusLoaded = true;

    /* ---------- Configuration System ---------- */
    const CONFIG_DEFAULTS = {
        copyProblem: true,
        youtubeTutorials: true,
        excalidraw: true,
        cppsh: true,
        perplexityExplain: true,
        chatgptExplain: true,
        codeEditor: true,
        navigationButtons: true,
        sidebar: true,
        editorTheme: "facebook-dark",
        darkMode: false,
        problemsRecorder: true,
    };

    /* ---------- Theme System ---------- */
    const THEMES = {
        "vs-dark": {
            name: "🌙 VS Dark",
            monaco: "vs-dark",
            background: "#1A1A1A",
            headerBg: "linear-gradient(135deg, #4A9EFF, #3D8BFF)",
        },
        "facebook-dark": {
            name: "📘 Facebook Dark",
            monaco: "vs-dark",
            background: "#1A1A1A",
            headerBg: "linear-gradient(135deg, #4A9EFF, #3D8BFF)",
        },
    };

    /* ---------- Dark Mode System ---------- */
    function createDarkModeCSS() {
        return `
            /* Dark Mode Transitions */
            * {
                transition: background-color 250ms ease, border-color 250ms ease, color 250ms ease, box-shadow 250ms ease !important;
            }

            /* Dark Mode Styles */
            .cf-dark-mode .page,
            .cf-dark-mode body,
            .cf-dark-mode #body {
                background: #1A1A1A !important;
                color: #D0D0D0 !important;
            }

            /* Cards */
            .cf-dark-mode .roundbox,
            .cf-dark-mode .sidebar,
            .cf-dark-mode .sidebox,
            .cf-dark-mode .bordertable,
            .cf-dark-mode .datatable,
            .cf-dark-mode .problem-statement,
            .cf-dark-mode .sample-tests,
            .cf-dark-mode .input,
            .cf-dark-mode .output {
                background: #242424 !important;
                border: 1px solid #3A3A3A !important;
                border-radius: 12px !important;
                box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.40) !important;
            }

            .cf-dark-mode .roundbox:hover,
            .cf-dark-mode .sidebar:hover,
            .cf-dark-mode .sidebox:hover {
                background: #2A2A2A !important;
                border: 1px solid #4A4A4A !important;
                box-shadow: 0 6px 16px rgba(0,0,0,0.50) !important;
            }

            /* Typography */
            .cf-dark-mode h1,
            .cf-dark-mode h2,
            .cf-dark-mode h3,
            .cf-dark-mode .title {
                color: #E8E8E8 !important;
            }

            .cf-dark-mode p,
            .cf-dark-mode li,
            .cf-dark-mode td,
            .cf-dark-mode .problem-statement div {
                color: #D0D0D0 !important;
            }

            .cf-dark-mode .caption,
            .cf-dark-mode .time-limit,
            .cf-dark-mode .memory-limit {
                color: #A0A0A0 !important;
            }

            /* Navigation */
            .cf-dark-mode #header,
            .cf-dark-mode .second-level-menu,
            .cf-dark-mode .lang-chooser {
                background: rgba(26,26,26,0.85) !important;
                backdrop-filter: blur(12px) !important;
                color: #E8E8E8 !important;
            }

            .cf-dark-mode #header a,
            .cf-dark-mode .second-level-menu a {
                color: #E8E8E8 !important;
            }

            .cf-dark-mode #header a:hover,
            .cf-dark-mode .second-level-menu a:hover {
                color: #C0C0C0 !important;
            }

            .cf-dark-mode #header .menu-list-container a.active,
            .cf-dark-mode .second-level-menu a.active {
                color: #4A9EFF !important;
            }

            /* Buttons */
            .cf-dark-mode .btn,
            .cf-dark-mode button,
            .cf-dark-mode input[type="submit"],
            .cf-dark-mode input[type="button"] {
                background: transparent !important;
                color: #E8E8E8 !important;
                border: 1px solid #4A4A4A !important;
                border-radius: 8px !important;
            }

            .cf-dark-mode .btn:hover,
            .cf-dark-mode button:hover,
            .cf-dark-mode input[type="submit"]:hover,
            .cf-dark-mode input[type="button"]:hover {
                background: #2A2A2A !important;
            }

            .cf-dark-mode .btn:active,
            .cf-dark-mode button:active {
                background: #303030 !important;
            }

            /* Primary Buttons */
            .cf-dark-mode .btn.btn-primary,
            .cf-dark-mode button.btn-primary {
                background: linear-gradient(90deg, #4A9EFF 0%, #3D8BFF 100%) !important;
                color: #FFFFFF !important;
                border: none !important;
                box-shadow: 0 2px 6px rgba(74,158,255,0.30) !important;
            }

            .cf-dark-mode .btn.btn-primary:hover,
            .cf-dark-mode button.btn-primary:hover {
                background: linear-gradient(90deg, #5AA8FF 0%, #4D9BFF 100%) !important;
            }

            .cf-dark-mode .btn.btn-primary:active,
            .cf-dark-mode button.btn-primary:active {
                background: #3A7AE0 !important;
            }

            /* Forms */
            .cf-dark-mode input,
            .cf-dark-mode textarea,
            .cf-dark-mode select {
                background: #2A2A2A !important;
                color: #E8E8E8 !important;
                border: 1px solid #4A4A4A !important;
                border-radius: 4px !important;
            }

            .cf-dark-mode input:focus,
            .cf-dark-mode textarea:focus,
            .cf-dark-mode select:focus {
                outline: 2px solid #4A9EFF !important;
                border-color: #4A9EFF !important;
            }

            /* Tables */
            .cf-dark-mode .bordertable td,
            .cf-dark-mode .datatable td,
            .cf-dark-mode .bordertable th,
            .cf-dark-mode .datatable th {
                border-color: #3A3A3A !important;
                background: transparent !important;
            }

            .cf-dark-mode .bordertable tr:nth-child(even),
            .cf-dark-mode .datatable tr:nth-child(even) {
                background: rgba(255,255,255,0.04) !important;
            }

            /* Icons */
            .cf-dark-mode .icon,
            .cf-dark-mode img[src*="icon"] {
                filter: brightness(0) invert(1) !important;
            }

            /* Links */
            .cf-dark-mode a {
                color: #4A9EFF !important;
            }

            .cf-dark-mode a:hover {
                color: #5AA8FF !important;
            }

            /* Code blocks */
            .cf-dark-mode pre,
            .cf-dark-mode code {
                background: #1E1E1E !important;
                color: #E8E8E8 !important;
                border: 1px solid #3A3A3A !important;
            }

            /* Special elements */
            .cf-dark-mode .section--gradientHero {
                background: linear-gradient(135deg, #FF5E7E 0%, #FFAE54 45%, #9DE57D 80%) !important;
            }

            /* Ensure proper contrast for important elements */
            .cf-dark-mode .verdict-accepted {
                color: #4ADE80 !important;
            }

            .cf-dark-mode .verdict-wrong-answer,
            .cf-dark-mode .verdict-compilation-error {
                color: #F87171 !important;
            }

            .cf-dark-mode .verdict-time-limit-exceeded {
                color: #FBBF24 !important;
            }
        `;
    }

    function applyDarkMode(enabled) {
        const existingStyle = document.getElementById("cf-dark-mode-styles");

        if (enabled) {
            if (!existingStyle) {
                const style = document.createElement("style");
                style.id = "cf-dark-mode-styles";
                style.textContent = createDarkModeCSS();
                document.head.appendChild(style);
            }
            document.documentElement.classList.add("cf-dark-mode");
        } else {
            if (existingStyle) {
                existingStyle.remove();
            }
            document.documentElement.classList.remove("cf-dark-mode");
        }
    }

    function createDarkModeToggle() {
        // Find the navbar or header
        const header = document.getElementById("header");
        if (!header) return;

        // Find the menu container
        const menuContainer =
            header.querySelector(".menu-list-container") ||
            header.querySelector(".second-level-menu") ||
            header;

        // Create toggle button
        const toggleButton = document.createElement("a");
        toggleButton.id = "cf-dark-mode-toggle";
        toggleButton.href = "#";
        toggleButton.style.cssText = `
            display: inline-block;
            margin: 0 10px;
            padding: 8px 15px;
            background: transparent;
            color: ${userConfig.darkMode ? "#FFD700" : "#666"};
            border: 1px solid ${userConfig.darkMode ? "#FFD700" : "#ccc"};
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            font-family: ${styles.fontFamily};
            text-decoration: none;
            transition: all 250ms ease;
            position: relative;
            z-index: 1000;
        `;

        toggleButton.textContent = userConfig.darkMode ? "🌙 Dark" : "☀️ Light";
        toggleButton.title = `Switch to ${
            userConfig.darkMode ? "light" : "dark"
        } mode`;

        // Add hover effects
        toggleButton.addEventListener("mouseover", function () {
            this.style.backgroundColor = userConfig.darkMode
                ? "rgba(255, 215, 0, 0.1)"
                : "rgba(0, 0, 0, 0.05)";
            this.style.borderColor = userConfig.darkMode ? "#FFD700" : "#999";
        });

        toggleButton.addEventListener("mouseout", function () {
            this.style.backgroundColor = "transparent";
            this.style.borderColor = userConfig.darkMode ? "#FFD700" : "#ccc";
        });

        // Add click handler
        toggleButton.addEventListener("click", function (e) {
            e.preventDefault();
            const newDarkMode = !userConfig.darkMode;
            saveConfig("darkMode", newDarkMode);

            // Update button appearance
            this.textContent = newDarkMode ? "🌙 Dark" : "☀️ Light";
            this.title = `Switch to ${newDarkMode ? "light" : "dark"} mode`;
            this.style.color = newDarkMode ? "#FFD700" : "#666";
            this.style.borderColor = newDarkMode ? "#FFD700" : "#ccc";

            // Apply dark mode
            applyDarkMode(newDarkMode);

            // Show notification
            showSmallNotification(
                `${newDarkMode ? "🌙 Dark" : "☀️ Light"} mode enabled!`,
                "success"
            );
        });

        // Try to insert in a good location
        if (menuContainer.querySelector("ul")) {
            // If there's a ul, append as last item
            const lastLi = document.createElement("li");
            lastLi.appendChild(toggleButton);
            menuContainer.querySelector("ul").appendChild(lastLi);
        } else {
            // Otherwise append directly to container
            menuContainer.appendChild(toggleButton);
        }

        return toggleButton;
    }

    let userConfig = {};

    // Load configuration from Tampermonkey storage
    function loadConfig() {
        Object.keys(CONFIG_DEFAULTS).forEach((key) => {
            const value = GM_getValue(key, CONFIG_DEFAULTS[key]);
            userConfig[key] = value;
        });
    }

    // Save configuration to Tampermonkey storage
    function saveConfig(key, value) {
        userConfig[key] = value;
        GM_setValue(key, value);
    }

    // Check if feature is enabled
    function isEnabled(feature) {
        return userConfig[feature] !== false;
    }

    // Initialize configuration
    loadConfig();

    /* ---------- Problems Recorder Storage ---------- */
    // Storage key for saved problems
    const STORAGE_KEY = "cfpp_saved_problems";

    // Structure for saved problems
    function createSavedProblem(
        contestId,
        problemIndex,
        title,
        url,
        timeLimit,
        memoryLimit
    ) {
        return {
            id: `${contestId}${problemIndex}`,
            contestId,
            problemIndex,
            title,
            url,
            timeLimit: timeLimit || "",
            memoryLimit: memoryLimit || "",
            savedAt: new Date().toISOString(),
        };
    }

    // Storage helpers
    function getSavedProblems() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Error loading saved problems:", error);
            return [];
        }
    }

    function saveProblem(problem) {
        try {
            const saved = getSavedProblems();
            const exists = saved.find((p) => p.id === problem.id);

            if (!exists) {
                saved.push(problem);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error saving problem:", error);
            return false;
        }
    }

    function removeSavedProblem(problemId) {
        try {
            const saved = getSavedProblems();
            const filtered = saved.filter((p) => p.id !== problemId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error("Error removing problem:", error);
            return false;
        }
    }

    function isProblemSaved(problemId) {
        const saved = getSavedProblems();
        return saved.some((p) => p.id === problemId);
    }

    /* ---------- Problems Recorder Flag Button ---------- */
    function createFlagButton(problemId) {
        const button = document.createElement("button");
        button.className = "cf-flag-button";
        button.title = "Save to Problems Recorder";
        button.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            margin: 0 5px;
            padding: 0;
            background: transparent;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            color: #6b7280;
            transition: all 0.2s ease;
            font-family: ${styles.fontFamily};
            position: relative;
            z-index: 10;
        `;

        const updateButtonState = () => {
            const isSaved = isProblemSaved(problemId);
            button.textContent = isSaved ? "🚩" : "⚐";
            button.style.color = isSaved ? "#f59e0b" : "#6b7280";
            button.style.borderColor = isSaved ? "#f59e0b" : "#d1d5db";
            button.style.backgroundColor = isSaved
                ? "rgba(245, 158, 11, 0.1)"
                : "transparent";
            button.title = isSaved
                ? "Remove from Problems Recorder"
                : "Save to Problems Recorder";
        };

        // Initial state
        updateButtonState();

        // Hover effects
        button.addEventListener("mouseenter", () => {
            if (isProblemSaved(problemId)) {
                button.style.backgroundColor = "rgba(245, 158, 11, 0.2)";
                button.style.borderColor = "#f59e0b";
            } else {
                button.style.backgroundColor = "rgba(107, 114, 128, 0.1)";
                button.style.borderColor = "#9ca3af";
            }
        });

        button.addEventListener("mouseleave", () => {
            updateButtonState();
        });

        // Click handler
        button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const { contestId, problemIndex } = getProblemInfo();
            if (!contestId || !problemIndex) {
                showSmallNotification("❌ Could not identify problem", "error");
                return;
            }

            const problemId = `${contestId}${problemIndex}`;
            const isSaved = isProblemSaved(problemId);

            if (isSaved) {
                // Remove from saved problems
                if (removeSavedProblem(problemId)) {
                    showSmallNotification(
                        "📌 Problem removed from recorder",
                        "success"
                    );
                    updateButtonState();
                } else {
                    showSmallNotification(
                        "❌ Failed to remove problem",
                        "error"
                    );
                }
            } else {
                // Save problem
                const title =
                    document
                        .querySelector(".problem-statement .title")
                        ?.textContent?.trim() ||
                    document.querySelector(".title")?.textContent?.trim() ||
                    `Problem ${problemIndex}`;

                const timeLimit =
                    document
                        .querySelector(".time-limit")
                        ?.textContent?.trim() || "";
                const memoryLimit =
                    document
                        .querySelector(".memory-limit")
                        ?.textContent?.trim() || "";

                const problem = createSavedProblem(
                    contestId,
                    problemIndex,
                    title,
                    window.location.href,
                    timeLimit,
                    memoryLimit
                );

                if (saveProblem(problem)) {
                    showSmallNotification(
                        "📌 Problem saved to recorder!",
                        "success"
                    );
                    updateButtonState();
                } else {
                    showSmallNotification(
                        "⚠️ Problem already saved",
                        "warning"
                    );
                }
            }
        });

        return button;
    }

    function addFlagButtonToProblemPage() {
        if (!isEnabled("problemsRecorder")) return;

        const { contestId, problemIndex } = getProblemInfo();
        if (!contestId || !problemIndex) return;

        const problemId = `${contestId}${problemIndex}`;

        // Try to find the problem title area
        const titleElement =
            document.querySelector(".problem-statement .header .title") ||
            document.querySelector(".title");

        if (titleElement && !titleElement.querySelector(".cf-flag-button")) {
            const flagButton = createFlagButton(problemId);

            // Create a wrapper to position the button
            const buttonWrapper = document.createElement("span");
            buttonWrapper.style.cssText = `
                display: inline-flex;
                align-items: center;
                margin-left: 10px;
                vertical-align: middle;
            `;
            buttonWrapper.appendChild(flagButton);

            // Insert after the title
            titleElement.appendChild(buttonWrapper);
        }
    }

    /* ---------- Load Monaco Editor ---------- */
    let monacoLoading = false;
    let monacoLoaded = false;

    function loadMonacoEditor() {
        if (monacoLoaded) {
            console.log("Monaco already loaded");
            return Promise.resolve();
        }

        if (monacoLoading) {
            console.log("Monaco loading in progress");
            return new Promise((resolve) => {
                const checkLoaded = () => {
                    if (monacoLoaded) resolve();
                    else setTimeout(checkLoaded, 100);
                };
                checkLoaded();
            });
        }

        monacoLoading = true;
        return new Promise((resolve, reject) => {
            console.log("Loading Monaco Editor...");

            // Check if already loaded
            if (window.monaco && window.require) {
                monacoLoaded = true;
                monacoLoading = false;
                console.log("Monaco already available");
                resolve();
                return;
            }

            const script = document.createElement("script");
            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js";
            script.onload = () => {
                console.log("Monaco loader script loaded");
                if (typeof require === "undefined") {
                    monacoLoading = false;
                    reject(new Error("Require function not available"));
                    return;
                }

                require.config({
                    paths: {
                        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs",
                    },
                });
                require(["vs/editor/editor.main"], () => {
                    console.log("Monaco editor main module loaded");
                    monacoLoaded = true;
                    monacoLoading = false;
                    resolve();
                }, (error) => {
                    console.error("Failed to load Monaco modules:", error);
                    monacoLoading = false;
                    reject(error);
                });
            };
            script.onerror = () => {
                console.error("Failed to load Monaco loader script");
                monacoLoading = false;
                reject(new Error("Failed to load Monaco loader script"));
            };
            document.head.appendChild(script);
        });
    }

    /* ---------- Shared style helpers ---------- */
    function getSiteStyles() {
        const linkStyle = window.getComputedStyle(
            document.querySelector("a") || document.createElement("a")
        );

        return {
            linkColor: "#3b82f6",
            linkHoverColor: "#2563eb",
            buttonBg: "#f0f7ff",
            buttonHoverBg: "#dbeafe",
            borderColor: "#d1d5db",
            borderHoverColor: "#9ca3af",
            successColor: "#10b981",
            errorColor: "#ef4444",
            warningColor: "#f59e0b",
            fontFamily: linkStyle.fontFamily || "verdana, arial, sans-serif",
        };
    }
    const styles = getSiteStyles();

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
        button.style.fontWeight = "bold";
        button.style.fontFamily = styles.fontFamily;
        button.style.textDecoration = "none";
        button.style.zIndex = "9999";

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

    /* ---------- HTML Modal System ---------- */
    function createModal(title, content, buttons) {
        return new Promise((resolve) => {
            const modal = document.createElement("div");
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                z-index: 10001;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: ${styles.fontFamily};
            `;

            const modalContent = document.createElement("div");
            modalContent.style.cssText = `
                background: white;
                padding: 25px;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                text-align: center;
            `;

            const titleEl = document.createElement("h3");
            titleEl.textContent = title;
            titleEl.style.cssText = `
                margin: 0 0 15px 0;
                color: #333;
            `;

            const contentEl = document.createElement("div");
            if (typeof content === "string") {
                contentEl.textContent = content;
            } else {
                contentEl.appendChild(content);
            }
            contentEl.style.cssText = `
                margin-bottom: 20px;
                color: #666;
                line-height: 1.5;
            `;

            const buttonContainer = document.createElement("div");
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
            `;

            buttons.forEach((btn) => {
                const button = document.createElement("button");
                button.textContent = btn.text;
                button.style.cssText = `
                    padding: 10px 20px;
                    background: ${btn.primary ? styles.linkColor : "#6b7280"};
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    font-family: ${styles.fontFamily};
                    min-width: 80px;
                `;
                button.addEventListener("click", () => {
                    document.body.removeChild(modal);
                    resolve(btn.value);
                });
                buttonContainer.appendChild(button);
            });

            modalContent.appendChild(titleEl);
            modalContent.appendChild(contentEl);
            modalContent.appendChild(buttonContainer);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        });
    }

    function showConfirm(title, message) {
        return createModal(title, message, [
            { text: "Cancel", value: false, primary: false },
            { text: "Confirm", value: true, primary: true },
        ]);
    }

    function showAlert(title, message) {
        return createModal(title, message, [
            { text: "OK", value: true, primary: true },
        ]);
    }

    /* ---------- Settings Modal ---------- */
    function createSettingsModal() {
        const modal = document.createElement("div");
        modal.id = "cf-settings-modal";
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
            font-family: ${styles.fontFamily};
        `;

        const modalContent = document.createElement("div");
        modalContent.style.cssText = `
            background: #121212;
            border: 1px solid #2A2A2A;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;

        const title = document.createElement("h2");
        title.textContent = "Codeforces++ Settings";
        title.style.cssText = `
            margin: 0 0 20px 0;
            color: #FFFFFF;
            text-align: center;
            border-bottom: 2px solid #00A4FF;
            padding-bottom: 10px;
        `;

        const settingsForm = document.createElement("div");

        const featureSettings = [
            {
                key: "copyProblem",
                label: "📋 Copy Problem Statement",
                desc: "Copy the entire problem text to clipboard",
            },
            {
                key: "youtubeTutorials",
                label: "🎥 YouTube Tutorials",
                desc: "Search for video tutorials on YouTube",
            },
            {
                key: "excalidraw",
                label: "✏️ Excalidraw",
                desc: "Open Excalidraw for diagrams and sketches",
            },
            {
                key: "cppsh",
                label: "💻 cpp.sh",
                desc: "Quick access to online C++ compiler",
            },
            {
                key: "perplexityExplain",
                label: "🤖 Perplexity Explain",
                desc: "Get problem explanation via Perplexity AI",
            },
            {
                key: "chatgptExplain",
                label: "💬 ChatGPT Explain",
                desc: "Get problem explanation via ChatGPT",
            },
            {
                key: "codeEditor",
                label: "📝 Code Editor",
                desc: "VS Code editor with direct submission",
            },
            {
                key: "navigationButtons",
                label: "⬅️➡️ Navigation Buttons",
                desc: "Previous/Next problem navigation",
            },
            {
                key: "sidebar",
                label: "📊 Sidebar",
                desc: "Show the Codeforces++ sidebar",
            },
            {
                key: "problemsRecorder",
                label: "📌 Problems Recorder",
                desc: "Save hard problems for review and export as CSV",
            },
            {
                key: "darkMode",
                label: "🌙 Dark Mode",
                desc: "Enable dark theme for the entire page",
            },
        ];

        featureSettings.forEach((setting) => {
            const settingDiv = document.createElement("div");
            settingDiv.style.cssText = `
                margin-bottom: 15px;
                padding: 15px;
                border: 1px solid #2A2A2A;
                border-radius: 8px;
                background: #161616;
                transition: all 0.3s ease;
            `;

            // Add hover effects to setting divs
            settingDiv.addEventListener("mouseenter", () => {
                settingDiv.style.background = "#1A1A1A";
                settingDiv.style.border = "1px solid #3A3A3A";
            });

            settingDiv.addEventListener("mouseleave", () => {
                settingDiv.style.background = "#161616";
                settingDiv.style.border = "1px solid #2A2A2A";
            });

            const label = document.createElement("label");
            label.style.cssText = `
                display: flex;
                align-items: center;
                cursor: pointer;
                font-weight: bold;
                margin-bottom: 5px;
                color: #FFFFFF;
            `;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = isEnabled(setting.key);
            checkbox.style.cssText = `
                margin-right: 10px;
                transform: scale(1.2);
            `;

            checkbox.addEventListener("change", () => {
                saveConfig(setting.key, checkbox.checked);

                // Handle dark mode specifically
                if (setting.key === "darkMode") {
                    applyDarkMode(checkbox.checked);
                    showSmallNotification(
                        `${
                            checkbox.checked ? "🌙 Dark" : "☀️ Light"
                        } mode enabled!`,
                        "success"
                    );
                } else {
                    showSaveNotification();
                }
            });

            const labelText = document.createElement("span");
            labelText.textContent = setting.label;

            const description = document.createElement("div");
            description.textContent = setting.desc;
            description.style.cssText = `
                font-size: 12px;
                color: #8A8A8A;
                margin-left: 22px;
                font-weight: normal;
            `;

            label.appendChild(checkbox);
            label.appendChild(labelText);
            settingDiv.appendChild(label);
            settingDiv.appendChild(description);
            settingsForm.appendChild(settingDiv);
        });

        // Add theme selector
        const themeDiv = document.createElement("div");
        themeDiv.style.cssText = `
            margin-bottom: 20px;
            padding: 15px;
            border: 2px solid #00A4FF;
            border-radius: 8px;
            background: linear-gradient(135deg, rgba(0,164,255,0.1) 0%, rgba(0,164,255,0.05) 100%);
        `;

        const themeLabel = document.createElement("label");
        themeLabel.textContent = "🎨 Editor Theme:";
        themeLabel.style.cssText =
            "font-weight: bold; display: block; margin-bottom: 10px; color: #FFFFFF;";

        const themeSelect = document.createElement("select");
        themeSelect.style.cssText = `
            padding: 8px 12px;
            border: 1px solid #3A3A3A;
            border-radius: 6px;
            font-family: ${styles.fontFamily};
            width: 100%;
            font-size: 14px;
            background: #1A1A1A;
            color: #FFFFFF;
        `;

        Object.entries(THEMES).forEach(([key, theme]) => {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = theme.name;
            if (key === userConfig.editorTheme) option.selected = true;
            themeSelect.appendChild(option);
        });

        themeSelect.addEventListener("change", () => {
            saveConfig("editorTheme", themeSelect.value);
            updateEditorTheme(themeSelect.value);
            showSaveNotification();
        });

        const themeDesc = document.createElement("div");
        themeDesc.textContent = "Choose your preferred editor theme";
        themeDesc.style.cssText =
            "font-size: 12px; color: #8A8A8A; margin-top: 5px;";

        themeDiv.appendChild(themeLabel);
        themeDiv.appendChild(themeSelect);
        themeDiv.appendChild(themeDesc);
        settingsForm.appendChild(themeDiv);

        // Add Saved Problems section
        if (isEnabled("problemsRecorder")) {
            const savedProblemsDiv = document.createElement("div");
            savedProblemsDiv.style.cssText = `
                margin-bottom: 20px;
                padding: 15px;
                border: 2px solid #00A4FF;
                border-radius: 8px;
                background: linear-gradient(135deg, rgba(0,164,255,0.1) 0%, rgba(0,164,255,0.05) 100%);
            `;

            const savedProblemsLabel = document.createElement("div");
            savedProblemsLabel.textContent = "📌 Saved Problems";
            savedProblemsLabel.style.cssText = `
                font-weight: bold;
                margin-bottom: 10px;
                color: #FFFFFF;
                font-size: 16px;
            `;

            const savedCount = getSavedProblems().length;
            const savedProblemsInfo = document.createElement("div");
            savedProblemsInfo.textContent = `${savedCount} problems saved`;
            savedProblemsInfo.style.cssText = `
                font-size: 14px;
                color: #B0B0B0;
                margin-bottom: 10px;
            `;

            const manageSavedBtn = document.createElement("button");
            manageSavedBtn.textContent = "📊 Manage Saved Problems";
            manageSavedBtn.style.cssText = `
                padding: 10px 20px;
                background: #00A4FF;
                color: #FFFFFF;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-family: ${styles.fontFamily};
                transition: all 0.3s ease;
                width: 100%;
            `;

            manageSavedBtn.addEventListener("mouseover", () => {
                manageSavedBtn.style.background = "#0090FF";
                manageSavedBtn.style.transform = "translateY(-1px)";
            });
            manageSavedBtn.addEventListener("mouseout", () => {
                manageSavedBtn.style.background = "#00A4FF";
                manageSavedBtn.style.transform = "translateY(0)";
            });

            manageSavedBtn.addEventListener("click", () => {
                // Close settings modal
                modal.style.display = "none";
                // Show saved problems modal
                showSavedProblemsModal();
            });

            savedProblemsDiv.appendChild(savedProblemsLabel);
            savedProblemsDiv.appendChild(savedProblemsInfo);
            savedProblemsDiv.appendChild(manageSavedBtn);
            settingsForm.appendChild(savedProblemsDiv);
        }

        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 25px;
            gap: 10px;
        `;

        const resetButton = document.createElement("button");
        resetButton.textContent = "🔄 Reset to Defaults";
        resetButton.style.cssText = `
            padding: 10px 20px;
            background: #FF5E7E;
            color: #FFFFFF;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-family: ${styles.fontFamily};
            transition: all 0.3s ease;
        `;

        // Add hover effects to reset button
        resetButton.addEventListener("mouseover", () => {
            resetButton.style.background = "#FF7A94";
            resetButton.style.transform = "translateY(-1px)";
        });
        resetButton.addEventListener("mouseout", () => {
            resetButton.style.background = "#FF5E7E";
            resetButton.style.transform = "translateY(0)";
            resetButton.style.boxShadow = "0 2px 6px rgba(255,94,126,0.40)";
        });

        resetButton.addEventListener("click", async () => {
            const confirmed = await showConfirm(
                "Reset Settings",
                "Reset all settings to defaults? This will reload the page."
            );
            if (confirmed) {
                Object.keys(CONFIG_DEFAULTS).forEach((key) => {
                    GM_setValue(key, CONFIG_DEFAULTS[key]);
                });
                location.reload();
            }
        });

        const closeButton = document.createElement("button");
        closeButton.textContent = "✅ Save & Close";
        closeButton.style.cssText = `
            padding: 10px 20px;
            background: ${styles.successColor};
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-family: ${styles.fontFamily};
        `;

        closeButton.addEventListener("click", () => {
            modal.style.display = "none";
            location.reload(); // Reload to apply changes
        });

        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(closeButton);

        modalContent.appendChild(title);
        modalContent.appendChild(settingsForm);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);

        // Close modal when clicking outside
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });

        document.body.appendChild(modal);
        return modal;
    }

    function showSaveNotification() {
        const notification = document.createElement("div");
        notification.textContent = "✅ Settings saved!";
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${styles.successColor};
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 10001;
            font-family: ${styles.fontFamily};
            font-weight: bold;
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }

    function showSmallNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.textContent = message;

        const colors = {
            success: "#00A4FF",
            error: "#FF5E7E",
            warning: "#FFAE54",
            info: "#00A4FF",
        };

        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: #121212;
            color: #FFFFFF;
            padding: 16px 24px;
            border-radius: 12px;
            border: 1px solid #2A2A2A;
            box-shadow: 0 4px 12px rgba(0,0,0,0.60);
            font-size: 14px;
            font-family: ${styles.fontFamily};
            font-weight: 600;
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
            opacity: 0;
            backdrop-filter: blur(12px);
            max-width: 320px;
            word-wrap: break-word;
            border-left: 3px solid ${colors[type] || colors.info};
        `;

        document.body.appendChild(notification);

        // Slide in animation
        setTimeout(() => {
            notification.style.transform = "translateX(0)";
            notification.style.opacity = "1";
        }, 10);

        // Slide out and remove
        setTimeout(() => {
            notification.style.transform = "translateX(100%)";
            notification.style.opacity = "0";
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }

    /* ---------- Saved Problems Modal ---------- */
    function showSavedProblemsModal() {
        const modal = document.createElement("div");
        modal.id = "cf-saved-problems-modal";
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10002;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: ${styles.fontFamily};
        `;

        const modalContent = document.createElement("div");
        modalContent.style.cssText = `
            background: #121212;
            border: 1px solid #2A2A2A;
            border-radius: 12px;
            max-width: 90%;
            max-height: 90%;
            width: 1000px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.7);
            display: flex;
            flex-direction: column;
        `;

        // Header
        const header = document.createElement("div");
        header.style.cssText = `
            padding: 20px 30px;
            background: linear-gradient(90deg, #00A4FF 0%, #0090FF 100%);
            color: #FFFFFF;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = document.createElement("h2");
        title.textContent = "📌 Saved Problems";
        title.style.cssText = "margin: 0; font-size: 24px; font-weight: bold;";

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "✕";
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            color: #FFFFFF;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s ease;
        `;
        closeBtn.addEventListener("mouseover", () => {
            closeBtn.style.backgroundColor = "rgba(255,255,255,0.2)";
        });
        closeBtn.addEventListener("mouseout", () => {
            closeBtn.style.backgroundColor = "transparent";
        });
        closeBtn.addEventListener("click", () => {
            document.body.removeChild(modal);
        });

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Toolbar
        const toolbar = document.createElement("div");
        toolbar.style.cssText = `
            padding: 15px 30px;
            background: #1A1A1A;
            border-bottom: 1px solid #2A2A2A;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        `;

        const savedProblems = getSavedProblems();
        const countInfo = document.createElement("span");
        countInfo.textContent = `${savedProblems.length} problems saved`;
        countInfo.style.cssText = "color: #B0B0B0; font-size: 14px;";

        const toolbarButtons = document.createElement("div");
        toolbarButtons.style.cssText =
            "display: flex; gap: 10px; align-items: center;";

        const selectAllBtn = document.createElement("button");
        selectAllBtn.textContent = "Select All";
        selectAllBtn.style.cssText = `
            padding: 8px 16px;
            background: transparent;
            color: #00A4FF;
            border: 1px solid #00A4FF;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
        `;

        const exportBtn = document.createElement("button");
        exportBtn.textContent = "📤 Export CSV";
        exportBtn.style.cssText = `
            padding: 8px 16px;
            background: #00A4FF;
            color: #FFFFFF;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
        `;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️ Delete Selected";
        deleteBtn.style.cssText = `
            padding: 8px 16px;
            background: #FF5E7E;
            color: #FFFFFF;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
        `;

        toolbarButtons.appendChild(selectAllBtn);
        toolbarButtons.appendChild(exportBtn);
        toolbarButtons.appendChild(deleteBtn);

        toolbar.appendChild(countInfo);
        toolbar.appendChild(toolbarButtons);

        // Table container
        const tableContainer = document.createElement("div");
        tableContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 0;
            background: #161616;
        `;

        const table = createSavedProblemsTable();
        tableContainer.appendChild(table);

        // Event listeners
        exportBtn.addEventListener("click", () => exportSavedProblemsAsCSV());
        deleteBtn.addEventListener("click", () =>
            deleteSelectedProblems(table)
        );
        selectAllBtn.addEventListener("click", () => toggleSelectAll(table));

        // Assemble modal
        modalContent.appendChild(header);
        modalContent.appendChild(toolbar);
        modalContent.appendChild(tableContainer);
        modal.appendChild(modalContent);

        // Close on outside click
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        document.body.appendChild(modal);
    }

    function createSavedProblemsTable() {
        const savedProblems = getSavedProblems();

        const table = document.createElement("table");
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            color: #FFFFFF;
            font-size: 14px;
        `;

        // Header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.style.cssText = `
            background: #2A2A2A;
            border-bottom: 2px solid #3A3A3A;
        `;

        const headers = [
            { text: "", width: "40px" }, // Checkbox
            { text: "#", width: "60px" },
            { text: "Problem", width: "auto" },
            { text: "Time Limit", width: "120px" },
            { text: "Memory Limit", width: "120px" },
            { text: "Saved", width: "140px" },
            { text: "Actions", width: "80px" },
        ];

        headers.forEach((header) => {
            const th = document.createElement("th");
            th.textContent = header.text;
            th.style.cssText = `
                padding: 12px 15px;
                text-align: left;
                font-weight: bold;
                color: #FFFFFF;
                width: ${header.width};
                border-right: 1px solid #3A3A3A;
            `;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement("tbody");

        if (savedProblems.length === 0) {
            const emptyRow = document.createElement("tr");
            const emptyCell = document.createElement("td");
            emptyCell.colSpan = headers.length;
            emptyCell.textContent =
                "No problems saved yet. Start flagging problems on Codeforces!";
            emptyCell.style.cssText = `
                padding: 40px;
                text-align: center;
                color: #888;
                font-style: italic;
            `;
            emptyRow.appendChild(emptyCell);
            tbody.appendChild(emptyRow);
        } else {
            savedProblems.forEach((problem, index) => {
                const row = document.createElement("tr");
                row.style.cssText = `
                    border-bottom: 1px solid #2A2A2A;
                    transition: background-color 0.2s ease;
                `;
                row.addEventListener("mouseenter", () => {
                    row.style.backgroundColor = "#1F1F1F";
                });
                row.addEventListener("mouseleave", () => {
                    row.style.backgroundColor = "transparent";
                });

                // Checkbox
                const checkboxCell = document.createElement("td");
                checkboxCell.style.cssText =
                    "padding: 12px 15px; border-right: 1px solid #2A2A2A;";
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "problem-checkbox";
                checkbox.dataset.problemId = problem.id;
                checkbox.style.cssText = "transform: scale(1.2);";
                checkboxCell.appendChild(checkbox);

                // Problem ID
                const idCell = document.createElement("td");
                idCell.textContent = problem.contestId + problem.problemIndex;
                idCell.style.cssText = `
                    padding: 12px 15px;
                    border-right: 1px solid #2A2A2A;
                    font-weight: bold;
                    color: #00A4FF;
                `;

                // Problem title (with link)
                const titleCell = document.createElement("td");
                titleCell.style.cssText =
                    "padding: 12px 15px; border-right: 1px solid #2A2A2A;";
                const titleLink = document.createElement("a");
                titleLink.href = problem.url;
                titleLink.textContent = problem.title;
                titleLink.target = "_blank";
                titleLink.style.cssText = `
                    color: #00A4FF;
                    text-decoration: none;
                    font-weight: 500;
                `;
                titleLink.addEventListener("mouseover", () => {
                    titleLink.style.textDecoration = "underline";
                });
                titleLink.addEventListener("mouseout", () => {
                    titleLink.style.textDecoration = "none";
                });
                titleCell.appendChild(titleLink);

                // Time limit
                const timeCell = document.createElement("td");
                timeCell.textContent = problem.timeLimit || "N/A";
                timeCell.style.cssText = `
                    padding: 12px 15px;
                    border-right: 1px solid #2A2A2A;
                    color: #B0B0B0;
                `;

                // Memory limit
                const memoryCell = document.createElement("td");
                memoryCell.textContent = problem.memoryLimit || "N/A";
                memoryCell.style.cssText = `
                    padding: 12px 15px;
                    border-right: 1px solid #2A2A2A;
                    color: #B0B0B0;
                `;

                // Saved date
                const savedCell = document.createElement("td");
                const savedDate = new Date(
                    problem.savedAt
                ).toLocaleDateString();
                savedCell.textContent = savedDate;
                savedCell.style.cssText = `
                    padding: 12px 15px;
                    border-right: 1px solid #2A2A2A;
                    color: #B0B0B0;
                    font-size: 12px;
                `;

                // Actions
                const actionsCell = document.createElement("td");
                actionsCell.style.cssText =
                    "padding: 12px 15px; text-align: center;";
                const removeBtn = document.createElement("button");
                removeBtn.textContent = "🗑️";
                removeBtn.title = "Remove problem";
                removeBtn.style.cssText = `
                    background: transparent;
                    border: none;
                    color: #FF5E7E;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: background 0.2s ease;
                `;
                removeBtn.addEventListener("mouseover", () => {
                    removeBtn.style.backgroundColor = "rgba(255, 94, 126, 0.2)";
                });
                removeBtn.addEventListener("mouseout", () => {
                    removeBtn.style.backgroundColor = "transparent";
                });
                removeBtn.addEventListener("click", () => {
                    if (removeSavedProblem(problem.id)) {
                        row.remove();
                        showSmallNotification("Problem removed!", "success");
                    }
                });
                actionsCell.appendChild(removeBtn);

                row.appendChild(checkboxCell);
                row.appendChild(idCell);
                row.appendChild(titleCell);
                row.appendChild(timeCell);
                row.appendChild(memoryCell);
                row.appendChild(savedCell);
                row.appendChild(actionsCell);

                tbody.appendChild(row);
            });
        }

        table.appendChild(tbody);
        return table;
    }

    function exportSavedProblemsAsCSV() {
        const savedProblems = getSavedProblems();

        if (savedProblems.length === 0) {
            showSmallNotification("No problems to export", "warning");
            return;
        }

        const headers = [
            "ID",
            "Contest",
            "Problem",
            "Title",
            "URL",
            "Time Limit",
            "Memory Limit",
            "Saved Date",
        ];
        const csvContent = [
            headers.join(","),
            ...savedProblems.map((problem) =>
                [
                    problem.id,
                    problem.contestId,
                    problem.problemIndex,
                    `"${problem.title.replace(/"/g, '""')}"`, // Escape quotes
                    problem.url,
                    `"${problem.timeLimit}"`,
                    `"${problem.memoryLimit}"`,
                    new Date(problem.savedAt).toISOString(),
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute(
                "download",
                `saved_problems_${new Date().toISOString().split("T")[0]}.csv`
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSmallNotification(
                `📤 Exported ${savedProblems.length} problems`,
                "success"
            );
        } else {
            showSmallNotification(
                "Export not supported in this browser",
                "error"
            );
        }
    }

    function deleteSelectedProblems(table) {
        const checkboxes = table.querySelectorAll(".problem-checkbox:checked");

        if (checkboxes.length === 0) {
            showSmallNotification("No problems selected", "warning");
            return;
        }

        const problemIds = Array.from(checkboxes).map(
            (cb) => cb.dataset.problemId
        );

        createModal(
            "Delete Selected Problems",
            `Are you sure you want to delete ${problemIds.length} selected problem(s)?`,
            [
                { text: "Cancel", value: false, primary: false },
                { text: "Delete", value: true, primary: true },
            ]
        ).then((confirmed) => {
            if (confirmed) {
                let deletedCount = 0;
                problemIds.forEach((id) => {
                    if (removeSavedProblem(id)) {
                        deletedCount++;
                        // Remove row from table
                        const checkbox = table.querySelector(
                            `[data-problem-id="${id}"]`
                        );
                        if (checkbox) {
                            checkbox.closest("tr").remove();
                        }
                    }
                });

                showSmallNotification(
                    `🗑️ Deleted ${deletedCount} problems`,
                    "success"
                );
            }
        });
    }

    function toggleSelectAll(table) {
        const checkboxes = table.querySelectorAll(".problem-checkbox");
        const allChecked = Array.from(checkboxes).every((cb) => cb.checked);

        checkboxes.forEach((cb) => {
            cb.checked = !allChecked;
        });
    }

    /* ---------- Language configurations ---------- */
    const languageConfigs = {
        "GNU GCC C11": {
            monaco: "c",
            cfId: "43",
            template:
                "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}",
        },
        "GNU G++20 11.2.0": {
            monaco: "cpp",
            cfId: "73",
            template:
                "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    \n    // Your code here\n    \n    return 0;\n}",
        },
        "Python 3": {
            monaco: "python",
            cfId: "31",
            template: "# Your Python code here\n",
        },
        "Java 11": {
            monaco: "java",
            cfId: "60",
            template:
                "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Your code here\n    }\n}",
        },
        JavaScript: {
            monaco: "javascript",
            cfId: "55",
            template: "// Your JavaScript code here\n",
        },
    };

    /* ---------- Global variables ---------- */
    let monacoEditor = null;
    let editorContainer = null;
    let settingsModal = null;
    let editorInitialized = false;
    let cleanupFunctions = [];

    // Cleanup function to prevent memory leaks
    function cleanup() {
        cleanupFunctions.forEach((fn) => {
            try {
                fn();
            } catch (e) {
                console.error("Cleanup error:", e);
            }
        });
        cleanupFunctions = [];
    }

    // Add cleanup function
    function addCleanup(fn) {
        cleanupFunctions.push(fn);
    }

    /* ---------- Theme Management ---------- */
    function updateEditorTheme(themeKey) {
        if (!monacoEditor) return;

        // Always use our custom vibrant theme
        monaco.editor.setTheme("cfpp-dark");

        // Update editor container styling
        if (editorContainer) {
            const theme = THEMES[themeKey] || THEMES["vs-dark"];
            editorContainer.style.background = theme.background;
            const header = editorContainer.querySelector("div");
            if (header) {
                header.style.background = theme.headerBg;
            }
        }
    }

    /* ---------- Enhanced Submission Form ---------- */
    function enhanceSubmissionForm() {
        const submitForm = document.querySelector(".submitForm");
        if (!submitForm) return;

        const submitContainer = submitForm.querySelector("td:last-child div");
        if (!submitContainer) return;

        // Create enhanced submit button
        const enhancedSubmitBtn = document.createElement("button");
        enhancedSubmitBtn.type = "button";
        enhancedSubmitBtn.textContent = "🚀 Submit with Preview";
        enhancedSubmitBtn.style.cssText = `
            margin: 10px 5px;
            padding: 8px 15px;
            background: ${styles.successColor};
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-family: ${styles.fontFamily};
            font-size: 12px;
        `;

        // Add event listener
        enhancedSubmitBtn.addEventListener("click", async () => {
            const code = monacoEditor ? monacoEditor.getValue() : "";
            if (!code.trim()) {
                await showAlert(
                    "No Code",
                    "Please write some code before submitting!"
                );
                return;
            }

            // Show preview popup
            await showSubmissionPreview(code, submitForm);
        });

        submitContainer.appendChild(enhancedSubmitBtn);
    }

    /* ---------- Submission Preview Modal ---------- */
    function showSubmissionPreview(code, form) {
        return new Promise((resolve) => {
            const modal = document.createElement("div");
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10002;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: ${styles.fontFamily};
            `;

            const modalContent = document.createElement("div");
            modalContent.style.cssText = `
                background: white;
                padding: 25px;
                border-radius: 12px;
                max-width: 80%;
                max-height: 80%;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                display: flex;
                flex-direction: column;
            `;

            const title = document.createElement("h3");
            title.textContent = "🚀 Submit Solution - Preview";
            title.style.cssText = `
                margin: 0 0 15px 0;
                color: #333;
                text-align: center;
            `;

            const info = document.createElement("div");
            const langSelect = form.querySelector(
                'select[name="programTypeId"]'
            );
            const selectedLang =
                langSelect.options[langSelect.selectedIndex].text;
            info.innerHTML = `
                <strong>Language:</strong> ${selectedLang}<br>
                <strong>Code Length:</strong> ${code.length} characters
            `;
            info.style.cssText = `
                margin-bottom: 15px;
                color: #666;
                background: #f5f5f5;
                padding: 10px;
                border-radius: 6px;
            `;

            const editorDiv = document.createElement("div");
            editorDiv.style.cssText = `
                height: 400px;
                border: 1px solid #ddd;
                margin-bottom: 20px;
                flex: 1;
            `;

            const buttonContainer = document.createElement("div");
            buttonContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                gap: 15px;
            `;

            const cancelBtn = document.createElement("button");
            cancelBtn.textContent = "❌ Cancel";
            cancelBtn.style.cssText = `
                padding: 10px 20px;
                background: ${styles.errorColor};
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-family: ${styles.fontFamily};
            `;

            const submitBtn = document.createElement("button");
            submitBtn.textContent = "✅ Submit Solution";
            submitBtn.style.cssText = `
                padding: 10px 20px;
                background: ${styles.successColor};
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                font-family: ${styles.fontFamily};
            `;

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(submitBtn);

            modalContent.appendChild(title);
            modalContent.appendChild(info);
            modalContent.appendChild(editorDiv);
            modalContent.appendChild(buttonContainer);
            modal.appendChild(modalContent);

            // Initialize Monaco editor in modal
            let previewEditor = null;
            const disposePreviewEditor = () => {
                if (previewEditor) {
                    previewEditor.dispose();
                    previewEditor = null;
                }
            };

            if (window.monaco) {
                previewEditor = monaco.editor.create(editorDiv, {
                    value: code,
                    language: "cpp",
                    theme: THEMES[userConfig.editorTheme].monaco,
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                });

                // Resize editor when modal opens
                setTimeout(() => previewEditor && previewEditor.layout(), 100);
            } else {
                // Fallback textarea
                const textarea = document.createElement("textarea");
                textarea.value = code;
                textarea.style.cssText = `
                    width: 100%; height: 100%; border: none; padding: 10px;
                    font-family: monospace; background: #1e1e1e; color: #d4d4d4;
                    border-radius: 6px;
                `;
                textarea.readOnly = true;
                editorDiv.appendChild(textarea);
            }

            cancelBtn.addEventListener("click", () => {
                disposePreviewEditor();
                document.body.removeChild(modal);
                resolve(false);
            });

            submitBtn.addEventListener("click", () => {
                // Set the code in the form
                const sourceInput = form.querySelector('input[name="source"]');
                if (sourceInput) sourceInput.value = code;

                disposePreviewEditor();
                // Submit the form
                form.submit();
                document.body.removeChild(modal);
                resolve(true);
            });

            document.body.appendChild(modal);
        });
    }

    /* ---------- Buttons ---------- */
    const copyButton = document.createElement("button");
    const youtubeButton = document.createElement("button");
    const excaliButton = document.createElement("button"); // Excalidraw
    const cppshButton = document.createElement("button"); // cpp.sh
    const explainButton = document.createElement("button"); // Perplexity
    const chatgptButton = document.createElement("button"); // ChatGPT
    const settingsButton = document.createElement("button"); // Settings
    const savedProblemsButton = document.createElement("button"); // Saved Problems

    copyButton.textContent = "Copy Problem";
    youtubeButton.textContent = "Solutions Tutorials";
    excaliButton.textContent = "Open Excalidraw";
    cppshButton.textContent = "Try Code on cpp.sh";
    explainButton.textContent = "Perplexity Explain";
    chatgptButton.textContent = "ChatGPT Explain";
    settingsButton.textContent = "⚙️ Settings";
    savedProblemsButton.textContent = "📌 Saved Problems";

    /* ---------- Navigation buttons (prev / next) ---------- */
    const navContainer = document.createElement("div");
    navContainer.id = "cf-nav-container";
    navContainer.style.position = "relative";
    navContainer.style.marginTop = "15px";
    navContainer.style.display = "inline-block";
    navContainer.style.marginBottom = "15px";
    navContainer.style.fontFamily = styles.fontFamily;

    const prevButton = document.createElement("a");
    const nextButton = document.createElement("a");
    prevButton.textContent = "← Previous Problem";
    nextButton.textContent = "Next Problem →";
    applyButtonStyle(prevButton, false);
    applyButtonStyle(nextButton, false);
    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);

    /* ---------- Extract problem and contest info ---------- */
    function getProblemInfo() {
        const url = window.location.href;
        console.log("Parsing URL:", url);

        let contestId = null;
        let problemIndex = null;
        let submissionUrl = null;
        let isGym = false;

        // Enhanced URL patterns with better regex
        const patterns = [
            {
                name: "contest",
                regex: /\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)/,
                urlBuilder: (id) =>
                    `https://codeforces.com/contest/${id}/submit`,
            },
            {
                name: "problemset",
                regex: /\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)/,
                urlBuilder: (id, problem) =>
                    `https://codeforces.com/problemset/submit/${id}/problem/${problem}`,
            },
            {
                name: "gym",
                regex: /\/gym\/(\d+)\/problem\/([A-Za-z0-9]+)/,
                urlBuilder: (id) => `https://codeforces.com/gym/${id}/submit`,
                isGym: true,
            },
            {
                name: "group",
                regex: /\/group\/([^/]+)\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)/,
                urlBuilder: (groupId, contestId) =>
                    `https://codeforces.com/group/${groupId}/contest/${contestId}/submit`,
            },
            {
                name: "edu",
                regex: /\/edu\/course\/\d+\/lesson\/\d+\/practice\/contest\/(\d+)\/problem\/([A-Za-z0-9]+)/,
                urlBuilder: (id) =>
                    `https://codeforces.com/contest/${id}/submit`,
            },
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern.regex);
            if (match) {
                console.log(`Matched pattern: ${pattern.name}`, match);

                if (pattern.name === "group") {
                    const groupId = match[1];
                    contestId = match[2];
                    problemIndex = match[3];
                    submissionUrl = pattern.urlBuilder(groupId, contestId);
                } else if (pattern.name === "problemset") {
                    contestId = match[1];
                    problemIndex = match[2];
                    submissionUrl = pattern.urlBuilder(contestId, problemIndex);
                } else {
                    contestId = match[1];
                    problemIndex = match[2];
                    submissionUrl = pattern.urlBuilder(contestId);
                }

                isGym = pattern.isGym || false;
                break;
            }
        }

        const result = { contestId, problemIndex, submissionUrl, isGym };
        console.log("Extracted problem info:", result);

        return result;
    }

    /* ---------- Core helpers ---------- */
    function extractProblemContent() {
        const problemStatement = document.querySelector(".problem-statement");
        if (!problemStatement) {
            showAlert(
                "Error",
                "Could not find the problem statement container."
            );
            return "";
        }
        const cloned = problemStatement.cloneNode(true);
        cloned
            .querySelectorAll(
                ".html2md-panel, .ojb_btn, .ojb_btn_popover, button, .btn, .ad, .advertisement, iframe, .sidebar, nav, header, footer, script, style"
            )
            .forEach((el) => el.remove());

        let content = "";
        const title = cloned.querySelector(".title");
        if (title) content += title.textContent.trim() + "\n\n";

        const meta = cloned.querySelectorAll(".time-limit, .memory-limit");
        meta.forEach((node) => (content += node.textContent.trim() + "\n"));
        if (meta.length) content += "\n";

        const sections = cloned.querySelectorAll(".problem-statement > div");
        sections.forEach((div) => {
            if (div.classList.contains("header")) return;
            const input = div.querySelector(".input-specification");
            const output = div.querySelector(".output-specification");

            if (input)
                content += "Input:\n" + input.textContent.trim() + "\n\n";
            else if (output)
                content += "Output:\n" + output.textContent.trim() + "\n\n";
            else {
                const text = div.textContent.trim();
                if (text) content += text + "\n\n";
            }
        });

        const samples = cloned.querySelectorAll(".sample-test .sample-test-io");
        if (samples.length) {
            content += "Examples:\n\n";
            samples.forEach((ex, i) => {
                const inp = ex.querySelector(".input pre");
                const out = ex.querySelector(".output pre");
                if (inp)
                    content += `Example ${
                        i + 1
                    } Input:\n${inp.textContent.trim()}\n\n`;
                if (out)
                    content += `Example ${
                        i + 1
                    } Output:\n${out.textContent.trim()}\n\n`;
            });
        }

        return content.replace(/\n{3,}/g, "\n\n");
    }

    /* ---------- Create VS Code Editor ---------- */
    async function createCodeEditor() {
        if (!isEnabled("codeEditor") || editorInitialized || editorContainer) {
            console.log("Editor already initialized or disabled");
            return;
        }

        console.log("Initializing code editor...");
        editorInitialized = true;

        try {
            await loadMonacoEditor();
        } catch (error) {
            console.error("Failed to load Monaco Editor:", error);
            // Continue with fallback editor
        }

        // Create editor container
        editorContainer = document.createElement("div");
        editorContainer.id = "cf-monaco-editor-container";
        editorContainer.style.cssText = `
            margin: 30px 0;
            width: 100%;
            max-width: none;
            background: #121212;
            border: 1px solid #2A2A2A;
            border-radius: 12px;
            font-family: ${styles.fontFamily};
            box-shadow: 0 0 0 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.60);
            position: relative;
            z-index: 1;
            transition: all 0.3s ease;
        `;

        // Add hover effect
        editorContainer.addEventListener("mouseenter", () => {
            editorContainer.style.background = "#161616";
            editorContainer.style.border = "1px solid #3A3A3A";
            editorContainer.style.boxShadow = "0 6px 16px rgba(0,0,0,0.70)";
        });

        editorContainer.addEventListener("mouseleave", () => {
            editorContainer.style.background = "#121212";
            editorContainer.style.border = "1px solid #2A2A2A";
            editorContainer.style.boxShadow =
                "0 0 0 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.60)";
        });

        // Create header
        const header = document.createElement("div");
        header.style.cssText = `
            padding: 20px 24px;
            background: linear-gradient(90deg, #00A4FF 0%, #0090FF 100%);
            color: #FFFFFF;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
            box-shadow: 0 2px 6px rgba(0,164,255,0.40);
        `;

        const headerLeft = document.createElement("div");
        headerLeft.style.cssText =
            "display: flex; align-items: center; gap: 15px; flex-wrap: wrap;";

        // Title
        const editorTitle = document.createElement("h3");
        editorTitle.textContent = "Code Editor";
        editorTitle.style.cssText = `
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        `;

        // Language selector
        const langLabel = document.createElement("label");
        langLabel.textContent = "Lang: ";
        langLabel.style.cssText = "font-weight: bold; color: white;";

        const langSelect = document.createElement("select");
        langSelect.style.cssText = `
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            font-family: ${styles.fontFamily};
            background: white;
            color: #333;
            font-weight: bold;
        `;

        Object.keys(languageConfigs).forEach((lang) => {
            const option = document.createElement("option");
            option.value = lang;
            option.textContent = lang;
            if (lang === "GNU G++20 11.2.0") option.selected = true;
            langSelect.appendChild(option);
        });

        headerLeft.appendChild(editorTitle);
        headerLeft.appendChild(langLabel);
        headerLeft.appendChild(langSelect);

        // Header buttons
        const headerRight = document.createElement("div");
        headerRight.style.cssText =
            "display: flex; gap: 10px; flex-wrap: wrap;";

        // Submit button
        const submitBtn = document.createElement("button");
        submitBtn.textContent = "🚀 Submit Solution";
        submitBtn.style.cssText = `
            padding: 12px 20px;
            background: linear-gradient(90deg, #00A4FF 0%, #0090FF 100%);
            color: #FFFFFF;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-family: ${styles.fontFamily};
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 6px rgba(0,164,255,0.40);
        `;

        // Add modern hover effects
        submitBtn.addEventListener("mouseover", () => {
            submitBtn.style.background =
                "linear-gradient(90deg, #00B8FF 0%, #0080FF 100%)";
            submitBtn.style.transform = "translateY(-1px)";
            submitBtn.style.boxShadow = "0 4px 12px rgba(0,164,255,0.50)";
        });
        submitBtn.addEventListener("mouseout", () => {
            submitBtn.style.background =
                "linear-gradient(90deg, #00A4FF 0%, #0090FF 100%)";
            submitBtn.style.transform = "translateY(0)";
            submitBtn.style.boxShadow = "0 2px 6px rgba(0,164,255,0.40)";
        });
        submitBtn.addEventListener("mousedown", () => {
            submitBtn.style.background = "#0070E0";
        });
        submitBtn.addEventListener("mouseup", () => {
            submitBtn.style.background =
                "linear-gradient(90deg, #00B8FF 0%, #0080FF 100%)";
        });

        headerRight.appendChild(submitBtn);
        header.appendChild(headerLeft);
        header.appendChild(headerRight);

        // Add header to container FIRST
        editorContainer.appendChild(header);

        // Create Monaco editor
        const editorDiv = document.createElement("div");
        editorDiv.style.cssText = `
            height: 400px;
            width: 100%;
            background: #0E0E0E;
            border-radius: 0 0 12px 12px;
            overflow: hidden;
        `;
        editorContainer.appendChild(editorDiv);

        // Initialize Monaco Editor with proper error handling
        try {
            if (typeof require !== "undefined") {
                require(["vs/editor/editor.main"], () => {
                    try {
                        if (window.monaco) {
                            // Define custom vibrant C++ theme
                            monaco.editor.defineTheme("cfpp-dark", {
                                base: "vs-dark",
                                inherit: true,
                                rules: [
                                    { token: "keyword", foreground: "C586C0" }, // purple
                                    {
                                        token: "identifier",
                                        foreground: "9CDCFE",
                                    }, // light-blue
                                    { token: "number", foreground: "B5CEA8" }, // green
                                    { token: "string", foreground: "CE9178" }, // salmon
                                    { token: "comment", foreground: "6A9955" }, // greenish
                                ],
                            });

                            // Register C++ completion provider
                            monaco.languages.registerCompletionItemProvider(
                                "cpp",
                                {
                                    triggerCharacters: [".", ">", ":"],
                                    provideCompletionItems: () => ({
                                        suggestions: [
                                            ...[
                                                "auto",
                                                "break",
                                                "case",
                                                "class",
                                                "const",
                                                "continue",
                                                "else",
                                                "for",
                                                "if",
                                                "return",
                                                "struct",
                                                "switch",
                                                "typedef",
                                                "while",
                                            ].map((k) => ({
                                                label: k,
                                                kind: monaco.languages
                                                    .CompletionItemKind.Keyword,
                                                insertText: k,
                                            })),
                                            {
                                                label: "for-loop",
                                                kind: monaco.languages
                                                    .CompletionItemKind.Snippet,
                                                insertText: [
                                                    "for (int ${1:i} = 0; ${1:i} < ${2:n}; ++${1:i}) {",
                                                    "\t$0",
                                                    "}",
                                                ].join("\n"),
                                                insertTextRules:
                                                    monaco.languages
                                                        .CompletionItemInsertTextRule
                                                        .InsertAsSnippet,
                                                documentation:
                                                    "Classic for loop",
                                            },
                                        ],
                                    }),
                                }
                            );

                            monacoEditor = window.monaco.editor.create(
                                editorDiv,
                                {
                                    language: "cpp",
                                    theme: "cfpp-dark",
                                    value: "// Start coding here...\n",
                                    automaticLayout: true,
                                    wordWrap: "on",
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    contextmenu: true,
                                    fontSize: 16,
                                    fontFamily:
                                        "'Cascadia Code', 'JetBrains Mono', 'Source Code Pro', 'Consolas', 'Courier New', 'Monaco', 'Menlo', 'Ubuntu Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', monospace",
                                    lineNumbers: "on",
                                    renderWhitespace: "selection",
                                    tabSize: 4,
                                    insertSpaces: true,
                                    folding: true,
                                    lineDecorationsWidth: 10,
                                    lineNumbersMinChars: 3,
                                    glyphMargin: false,
                                    "semanticHighlighting.enabled": true,
                                    colorDecorators: true,
                                    bracketPairColorization: { enabled: true },
                                    smoothScrolling: true,
                                    cursorBlinking: "smooth",
                                    cursorSmoothCaretAnimation: "on",
                                    mouseWheelZoom: true,
                                    formatOnPaste: true,
                                    formatOnType: true,
                                    suggestOnTriggerCharacters: true,
                                    quickSuggestions: true,
                                    overviewRulerBorder: false,
                                    hideCursorInOverviewRuler: true,
                                    backgroundColor: "#0E0E0E",
                                }
                            );

                            // Apply theme styling to container
                            updateEditorTheme(userConfig.editorTheme);
                            console.log(
                                "Monaco editor initialized successfully"
                            );
                        } else {
                            console.error("Monaco editor not available");
                            createFallbackEditor(editorDiv);
                        }
                    } catch (error) {
                        console.error("Error creating Monaco editor:", error);
                        createFallbackEditor(editorDiv);
                    }
                });
            } else {
                console.error("Require function not available");
                createFallbackEditor(editorDiv);
            }
        } catch (error) {
            console.error("Error loading Monaco editor:", error);
            createFallbackEditor(editorDiv);
        }

        // Fallback editor function
        function createFallbackEditor(container) {
            const textarea = document.createElement("textarea");
            textarea.style.cssText = `
                width: 100%;
                height: 100%;
                border: none;
                padding: 15px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                background: #1e1e1e;
                color: #d4d4d4;
                resize: none;
                outline: none;
                border-radius: 0 0 10px 10px;
            `;
            textarea.value = languageConfigs["GNU G++20 11.2.0"].template;
            container.innerHTML = "";
            container.appendChild(textarea);

            // Create a simple editor interface for fallback
            monacoEditor = {
                getValue: () => textarea.value,
                setValue: (value) => {
                    textarea.value = value;
                },
                updateOptions: () => {},
                getModel: () => ({ setLanguage: () => {} }),
            };
            console.log("Fallback editor created");
        }

        // Event listeners
        langSelect.addEventListener("change", async () => {
            const selectedLang = langSelect.value;
            const config = languageConfigs[selectedLang];
            if (monacoEditor && config) {
                const currentCode = monacoEditor.getValue();
                if (
                    currentCode.trim() === "" ||
                    currentCode ===
                        Object.values(languageConfigs).find(
                            (c) => c.template === currentCode
                        )?.template
                ) {
                    monacoEditor.setValue(config.template);
                } else {
                    const confirmed = await showConfirm(
                        "Change Language",
                        "Replace current code with template for the new language?"
                    );
                    if (confirmed) {
                        monacoEditor.setValue(config.template);
                    }
                }
                window.monaco.editor.setModelLanguage(
                    monacoEditor.getModel(),
                    config.monaco
                );
            }
        });

        submitBtn.addEventListener("click", () => {
            // Find and click the working "Submit with Preview" button
            const workingSubmitBtn = Array.from(
                document.querySelectorAll("button")
            ).find((btn) => btn.textContent.includes("Submit with Preview"));

            if (workingSubmitBtn) {
                console.log("Using Submit with Preview button");
                workingSubmitBtn.click();
            } else {
                console.log(
                    "Submit with Preview button not found, trying direct submission"
                );
                submitCode(langSelect.value);
            }
        });

        // Add responsive behavior for better sidebar compatibility
        function adjustEditorSize() {
            if (!editorContainer || !monacoEditor) return;

            try {
                const parentElement = editorContainer.parentElement;
                if (!parentElement) return;

                // Calculate available width, accounting for sidebar
                const sidebarWidth = 320; // Default Codeforces sidebar width
                const viewportWidth = window.innerWidth;
                const padding = 40; // Account for padding

                let availableWidth;
                if (viewportWidth < 1200) {
                    // Small screens - use full width with minimal padding
                    availableWidth = viewportWidth - padding;
                } else {
                    // Larger screens - account for sidebar
                    const hasVisibleSidebar =
                        document.querySelector(".sidebar-menu") &&
                        window.getComputedStyle(
                            document.querySelector(".sidebar-menu")
                        ).display !== "none";

                    if (hasVisibleSidebar) {
                        availableWidth = viewportWidth - sidebarWidth - padding;
                    } else {
                        availableWidth = Math.min(
                            viewportWidth - padding,
                            1200
                        ); // Max width for readability
                    }
                }

                // Ensure minimum width
                availableWidth = Math.max(availableWidth, 600);

                editorContainer.style.width = `${availableWidth}px`;
                editorContainer.style.maxWidth = "none";

                // Trigger Monaco layout update
                setTimeout(() => {
                    if (
                        monacoEditor &&
                        typeof monacoEditor.layout === "function"
                    ) {
                        monacoEditor.layout();
                    }
                }, 100);
            } catch (error) {
                console.error("Error adjusting editor size:", error);
            }
        }

        // Apply initial sizing and add resize listener
        adjustEditorSize();
        window.addEventListener("resize", adjustEditorSize);
        addCleanup(() =>
            window.removeEventListener("resize", adjustEditorSize)
        );

        // Find the div with id="body" and place editor after problem statement
        const bodyDiv = document.getElementById("body");
        if (bodyDiv) {
            // Try to find problem statement container
            const problemStatement =
                bodyDiv.querySelector(".problem-statement");
            if (problemStatement) {
                // Insert editor right after the problem statement
                problemStatement.parentNode.insertBefore(
                    editorContainer,
                    problemStatement.nextSibling
                );
                console.log("Editor placed after problem statement");
            } else {
                // If no problem statement found, append to body div
                bodyDiv.appendChild(editorContainer);
                console.log("Editor placed in body div");
            }
        } else {
            // Fallback to original placement if body div not found
            document.body.appendChild(editorContainer);
            console.log("Editor placed at end of document (fallback)");
        }
    }

    /* ---------- Submit Code ---------- */
    async function submitCode(language) {
        console.log("Starting submission process...");

        const { contestId, problemIndex, submissionUrl, isGym } =
            getProblemInfo();
        console.log("Problem info:", {
            contestId,
            problemIndex,
            submissionUrl,
            isGym,
        });

        if (!contestId || !problemIndex) {
            await showAlert(
                "Submission Error",
                "Could not determine contest/problem information for submission."
            );
            return;
        }

        const code = monacoEditor ? monacoEditor.getValue() : "";

        if (!code.trim()) {
            await showAlert(
                "No Code",
                "Please write some code before submitting!"
            );
            return;
        }

        const config = languageConfigs[language];
        if (!config) {
            await showAlert(
                "Language Error",
                "Unknown programming language selected."
            );
            return;
        }

        // Show confirmation
        const confirmed = await showConfirm(
            "Submit Solution",
            `Submit your ${language} solution for problem ${problemIndex}?\n\nContest: ${contestId}\nProblem: ${problemIndex}\nLanguage: ${language}`
        );

        if (!confirmed) return;

        try {
            // Try to find and use the existing Codeforces submission form
            const existingForm =
                document.querySelector(".submitForm") ||
                document.querySelector('form[action*="submit"]');

            if (existingForm) {
                console.log("Using existing Codeforces form");
                await useExistingForm(existingForm, code, config.cfId);
            } else {
                console.log("No existing form found, using custom submission");
                await customSubmission(
                    contestId,
                    problemIndex,
                    submissionUrl,
                    isGym,
                    code,
                    config.cfId
                );
            }
        } catch (error) {
            console.error("Submission error:", error);
            await showAlert(
                "Network Error",
                "Network error occurred. Please check your connection and try again."
            );
        }
    }

    // Use existing Codeforces form (more reliable)
    async function useExistingForm(form, code, languageId) {
        try {
            // Set the source code
            const sourceInput =
                form.querySelector('input[name="source"]') ||
                form.querySelector('textarea[name="source"]');
            if (sourceInput) {
                sourceInput.value = code;
            } else {
                throw new Error("Source input field not found");
            }

            // Set the language
            const langSelect = form.querySelector(
                'select[name="programTypeId"]'
            );
            if (langSelect) {
                langSelect.value = languageId;
            } else {
                throw new Error("Language selector not found");
            }

            // Submit the form directly
            console.log("Submitting via existing form...");
            form.submit();

            showSmallNotification("🚀 Solution submitted!", "success");
        } catch (error) {
            console.error("Form submission error:", error);
            throw error;
        }
    }

    // Custom submission as fallback
    async function customSubmission(
        contestId,
        problemIndex,
        submissionUrl,
        isGym,
        code,
        languageId
    ) {
        console.log("Using custom submission method");

        // Get CSRF token
        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            await showAlert(
                "Security Error",
                "Could not find CSRF token. Please refresh the page and try again."
            );
            return;
        }

        console.log("CSRF token found:", csrfToken.substring(0, 10) + "...");

        // Create form data with exact field names that Codeforces expects
        const formData = new FormData();

        // Add contest-specific fields
        formData.append("contestId", contestId);
        formData.append("submittedProblemIndex", problemIndex);
        formData.append("programTypeId", languageId);
        formData.append("source", code);
        formData.append("csrf_token", csrfToken);

        // Add additional fields that might be required
        if (isGym) {
            formData.append("action", "submitSolutionFormAjax");
        }

        // Debug: Log form data
        console.log("Form data being sent:");
        for (let [key, value] of formData.entries()) {
            console.log(
                `${key}:`,
                value.length > 50 ? value.substring(0, 50) + "..." : value
            );
        }

        // Submit using fetch
        const response = await fetch(submissionUrl, {
            method: "POST",
            body: formData,
            credentials: "same-origin",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        });

        console.log("Response status:", response.status);
        console.log(
            "Response headers:",
            Object.fromEntries(response.headers.entries())
        );

        if (response.ok) {
            const responseText = await response.text();
            console.log("Response preview:", responseText.substring(0, 200));

            // Check if response contains error indicators
            if (
                responseText.includes("Illegal contest") ||
                responseText.includes("error")
            ) {
                console.error(
                    "Server returned error in response:",
                    responseText
                );
                await showAlert(
                    "Submission Error",
                    "Server rejected the submission. Please try using the original Codeforces submission form."
                );
            } else {
                await showAlert(
                    "Success!",
                    "Solution submitted successfully! Check your submissions page for results."
                );
                // Optionally redirect to submissions
                setTimeout(() => {
                    if (isGym) {
                        window.open(
                            `https://codeforces.com/gym/${contestId}/my`,
                            "_blank"
                        );
                    } else {
                        window.open(
                            `https://codeforces.com/contest/${contestId}/my`,
                            "_blank"
                        );
                    }
                }, 1000);
            }
        } else {
            const errorText = await response.text();
            console.error("HTTP error response:", errorText);
            await showAlert(
                "Submission Failed",
                `HTTP ${response.status}: ${response.statusText}. Please try submitting manually.`
            );
        }
    }

    /* ---------- Helper functions for submission ---------- */
    function getCsrfToken() {
        console.log("Searching for CSRF token...");

        // Method 1: Look in submission forms
        const submitForms = document.querySelectorAll(
            'form[action*="submit"], .submitForm'
        );
        for (const form of submitForms) {
            const csrfInput = form.querySelector('input[name="csrf_token"]');
            if (csrfInput && csrfInput.value) {
                console.log("Found CSRF token in submission form");
                return csrfInput.value;
            }
        }

        // Method 2: Look in any form
        const allForms = document.querySelectorAll("form");
        for (const form of allForms) {
            const csrfInput = form.querySelector('input[name="csrf_token"]');
            if (csrfInput && csrfInput.value) {
                console.log("Found CSRF token in general form");
                return csrfInput.value;
            }
        }

        // Method 3: Look in meta tags
        const metaCsrf = document.querySelector('meta[name="csrf-token"]');
        if (metaCsrf) {
            const token = metaCsrf.getAttribute("content");
            if (token) {
                console.log("Found CSRF token in meta tag");
                return token;
            }
        }

        // Method 4: Look in script tags for window.csrf_token or similar
        const scripts = document.querySelectorAll("script");
        for (const script of scripts) {
            const content = script.textContent;
            if (content.includes("csrf_token")) {
                // Try different patterns
                const patterns = [
                    /csrf_token['"]?\s*:\s*['"]([^'"]+)['"]/,
                    /window\.csrf_token\s*=\s*['"]([^'"]+)['"]/,
                    /"csrf_token"\s*:\s*"([^"]+)"/,
                    /'csrf_token'\s*:\s*'([^']+)'/,
                ];

                for (const pattern of patterns) {
                    const match = content.match(pattern);
                    if (match && match[1]) {
                        console.log("Found CSRF token in script tag");
                        return match[1];
                    }
                }
            }
        }

        // Method 5: Look for hidden inputs anywhere on page
        const hiddenInputs = document.querySelectorAll(
            'input[type="hidden"][name="csrf_token"]'
        );
        for (const input of hiddenInputs) {
            if (input.value) {
                console.log("Found CSRF token in hidden input");
                return input.value;
            }
        }

        console.warn("CSRF token not found");
        return null;
    }

    /* ---------- Button actions ---------- */
    copyButton.addEventListener("click", async () => {
        const txt = extractProblemContent();
        if (!txt) return;

        try {
            await navigator.clipboard.writeText(txt);
            copyButton.textContent = "Copied!";
            copyButton.style.backgroundColor = styles.successColor;
            copyButton.style.color = "white";
            copyButton.style.borderColor = styles.successColor;
            setTimeout(() => {
                copyButton.textContent = "Copy Problem";
                copyButton.style.backgroundColor = "transparent";
                copyButton.style.color = styles.linkColor;
                copyButton.style.borderColor = styles.borderColor;
            }, 2000);
        } catch (error) {
            fallbackCopyTextToClipboard(txt);
        }
    });
    youtubeButton.addEventListener("click", () => {
        const title = document.querySelector(".title");
        if (!title) {
            showAlert("Error", "Could not find the problem title.");
            return;
        }
        const problemTitle = title.textContent.trim();
        const search = encodeURIComponent(
            (() => {
                const cleanTitle = problemTitle
                    .replace(/^[A-Z]\.\s*/, "")
                    .trim();

                const searches = [
                    `${problemTitle} codeforces`,
                    `${cleanTitle} codeforces problem`,
                    `${problemTitle} mohamed abdo`,
                    `${cleanTitle} competitive programming solution`,
                ];

                return searches.join(" OR ");
            })()
        );
        window.open(
            `https://www.youtube.com/results?search_query=${search}`,
            "_blank"
        );
    });
    excaliButton.addEventListener("click", () => {
        window.open("https://excalidraw.com/", "_blank");
    });

    cppshButton.addEventListener("click", () => {
        window.open("https://cpp.sh", "_blank");
    });

    settingsButton.addEventListener("click", () => {
        if (!settingsModal) {
            settingsModal = createSettingsModal();
        }
        settingsModal.style.display = "flex";
    });

    savedProblemsButton.addEventListener("click", () => {
        showSavedProblemsModal();
    });

    function openExplain(baseUrl, btn, successMsg) {
        const txt = extractProblemContent();
        if (!txt) return;
        const prompt = `
You are an expert competitive programming coach with decades of experience. Your goal is to explain this problem clearly and help the user understand how to approach it, without providing any actual code solution.

Please analyze this problem and provide:
1. A clear explanation of what the problem is asking in simple terms with examples
2. Identify the key constraints and requirements that will impact your solution approach
3. Break down the problem into smaller, more manageable parts with a step-by-step plan
4. Suggest 2–3 potential algorithmic approaches, explaining the trade-offs of each
5. Give time/space complexity of each approach
6. Point out tricky edge cases
7. Explain math concepts needed
8. Provide a helpful diagram/flowchart
9. Use simple language (A2–B1 level)
10. Include 1–2 hints (no full code)

Problem:
${txt}`;
        const url = `${baseUrl}${encodeURIComponent(prompt)}`;
        window.open(url, "_blank");
        btn.textContent = successMsg;
        setTimeout(() => (btn.textContent = btn.dataset.label), 2000);
    }

    explainButton.dataset.label = "Perplexity Explain";
    explainButton.addEventListener("click", () =>
        openExplain(
            "https://www.perplexity.ai/search?q=",
            explainButton,
            "Opened!"
        )
    );

    chatgptButton.dataset.label = "ChatGPT Explain";
    chatgptButton.addEventListener("click", () =>
        openExplain("https://chatgpt.com/?q=", chatgptButton, "Opened!")
    );

    /* ---------- Clipboard fallback ---------- */
    function fallbackCopyTextToClipboard(text) {
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
    }

    /* ---------- Sidebar creation ---------- */
    function createSidebar() {
        if (
            !isEnabled("sidebar") ||
            document.body.contains(document.getElementById("cf-action-buttons"))
        )
            return;

        const sidebar = document.createElement("div");
        sidebar.id = "cf-action-buttons";
        sidebar.className = "roundbox sidebox borderTopRound";

        const caption = document.createElement("div");
        caption.className = "caption titled";
        caption.innerHTML = "→ Codeforces++";
        sidebar.appendChild(caption);

        const list = document.createElement("ul");

        // Helper to wrap buttons in li
        const wrap = (btn) => {
            const li = document.createElement("li");
            applyButtonStyle(btn, false);
            btn.style.width = "85%";
            li.appendChild(btn);
            return li;
        };

        // Add buttons based on configuration
        if (isEnabled("copyProblem")) list.appendChild(wrap(copyButton));
        if (isEnabled("youtubeTutorials"))
            list.appendChild(wrap(youtubeButton));
        if (isEnabled("excalidraw")) list.appendChild(wrap(excaliButton));
        if (isEnabled("cppsh")) list.appendChild(wrap(cppshButton));

        // Add separator if any basic features are enabled
        if (
            isEnabled("copyProblem") ||
            isEnabled("youtubeTutorials") ||
            isEnabled("excalidraw") ||
            isEnabled("cppsh")
        ) {
            const hrLi = document.createElement("li");
            const hr = document.createElement("hr");
            hr.style.margin = "10px 0";
            hrLi.appendChild(hr);
            list.appendChild(hrLi);
        }

        if (isEnabled("perplexityExplain"))
            list.appendChild(wrap(explainButton));
        if (isEnabled("chatgptExplain")) list.appendChild(wrap(chatgptButton));

        // Add separator if any AI features are enabled
        if (isEnabled("perplexityExplain") || isEnabled("chatgptExplain")) {
            const hrLi2 = document.createElement("li");
            const hr2 = document.createElement("hr");
            hr2.style.margin = "10px 0";
            hrLi2.appendChild(hr2);
            list.appendChild(hrLi2);
        }

        // Always show settings button
        list.appendChild(wrap(settingsButton));

        // Add saved problems button if enabled
        if (isEnabled("problemsRecorder")) {
            list.appendChild(wrap(savedProblemsButton));
        }

        sidebar.appendChild(list);

        // Insert sidebar after the first existing sidebar element
        const firstSide = document.querySelector(".sidebar-menu");
        if (firstSide)
            firstSide.parentNode.insertBefore(sidebar, firstSide.nextSibling);
        else {
            const rightCol = document.querySelector(".right-column");
            if (rightCol) rightCol.insertBefore(sidebar, rightCol.firstChild);
        }
    }

    /* ---------- Navigation (prev/next) ---------- */
    function updateNav() {
        if (!isEnabled("navigationButtons")) return;

        const url = window.location.href;
        const match = url.match(/\/problem\/([A-Za-z0-9]+)$/);
        if (!match) return;
        const letter = match[1];

        if (letter.length === 1 && /[A-Za-z]/.test(letter)) {
            const base = url.replace(/\/[A-Za-z]$/, "/");
            const prev = String.fromCharCode(letter.charCodeAt(0) - 1);
            const next = String.fromCharCode(letter.charCodeAt(0) + 1);

            prevButton.href = base + prev;
            nextButton.href = base + next;

            prevButton.disabled = letter === "A" || letter === "a";
        }
        navContainer.innerHTML = "";
        navContainer.appendChild(prevButton);
        navContainer.appendChild(document.createTextNode(" | "));
        navContainer.appendChild(nextButton);
    }

    function placeNav() {
        if (!isEnabled("navigationButtons")) return;

        const title = document.querySelector(".title");
        if (title && !title.parentNode.contains(navContainer)) {
            title.parentNode.insertBefore(navContainer, title.nextSibling);
            updateNav();
        }
    }

    /* ---------- Debounced Init ---------- */
    let initTimeout = null;
    let initialized = false;

    function debouncedInit() {
        if (initialized) return;

        if (initTimeout) {
            clearTimeout(initTimeout);
        }

        initTimeout = setTimeout(() => {
            if (!initialized) {
                console.log("Running debounced initialization...");
                initialized = true;
                try {
                    // Initialize dark mode if enabled
                    if (userConfig.darkMode) {
                        applyDarkMode(true);
                    }

                    // Create dark mode toggle button
                    createDarkModeToggle();

                    createSidebar();
                    placeNav();
                    createCodeEditor();
                    enhanceSubmissionForm();
                    addFlagButtonToProblemPage();
                } catch (error) {
                    console.error("Init error:", error);
                }
            }
        }, 500);
    }

    /* ---------- Init ---------- */
    function init() {
        debouncedInit();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        // Wait a bit for the page to fully load before initializing
        setTimeout(init, 100);
    }

    // Use a throttled MutationObserver to prevent excessive calls
    let observerTimeout = null;
    const observerCallback = () => {
        if (observerTimeout) return;
        observerTimeout = setTimeout(() => {
            if (!initialized) init();
            observerTimeout = null;
        }, 1000);
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, {
        childList: true,
        subtree: false, // Reduce scope
        attributes: false, // Don't watch attributes
    });

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
        observer.disconnect();
        cleanup();
        console.log("Codeforces++ cleaned up");
    });

    /* ---------- DOM Cache ---------- */
    const domCache = new Map();

    function getCachedElement(selector) {
        if (!domCache.has(selector)) {
            domCache.set(selector, document.querySelector(selector));
        }
        return domCache.get(selector);
    }

    // Clear cache periodically to prevent memory buildup
    setInterval(() => {
        domCache.clear();
    }, 30000);

    /* ---------- Performance Optimizations ---------- */
    // Disable automatic layout for Monaco editor to reduce CPU usage
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => {
            if (monacoEditor && typeof monacoEditor.layout === "function") {
                requestAnimationFrame(() => monacoEditor.layout());
            }
        });

        if (editorContainer) {
            resizeObserver.observe(editorContainer);
        }
    }
})();
