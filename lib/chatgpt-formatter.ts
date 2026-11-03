/**
 * Utility to automatically clean and transform raw text/markdown copied from ChatGPT
 * into semantic, beautifully formatted GitHub Flavored Markdown (GFM).
 *
 * Handles:
 * 1. Metadata badges detection (Fase/Phase, Level, Hybrid Learning) -> ```badges.
 * 2. Consecutive images grouping -> ```gallery (Bento Gallery Grid).
 * 3. Image citations (images.openai.com) + list items -> visual table with left thumbnail & right description.
 * 4. Standalone image links [caption](url) -> ![caption](url).
 * 5. Structured formula blocks -> callout cards (> blockquote).
 * 6. Interactive-style quizzes (Mini Exercise) -> task lists (- [x] / - [ ]).
 * 7. Prompt comparisons -> structured code quotes.
 * 8. Hierarchy headings -> #, ##, ###.
 */

export function cleanChatGptMarkdown(rawText: string): string {
  if (!rawText || !rawText.trim()) return rawText;

  let text = rawText;

  // 1. Lesson & Roadmap Headings
  text = text.replace(/^(Lesson\s+\d+\s*[-—]\s*[^\n]+)/gim, "# $1\n");
  text = text.replace(/^(Roadmap\s+belajar[^\n]*)/gim, "## 🗺️ $1\n");
  text = text.replace(/^(Level\s+\d+\s*[-—]\s*[^\n]+)/gim, "\n### $1");

  // 2. Extract Pill Badges directly beneath H1 (e.g. "Fase 2 — Commercial Design", "Intermediate to Advanced")
  // Matches lines right below "# Lesson ..." containing metadata keywords
  const headingWithBadgesRegex =
    /(#\s+Lesson\s+\d+\s*[-—]\s*[^\n]+)\n+((?:(?:\*?[Ff]ase\s+\d+[^\n]*|\*?[Pp]hase\s+\d+[^\n]*|\*?Level:[^\n]*|\*?Intermediate[^\n]*|\*?Advanced[^\n]*|\*?Beginner[^\n]*|\*?Hybrid\s+Learning[^\n]*)\n?)+)/gi;

  text = text.replace(headingWithBadgesRegex, (_match, heading, rawBadgesBlock) => {
    // Split lines and multiple spaces into individual badge items
    const rawItems = rawBadgesBlock
      .replace(/\*/g, "") // remove bold/italic asterisks
      .split(/\n+|\s{2,}|(?<=[a-z])\s+(?=(?:Fase|Phase|Level|Intermediate|Advanced|Hybrid))/i)
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 2);

    // Deduplicate
    const uniqueBadges = Array.from(new Set(rawItems));

    if (uniqueBadges.length > 0) {
      return `${heading}\n\n\`\`\`badges\n${uniqueBadges.join(" | ")}\n\`\`\`\n\n`;
    }
    return `${heading}\n\n`;
  });

  // 3. Main Numbered Sections (e.g. "1. Apa itu prompt?", "2. Memahami...")
  text = text.replace(
    /^(\d+)\.\s+(Apa itu prompt\?|Memahami[^\n]*|Formula dasar[^\n]*|Praktik[^\n]*|Studi kasus[^\n]*)/gim,
    "\n---\n\n## $1. $2\n"
  );

  // 4. Prompt Sederhana vs Terstruktur Comparisons
  text = text.replace(
    /Prompt sederhana\s*\n+["“]([^"”]+)["”]/gi,
    '### ❌ Prompt Sederhana\n```text\n"$1"\n```\n'
  );
  text = text.replace(
    /Prompt terstruktur\s*\n+["“]([^"”]+)["”]/gi,
    '### ✅ Prompt Terstruktur\n```text\n"$1"\n```\n'
  );
  text = text.replace(/^Apa perbedaannya\?/gim, "### 💡 Apa Perbedaannya?");

  // 5. Transform Image + Element List Items (ChatGPT Search Citations)
  // Pattern: [Title](https://images.openai.com/...) followed by: 1. Subject (Subjek) \n Desc \n Contoh: ...
  const imgElemRegex =
    /\[([^\]]+)\]\((https:\/\/images\.openai\.com[^\)]+)\)\s*(?:###?\s*)?(\d+)\.\s*([^\n]+)\n+([^\n]+)(?:\n+(Contoh:[^\n]+))?/gi;

  text = text.replace(
    imgElemRegex,
    (_match, title, imgUrl, num, name, desc, contoh) => {
      const cleanTitle = title.trim().replace(/\|/g, "-");
      const cleanName = name.trim().replace(/\|/g, "-");
      const cleanDesc = desc.trim().replace(/\|/g, "-");
      const cleanContoh = contoh ? contoh.trim().replace(/\|/g, "-") : "";

      let detail = `**${num}. ${cleanName}**<br>${cleanDesc}`;
      if (cleanContoh) {
        detail += `<br>*${cleanContoh}*`;
      }

      return `| ![${cleanTitle}](${imgUrl}) | ${detail} |`;
    }
  );

  // If table rows were created, wrap them in a Markdown table header
  const tableRowsRegex = /((?:\| !\[[^\n]+\|\n?)+)/g;
  text = text.replace(tableRowsRegex, (tableBlock) => {
    return `\n| Visual | Elemen & Penjelasan |\n| :---: | :--- |\n${tableBlock}\n`;
  });

  // 6. Convert any remaining standalone [Caption](https://images.openai.com/...) without "!" to ![Caption](url)
  text = text.replace(
    /(^|[^!])\[([^\]]+)\]\((https:\/\/images\.openai\.com[^\)]+)\)/gi,
    "$1![$2]($3)"
  );

  // 7. Group Consecutive Standalone Images into a Bento Gallery (```gallery)
  // Look for 2 or more image lines not inside a table or existing code block
  const lines = text.split("\n");
  const processedLines: string[] = [];
  let imageBatch: string[] = [];

  const flushImageBatch = () => {
    if (imageBatch.length >= 2) {
      // Group as Bento Gallery!
      processedLines.push("```gallery");
      processedLines.push(...imageBatch);
      processedLines.push("```");
    } else if (imageBatch.length === 1) {
      // Keep single image as is
      processedLines.push(imageBatch[0]);
    }
    imageBatch = [];
  };

  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushImageBatch();
      inCodeBlock = !inCodeBlock;
      processedLines.push(line);
      continue;
    }

    if (inCodeBlock) {
      processedLines.push(line);
      continue;
    }

    // Check if line is a standalone markdown image (and NOT part of a table row "|")
    const isImageLine =
      !trimmed.startsWith("|") &&
      /^!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)$/.test(trimmed);

    // Also support source attribution lines right below an image, e.g. "*[Sumber: ...]*" or "[source.com](...)"
    const isSourceLine =
      imageBatch.length > 0 &&
      (/^(\*?\[[^\]]+\]\(https?:\/\/[^\)]+\)\*?)$/.test(trimmed) ||
        /^\*\[Sumber[^\n]*\)\*$/.test(trimmed));

    if (isImageLine) {
      imageBatch.push(trimmed);
    } else if (isSourceLine) {
      // Ignore separate attribution line when grouping, or associate with previous image
      continue;
    } else if (trimmed === "") {
      // Keep gathering if blank line between images, but if next line isn't image, flush
      const nextLine = lines[i + 1]?.trim() || "";
      const nextIsImage =
        !nextLine.startsWith("|") &&
        /^!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)$/.test(nextLine);

      if (!nextIsImage) {
        flushImageBatch();
        processedLines.push(line);
      }
    } else {
      flushImageBatch();
      processedLines.push(line);
    }
  }

  flushImageBatch();
  text = processedLines.join("\n");

  // 8. Transform 7-Part Formula Box into a Callout Card
  const formulaRegex =
    /The 7-Part Prompt Formula\s*\n+Prompt\s*=\s*\n+Design Type\s*\n+Subject\s*\n+Style\s*\n+Color Palette\s*\n+Typography\s*\n+Composition\s*\n+Lighting & Quality\s*\n+Contoh hasil formula:\s*\n+["“]([^"”]+)["”]/gi;

  text = text.replace(formulaRegex, (_m, example) => {
    return `> ### 📐 The 7-Part Prompt Formula\n>\n> **Prompt =**\n> 1. Design Type\n> 2. Subject\n> 3. Style\n> 4. Color Palette\n> 5. Typography\n> 6. Composition\n> 7. Lighting & Quality\n>\n> ---\n>\n> **Contoh hasil formula:**  \n> *"${example}"*\n`;
  });

  // 9. Transform Mini Exercise / Quiz into an interactive-style task list (ONLY inside exercise block)
  const exerciseIdx = text.search(/Mini Exercise/i);
  if (exerciseIdx !== -1) {
    const beforeExercise = text.substring(0, exerciseIdx);
    let exerciseBlock = text.substring(exerciseIdx);

    exerciseBlock = exerciseBlock.replace(
      /Mini Exercise\s*(\d+)\s*\n+(\d+)\s*pertanyaan/gi,
      "### 📝 Mini Exercise $1 `$2 Pertanyaan`\n"
    );

    const quizRegex =
      /(\d+)\.\s+([^\n\?]+\?)\n+([^\n]{1,80})\n+([^\n]{1,80})\n+([^\n]{1,80})\n+([^\n]{1,80})/g;

    exerciseBlock = exerciseBlock.replace(
      quizRegex,
      (_m, qNum, qText, opt1, opt2, opt3, opt4) => {
        return `\n**${qNum}. ${qText.trim()}**\n- [x] ${opt1.trim()}\n- [ ] ${opt2.trim()}\n- [ ] ${opt3.trim()}\n- [ ] ${opt4.trim()}\n`;
      }
    );

    text = beforeExercise + exerciseBlock;
  }

  // 10. Callout for target pembelajaran
  text = text.replace(
    /Target pembelajaran hari ini:\s*([^\n]+)/gi,
    `\n---\n\n> [!TIP]\n> **🎯 Target Pembelajaran Hari Ini:**  \n> $1\n`
  );

  return text.trim();
}
