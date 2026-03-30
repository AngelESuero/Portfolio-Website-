'use client';

import React, { useEffect, useRef, useState } from "react";

type PublishedEntry = {
  title: string;
  href: string;
  date: string;
  summary: string;
  voice: string;
  tags: string[];
};

type RecentNote = {
  id: string;
  title: string;
  fileName: string;
  savedAt: string;
  excerpt: string;
  tags: string[];
  body: string;
  mode: "folder" | "download";
};

type DraftState = {
  title: string;
  tags: string;
  body: string;
};

declare global {
  interface Window {
    showDirectoryPicker?: (options?: {
      id?: string;
      mode?: "read" | "readwrite";
      startIn?: "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos";
    }) => Promise<FileSystemDirectoryHandle>;
  }
}

const DRAFT_KEY = "aes-writing-workbench-draft-v1";
const RECENT_KEY = "aes-writing-workbench-recent-v1";

const emptyDraft: DraftState = {
  title: "",
  tags: "",
  body: ""
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

function inferTitle(title: string, body: string) {
  const trimmedTitle = title.trim();
  if (trimmedTitle) return trimmedTitle;

  const firstLine = body
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstLine) return "Untitled note";
  return firstLine.slice(0, 72);
}

function excerptFromBody(body: string) {
  const normalized = body.replace(/\s+/g, " ").trim();
  if (!normalized) return "Fresh note from the writing desk.";
  return normalized.length > 180 ? `${normalized.slice(0, 177)}...` : normalized;
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function timeStampForFile(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join("-") + `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function formatSavedLabel(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function makeMarkdown(title: string, body: string, tags: string[], createdAt: string) {
  const summary = excerptFromBody(body);
  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `date: ${JSON.stringify(createdAt)}`,
    "featured: false",
    "ready: false",
    "tags:",
    ...(tags.length ? tags.map((tag) => `  - ${JSON.stringify(tag)}`) : ['  - "draft"']),
    `summary: ${JSON.stringify(summary)}`,
    "---",
    ""
  ].join("\n");

  return `${frontmatter}\n${body.trim() || title}\n`;
}

function downloadMarkdown(fileName: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function WritingWorkbench({
  published,
  totalPublished
}: {
  published: PublishedEntry[];
  totalPublished: number;
}) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const [folderName, setFolderName] = useState("");
  const [status, setStatus] = useState("Draft lives in the browser until you save it out.");
  const [isSaving, setIsSaving] = useState(false);
  const [supportsFolderWrite, setSupportsFolderWrite] = useState(false);
  const directoryHandleRef = useRef<FileSystemDirectoryHandle | null>(null);

  useEffect(() => {
    setSupportsFolderWrite(typeof window.showDirectoryPicker === "function");

    try {
      const savedDraft = window.localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as DraftState;
        setTitle(parsed.title || "");
        setTags(parsed.tags || "");
        setBody(parsed.body || "");
      }

      const savedRecent = window.localStorage.getItem(RECENT_KEY);
      if (savedRecent) {
        const parsed = JSON.parse(savedRecent) as RecentNote[];
        setRecentNotes(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      setStatus("Draft memory is unavailable in this browser session.");
    }
  }, []);

  useEffect(() => {
    try {
      const nextDraft: DraftState = { title, tags, body };
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
    } catch {
      // Ignore quota or privacy mode failures and keep the editor usable.
    }
  }, [title, tags, body]);

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const lineCount = body ? body.split("\n").length : 0;
  const canSave = title.trim().length > 0 || body.trim().length > 0;

  async function connectFolder() {
    if (!supportsFolderWrite || !window.showDirectoryPicker) {
      setStatus("Direct folder writing is not available here. Save will download a markdown file instead.");
      return;
    }

    try {
      const handle = await window.showDirectoryPicker({
        id: "aes-writing-desk",
        mode: "readwrite",
        startIn: "documents"
      });
      directoryHandleRef.current = handle;
      setFolderName(handle.name);
      setStatus(`Saving will now write notes into ${handle.name}.`);
    } catch {
      setStatus("Folder connection stayed unchanged.");
    }
  }

  async function saveNote() {
    if (!canSave || isSaving) return;

    setIsSaving(true);

    const createdAt = new Date();
    const nextTitle = inferTitle(title, body);
    const nextTags = splitTags(tags);
    const fileName = `${timeStampForFile(createdAt)}-${slugify(nextTitle) || "untitled-note"}.md`;
    const markdown = makeMarkdown(nextTitle, body, nextTags, createdAt.toISOString());
    let mode: "folder" | "download" = "download";

    try {
      if (directoryHandleRef.current) {
        const fileHandle = await directoryHandleRef.current.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(markdown);
        await writable.close();
        mode = "folder";
      } else {
        downloadMarkdown(fileName, markdown);
      }

      const nextRecent: RecentNote[] = [
        {
          id: `${createdAt.toISOString()}-${fileName}`,
          title: nextTitle,
          fileName,
          savedAt: createdAt.toISOString(),
          excerpt: excerptFromBody(body),
          tags: nextTags,
          body: body.trim(),
          mode
        },
        ...recentNotes
      ].slice(0, 8);

      setRecentNotes(nextRecent);
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));
      window.localStorage.removeItem(DRAFT_KEY);
      setTitle("");
      setTags("");
      setBody("");
      setStatus(
        mode === "folder"
          ? `${fileName} landed in ${folderName || "your chosen folder"}.`
          : `${fileName} downloaded to your computer.`
      );
    } catch {
      setStatus("The note did not save. Try reconnecting the folder or download it instead.");
    } finally {
      setIsSaving(false);
    }
  }

  function loadRecent(note: RecentNote) {
    setTitle(note.title);
    setTags(note.tags.join(", "));
    setBody(note.body);
    setStatus(`Loaded ${note.title} back into the desk.`);
  }

  function clearDraft() {
    setTitle("");
    setTags("");
    setBody("");
    window.localStorage.removeItem(DRAFT_KEY);
    setStatus("Draft cleared.");
  }

  return (
    <section
      className="overflow-hidden rounded-[1.6rem] border"
      style={{
        borderColor: "var(--tone-line)",
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--tone-surface-strong) 78%, transparent), color-mix(in srgb, var(--tone-surface) 90%, transparent))",
        boxShadow: "0 22px 56px rgba(0,0,0,0.12)"
      }}
    >
      <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)_18rem]">
        <aside
          className="border-b px-4 py-4 sm:px-5 lg:border-b-0 lg:border-r"
          style={{ borderColor: "var(--tone-line)" }}
        >
          <div className="mb-4">
            <p
              className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--tone-accent-glow)" }}
            >
              Writing Desk
            </p>
            <h2
              className="mt-2 text-[1.2rem] font-medium tracking-[-0.03em]"
              style={{ color: "var(--tone-text)" }}
            >
              Local notes
            </h2>
            <p className="mt-2 text-[0.86rem] leading-6" style={{ color: "var(--tone-muted)" }}>
              Save a note straight to your computer, then come back for the next one.
            </p>
          </div>

          <div className="space-y-2">
            {recentNotes.length === 0 ? (
              <div
                className="rounded-[1rem] px-3 py-3 text-[0.84rem] leading-6"
                style={{
                  background: "color-mix(in srgb, var(--tone-surface) 82%, transparent)",
                  color: "var(--tone-muted)"
                }}
              >
                No local saves yet. The first note you submit will start the stack.
              </div>
            ) : (
              recentNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => loadRecent(note)}
                  className="block w-full rounded-[1rem] border px-3 py-3 text-left transition-colors"
                  style={{
                    borderColor: "var(--tone-line)",
                    background: "color-mix(in srgb, var(--tone-surface) 76%, transparent)"
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div
                        className="truncate text-[0.92rem] font-medium"
                        style={{ color: "var(--tone-text)" }}
                      >
                        {note.title}
                      </div>
                      <div className="mt-1 text-[0.72rem] uppercase tracking-[0.12em]" style={{ color: "var(--tone-muted)" }}>
                        {formatSavedLabel(note.savedAt)}
                      </div>
                    </div>
                    <span
                      className="rounded-full px-2 py-1 text-[0.62rem] uppercase tracking-[0.12em]"
                      style={{
                        background: "color-mix(in srgb, var(--tone-accent) 10%, transparent)",
                        color: "var(--tone-accent-glow)"
                      }}
                    >
                      {note.mode}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.8rem] leading-5" style={{ color: "var(--tone-muted)" }}>
                    {note.excerpt}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="border-b px-4 py-4 sm:px-6 lg:border-b-0" style={{ borderColor: "var(--tone-line)" }}>
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_15rem]">
              <label className="grid gap-2">
                <span className="text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: "var(--tone-muted)" }}>
                  Title
                </span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Start with a title or let the first line become one."
                  className="w-full rounded-[0.95rem] border px-4 py-3 text-[1rem] outline-none"
                  style={{
                    borderColor: "var(--tone-line)",
                    background: "color-mix(in srgb, var(--tone-surface) 84%, transparent)",
                    color: "var(--tone-text)"
                  }}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: "var(--tone-muted)" }}>
                  Tags
                </span>
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="newark, ai, notes"
                  className="w-full rounded-[0.95rem] border px-4 py-3 text-[0.95rem] outline-none"
                  style={{
                    borderColor: "var(--tone-line)",
                    background: "color-mix(in srgb, var(--tone-surface) 84%, transparent)",
                    color: "var(--tone-text)"
                  }}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[0.72rem] uppercase tracking-[0.16em]" style={{ color: "var(--tone-muted)" }}>
                Note
              </span>
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write the note here. Save will package it as a markdown file."
                className="min-h-[26rem] w-full resize-y rounded-[1.15rem] border px-4 py-4 text-[1rem] leading-8 outline-none sm:min-h-[32rem]"
                style={{
                  borderColor: "var(--tone-line)",
                  background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--tone-surface) 88%, transparent), color-mix(in srgb, var(--tone-surface-strong) 80%, transparent))",
                  color: "var(--tone-text)"
                }}
              />
            </label>

            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--tone-line)" }}>
              <p className="m-0 text-[0.83rem] leading-6" style={{ color: "var(--tone-muted)" }}>
                {status}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={clearDraft}
                  className="rounded-full border px-4 py-2 text-[0.78rem] font-medium uppercase tracking-[0.12em]"
                  style={{
                    borderColor: "var(--tone-line)",
                    color: "var(--tone-muted)",
                    background: "color-mix(in srgb, var(--tone-surface) 80%, transparent)"
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={connectFolder}
                  className="rounded-full border px-4 py-2 text-[0.78rem] font-medium uppercase tracking-[0.12em]"
                  style={{
                    borderColor: "color-mix(in srgb, var(--tone-accent) 30%, var(--tone-line))",
                    color: "var(--tone-accent-glow)",
                    background: "color-mix(in srgb, var(--tone-accent) 10%, transparent)"
                  }}
                >
                  {folderName ? `Folder: ${folderName}` : "Choose Folder"}
                </button>
                <button
                  type="button"
                  onClick={saveNote}
                  disabled={!canSave || isSaving}
                  className="rounded-full border px-4 py-2 text-[0.78rem] font-medium uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-55"
                  style={{
                    borderColor: "color-mix(in srgb, var(--tone-sky-bright) 34%, var(--tone-line))",
                    color: "var(--tone-text)",
                    background: "color-mix(in srgb, var(--tone-sky) 18%, var(--tone-surface-strong))"
                  }}
                >
                  {isSaving ? "Saving..." : directoryHandleRef.current ? "Save To Folder" : "Save To Computer"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="px-4 py-4 sm:px-5">
          <div
            className="rounded-[1rem] border px-3 py-3"
            style={{
              borderColor: "var(--tone-line)",
              background: "color-mix(in srgb, var(--tone-surface) 78%, transparent)"
            }}
          >
            <p className="m-0 text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--tone-muted)" }}>
              Draft Status
            </p>
            <div className="mt-3 grid gap-3">
              <div>
                <div className="text-[1.2rem] font-medium" style={{ color: "var(--tone-text)" }}>{wordCount}</div>
                <div className="text-[0.76rem] uppercase tracking-[0.12em]" style={{ color: "var(--tone-muted)" }}>words</div>
              </div>
              <div>
                <div className="text-[1.2rem] font-medium" style={{ color: "var(--tone-text)" }}>{lineCount}</div>
                <div className="text-[0.76rem] uppercase tracking-[0.12em]" style={{ color: "var(--tone-muted)" }}>lines</div>
              </div>
              <div>
                <div className="text-[1.2rem] font-medium" style={{ color: "var(--tone-text)" }}>
                  {supportsFolderWrite ? "Folder-ready" : "Download-only"}
                </div>
                <div className="text-[0.76rem] uppercase tracking-[0.12em]" style={{ color: "var(--tone-muted)" }}>save mode</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="m-0 text-[0.7rem] uppercase tracking-[0.16em]" style={{ color: "var(--tone-muted)" }}>
              Published Writing
            </p>
            <p className="mt-2 text-[0.84rem] leading-6" style={{ color: "var(--tone-muted)" }}>
              {totalPublished} published pieces remain below as the public archive.
            </p>

            <div className="mt-3 space-y-3">
              {published.slice(0, 4).map((entry) => (
                <a
                  key={entry.href}
                  href={entry.href}
                  className="block rounded-[0.95rem] border px-3 py-3 no-underline transition-colors"
                  style={{
                    borderColor: "var(--tone-line)",
                    background: "color-mix(in srgb, var(--tone-surface) 76%, transparent)"
                  }}
                >
                  <div className="text-[0.72rem] uppercase tracking-[0.12em]" style={{ color: "var(--tone-muted)" }}>
                    {entry.date}
                  </div>
                  <div className="mt-1 text-[0.94rem] font-medium" style={{ color: "var(--tone-text)" }}>
                    {entry.title}
                  </div>
                  <p className="mt-2 text-[0.82rem] leading-6" style={{ color: "var(--tone-muted)" }}>
                    {entry.voice || entry.summary}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
