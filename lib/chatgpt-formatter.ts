/**
 * Utility to automatically clean and transform raw text/markdown copied from ChatGPT
 * into semantic, beautifully formatted GitHub Flavored Markdown (GFM).
 *
 * Handles:
 * 1. Image citations (images.openai.com) + list items -> visual table with left thumbnail & right description.
 * 2. Standalone image links [caption](url) -> ![caption](url).
 * 3. Structured formula blocks -> callout cards (> blockquote).
 * 4. Interactive-style quizzes (Mini Exercise) -> task lists (- [x] / - [ ]).
 * 5. Prompt comparisons -> structured code quotes.
 * 6. Hierarchy headings -> #, ##, ###.
 */

export function cleanChatGptMarkdown(rawText: string): string {
  if (!rawText || !rawText.trim()) return rawText;

  let text = rawText;

  // 1. Lesson & Roadmap Headings
  text = text.replace(/^(Lesson\s+\d+\s*[-—]\s*[^\n]+)/gim, "# $1\n");
  text = text.replace(/^(Roadmap\s+belajar[^\n]*)/gim, "## 🗺️ $1\n");
  text = text.replace(/^(Level\s+\d+\s*[-—]\s*[^\n]+)/gim, "\n### $1");

  // 2. Main Numbered Sections (e.g. "1. Apa itu prompt?", "2. Memahami 7 elemen...")
  text = text.replace(
    /^(\d+)\.\s+(Apa itu prompt\?|Memahami 7 elemen[^\n]*|Formula dasar[^\n]*|Praktik pertama[^\n]*)/gim,
    "\n---\n\n## $1. $2\n"
  );

  // 3. Prompt Sederhana vs Terstruktur Comparisons
  text = text.replace(
    /Prompt sederhana\s*\n+["“]([^"”]+)["”]/gi,
    '### ❌ Prompt Sederhana\n```text\n"$1"\n```\n'
  );
  text = text.replace(
    /Prompt terstruktur\s*\n+["“]([^"”]+)["”]/gi,
    '### ✅ Prompt Terstruktur\n```text\n"$1"\n```\n'
  );
  text = text.replace(/^Apa perbedaannya\?/gim, "### 💡 Apa Perbedaannya?");

  // 4. Transform Image + Element List Items (ChatGPT Search Citations)
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

  // 5. Transform 7-Part Formula Box into a Callout Card
  const formulaRegex =
    /The 7-Part Prompt Formula\s*\n+Prompt\s*=\s*\n+Design Type\s*\n+Subject\s*\n+Style\s*\n+Color Palette\s*\n+Typography\s*\n+Composition\s*\n+Lighting & Quality\s*\n+Contoh hasil formula:\s*\n+["“]([^"”]+)["”]/gi;

  text = text.replace(formulaRegex, (_m, example) => {
    return `> ### 📐 The 7-Part Prompt Formula\n>\n> **Prompt =**\n> 1. Design Type\n> 2. Subject\n> 3. Style\n> 4. Color Palette\n> 5. Typography\n> 6. Composition\n> 7. Lighting & Quality\n>\n> ---\n>\n> **Contoh hasil formula:**  \n> *"${example}"*\n`;
  });

  // 6. Brief bullet points in Section 1
  text = text.replace(
    /Apa yang harus dibuat\?\n+Untuk siapa desain tersebut\?\n+Bagaimana tampilannya\?\n+Apa warna yang digunakan\?\n+Bagaimana komposisinya\?\n+Apa pesan yang ingin disampaikan\?/gi,
    `- Apa yang harus dibuat?\n- Untuk siapa desain tersebut?\n- Bagaimana tampilannya?\n- Apa warna yang digunakan?\n- Bagaimana komposisinya?\n- Apa pesan yang ingin disampaikan?`
  );

  // 7. Transform Mini Exercise / Quiz into an interactive-style task list (ONLY inside exercise block)
  const exerciseIdx = text.search(/Mini Exercise/i);
  if (exerciseIdx !== -1) {
    const beforeExercise = text.substring(0, exerciseIdx);
    let exerciseBlock = text.substring(exerciseIdx);

    exerciseBlock = exerciseBlock.replace(
      /Mini Exercise\s*(\d+)\s*\n+(\d+)\s*pertanyaan/gi,
      "### 📝 Mini Exercise $1 `$2 Pertanyaan`\n"
    );

    // Questions with 4 options: 1. Pertanyaan? \n Opt1 \n Opt2 \n Opt3 \n Opt4
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

  // 8. Callout for target pembelajaran
  text = text.replace(
    /Target pembelajaran hari ini:\s*([^\n]+)/gi,
    `\n---\n\n> [!TIP]\n> **🎯 Target Pembelajaran Hari Ini:**  \n> $1\n`
  );

  // 9. Any remaining standalone [Caption](https://images.openai.com/...) without "!"
  // Convert them to image tags ![Caption](url)
  text = text.replace(
    /(^|[^!])\[([^\]]+)\]\((https:\/\/images\.openai\.com[^\)]+)\)/gi,
    "$1![$2]($3)"
  );

  return text.trim();
}
