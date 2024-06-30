import React from "react";
import styles from "./Footer.module.css";
import github from "../assets/images/githubIcon.svg";

const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.info}>
        Made by{" "}
        <a
          href="https://www.linkedin.com/in/akshay-bansal-917a0a197/"
          target="_blank"
          rel="noreferrer"
        >
          Akshay Bansal
        </a>
      </div>
      <a
        href="https://github.com/PalSteyn/syntax-highlighter"
        target="_blank"
        rel="noreferrer"
        className={styles.gitHubLink}
      >
        <img src={github} alt="github-icon" />
      </a>
    </div>
  );
};

export default Footer;
