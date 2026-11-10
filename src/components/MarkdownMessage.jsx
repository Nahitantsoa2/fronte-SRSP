import { useMemo } from "react";

/**
 * Rendu Markdown léger et sûr (sans dangerouslySetInnerHTML).
 * Gère : titres, paragraphes, listes, checklists, tableaux, citations,
 * séparateurs, gras, italique, code inline et liens.
 */

function renderInline(text, prefix = "i") {
  const regex =
    /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const elements = [];
  let lastIndex = 0;
  let match;
  let index = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${prefix}-${index++}`;

    if (token.startsWith("**") || token.startsWith("__")) {
      elements.push(
        <strong key={key} className="md-strong">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      elements.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("_")) {
      elements.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("`")) {
      elements.push(
        <code key={key} className="md-code">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        elements.push(
          <a
            key={key}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="md-link"
          >
            {link[1]}
          </a>
        );
      } else {
        elements.push(token);
      }
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}

function splitTableRow(line) {
  let value = line.trim();
  if (value.startsWith("|")) value = value.slice(1);
  if (value.endsWith("|")) value = value.slice(0, -1);
  return value.split("|").map((cell) => cell.trim());
}

function isTableSeparator(line) {
  return (
    line.includes("|") &&
    line.includes("-") &&
    /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(line)
  );
}

const BLOCK_START =
  /^(#{1,4})\s+|^>\s?|^(-{3,}|\*{3,}|_{3,})$|^\s*([-*•]|\d+[.)])\s+/;

function parseBlocks(source) {
  const lines = String(source ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length,
        text: heading[2].trim(),
      });
      i += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "quote", text: quote.join("\n") });
      continue;
    }

    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      const header = splitTableRow(line);
      const aligns = splitTableRow(lines[i + 1]).map((cell) => {
        const value = cell.trim();
        if (value.startsWith(":") && value.endsWith(":")) return "center";
        if (value.endsWith(":")) return "right";
        return "left";
      });
      i += 2;
      const rows = [];
      while (
        i < lines.length &&
        lines[i].includes("|") &&
        lines[i].trim() !== ""
      ) {
        rows.push(splitTableRow(lines[i]));
        i += 1;
      }
      blocks.push({ type: "table", header, aligns, rows });
      continue;
    }

    const listMatch = line.match(/^\s*([-*•]|\d+[.)])\s+(.*)$/);
    if (listMatch) {
      const ordered = /^\d/.test(listMatch[1]);
      const items = [];

      while (i < lines.length) {
        const current = lines[i];
        const item = current.match(/^\s*([-*•]|\d+[.)])\s+(.*)$/);
        if (!item) break;

        const itemOrdered = /^\d/.test(item[1]);
        if (itemOrdered !== ordered) break;

        let text = item[2];
        let checked = null;
        const checklist = text.match(/^\[([ xX])\]\s+(.*)$/);
        if (checklist) {
          checked = checklist[1].toLowerCase() === "x";
          text = checklist[2];
        }

        items.push({ text, checked });
        i += 1;
      }

      blocks.push({ type: ordered ? "ol" : "ul", items });
      continue;
    }

    const paragraph = [line.trim()];
    i += 1;

    while (i < lines.length) {
      const next = lines[i];
      if (!next.trim()) break;
      if (BLOCK_START.test(next)) break;
      if (
        next.includes("|") &&
        i + 1 < lines.length &&
        isTableSeparator(lines[i + 1])
      ) {
        break;
      }
      paragraph.push(next.trim());
      i += 1;
    }

    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function renderBlock(block, index) {
  const key = `b-${index}`;

  switch (block.type) {
    case "heading": {
      const Tag = `h${Math.min(block.level + 1, 5)}`;
      return (
        <Tag key={key} className={`md-heading md-heading--${block.level}`}>
          {renderInline(block.text, key)}
        </Tag>
      );
    }

    case "hr":
      return <hr key={key} className="md-hr" />;

    case "quote":
      return (
        <blockquote key={key} className="md-quote">
          {renderInline(block.text, key)}
        </blockquote>
      );

    case "table":
      return (
        <div key={key} className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>
                {block.header.map((cell, cellIndex) => (
                  <th
                    key={`${key}-h-${cellIndex}`}
                    style={{ textAlign: block.aligns[cellIndex] || "left" }}
                  >
                    {renderInline(cell, `${key}-h-${cellIndex}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`${key}-r-${rowIndex}`}>
                  {block.header.map((_, cellIndex) => (
                    <td
                      key={`${key}-c-${rowIndex}-${cellIndex}`}
                      style={{ textAlign: block.aligns[cellIndex] || "left" }}
                    >
                      {renderInline(
                        row[cellIndex] ?? "",
                        `${key}-c-${rowIndex}-${cellIndex}`
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "ul":
      return (
        <ul key={key} className="md-list">
          {block.items.map((item, itemIndex) =>
            item.checked === null ? (
              <li key={`${key}-${itemIndex}`} className="md-list__item">
                {renderInline(item.text, `${key}-${itemIndex}`)}
              </li>
            ) : (
              <li
                key={`${key}-${itemIndex}`}
                className={`md-check ${item.checked ? "md-check--done" : ""}`}
              >
                <span className="md-check__box" aria-hidden="true">
                  {item.checked ? "✓" : ""}
                </span>
                <span>{renderInline(item.text, `${key}-${itemIndex}`)}</span>
              </li>
            )
          )}
        </ul>
      );

    case "ol":
      return (
        <ol key={key} className="md-list md-list--ordered">
          {block.items.map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`} className="md-list__item">
              {renderInline(item.text, `${key}-${itemIndex}`)}
            </li>
          ))}
        </ol>
      );

    default:
      return (
        <p key={key} className="md-paragraph">
          {renderInline(block.text, key)}
        </p>
      );
  }
}

export default function MarkdownMessage({ content = "", className = "" }) {
  const blocks = useMemo(() => parseBlocks(content), [content]);

  return (
    <div className={`md-content ${className}`.trim()}>
      {blocks.map(renderBlock)}
    </div>
  );
}
