import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <span className="font-mono text-2xs uppercase tracking-wider text-fg-faint">
          jay moore — wip
        </span>
        <ThemeToggle />
      </header>
    </div>
  );
}
