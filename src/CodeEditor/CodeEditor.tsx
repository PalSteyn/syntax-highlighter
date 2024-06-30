import React, { useState, useRef, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";
import styles from "./CodeEditor.module.css";

interface LanguageOptionsInterface {
  id: number;
  language: string;
}

interface ThemeOptionsInterface {
  id: number;
  theme: keyof typeof themes;
}

const languageOptions: LanguageOptionsInterface[] = [
  { id: 0, language: "jsx" },
  { id: 1, language: "tsx" },
  { id: 2, language: "css" },
  { id: 3, language: "html" },
  { id: 4, language: "javascript" },
  { id: 5, language: "json" },
];

const themeOptions: ThemeOptionsInterface[] = [
  { id: 0, theme: "vsDark" },
  { id: 1, theme: "duotoneDark" },
  { id: 2, theme: "duotoneLight" },
  { id: 3, theme: "nightOwl" },
  { id: 4, theme: "oceanicNext" },
  { id: 5, theme: "okaidia" },
];

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>(languageOptions[0].language);
  const [theme, setTheme] = useState<keyof typeof themes>(
    themeOptions[0].theme
  );
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const highlightRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.focus(); // Set focus to the textarea on mount
    }
  }, []);

  useEffect(() => {
    const textArea = textAreaRef.current;
    const highlight = highlightRef.current;

    if (textArea && highlight) {
      const handleScroll = () => {
        if (highlight && textArea) {
          highlight.scrollTop = textArea.scrollTop;
          highlight.scrollLeft = textArea.scrollLeft;
        }
      };

      textArea.addEventListener("scroll", handleScroll);

      return () => {
        textArea.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart, selectionEnd } = e.currentTarget;
    const tabCharacter = "    ";

    if (e.key === "Tab") {
      e.preventDefault();

      const newCode =
        code.substring(0, selectionStart) +
        tabCharacter +
        code.substring(selectionEnd);

      setCode(newCode);

      setTimeout(() => {
        const textArea = textAreaRef.current;
        if (textArea) {
          textArea.selectionStart = textArea.selectionEnd =
            selectionStart + tabCharacter.length;
        }
      }, 0);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const lines = code.split("\n");
      const lineNumber =
        code.substring(0, selectionStart).split("\n").length - 1;
      const currentLine = lines[lineNumber];
      const indent = currentLine.match(/^\s*/)?.[0] ?? "";
      const newCode =
        code.substring(0, selectionStart) +
        "\n" +
        indent +
        code.substring(selectionEnd);

      setCode(newCode);

      setTimeout(() => {
        const textArea = textAreaRef.current;
        if (textArea) {
          textArea.selectionStart = textArea.selectionEnd =
            selectionStart + indent.length + 1;
        }
      }, 0);
    }

    if (e.key === "Backspace") {
      const hasSelection = selectionStart !== selectionEnd;
      const textBeforeCaret = code.substring(0, selectionStart);

      if (textBeforeCaret.endsWith(tabCharacter) && !hasSelection) {
        e.preventDefault();

        const updatedSelection = selectionStart - tabCharacter.length;
        const newCode =
          code.substring(0, selectionStart - tabCharacter.length) +
          code.substring(selectionEnd);

        setCode(newCode);

        setTimeout(() => {
          const textArea = textAreaRef.current;
          if (textArea) {
            textArea.selectionStart = textArea.selectionEnd = updatedSelection;
          }
        }, 0);
      }
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as keyof typeof themes);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.dropdownContainer}>
        <div>
          <label>Select language:</label>
          <select onChange={handleLanguageChange} value={language}>
            {languageOptions.map((option) => (
              <option key={option.id} value={option.language}>
                <span>{option.language}</span>
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select theme:</label>
          <select onChange={handleThemeChange} value={theme}>
            {themeOptions.map((option) => (
              <option key={option.id} value={option.theme}>
                {option.theme}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.editorContainer}>
        <Highlight code={code} language={language} theme={themes[theme]}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              ref={highlightRef}
              className={`${styles.highlightedCode} ${className}`}
              style={style}
            >
              {tokens.map((line, i) => (
                <div
                  style={{ margin: "0px", padding: "0px" }}
                  key={i}
                  {...getLineProps({ line })}
                >
                  {line.map((token, key) => (
                    <span
                      style={{ margin: "0px", padding: "0px" }}
                      key={key}
                      {...getTokenProps({ token })}
                    />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
        <textarea
          ref={textAreaRef}
          className={styles.textarea}
          style={{ caretColor: theme === "duotoneLight" ? "black" : "white" }}
          placeholder="Write your code here"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
