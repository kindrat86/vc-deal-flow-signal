import React from "react";

const URL_REGEX =
  /(https?:\/\/[^\s<>"]+|\b(?:signals\.gitdealflow\.com|gitdealflow\.com|ssrn\.com|linkedin\.com|github\.com|zenodo\.org|kaggle\.com|data\.world|doi\.org)\/[^\s<>"]+)/gi;

const TRAILING_PUNCT = /^(.*?)([.,;:!?)\]]+)$/;

export function linkify(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    if (match.index === undefined) continue;

    let url = match[0];
    let trailing = "";
    const punctMatch = TRAILING_PUNCT.exec(url);
    if (punctMatch) {
      url = punctMatch[1];
      trailing = punctMatch[2];
    }

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const href = url.startsWith("http") ? url : `https://${url}`;
    const isInternal =
      href.startsWith("https://signals.gitdealflow.com") ||
      href.startsWith("https://gitdealflow.com");

    parts.push(
      <a
        key={key++}
        href={href}
        className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
        {...(isInternal ? {} : { target: "_blank", rel: "noopener" })}
      >
        {url}
      </a>,
    );

    if (trailing) parts.push(trailing);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
