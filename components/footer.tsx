export function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center justify-between gap-4 px-6 pt-8 pb-12 font-mono text-2xs text-fg-faint">
        <span>Jay Moore — design engineer for AI-native workflows</span>
        <span>
          <a
            href="https://github.com/jaymoore"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-soft transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent"
          >
            github
          </a>
          {" · "}
          <a
            href="https://www.linkedin.com/in/jay-moore-designer/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-soft transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent"
          >
            linkedin
          </a>
          {" · "}
          <a
            href="mailto:jay@jaymoore.net"
            className="text-fg-soft transition-colors duration-(--duration-fast) ease-(--ease-snappy) hover:text-accent"
          >
            jay@jaymoore.net
          </a>
        </span>
      </div>
    </footer>
  );
}
