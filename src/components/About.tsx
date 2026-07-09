export default function About({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="card p-6 sm:p-7">
      <h2 className="font-display text-lg font-semibold">About</h2>
      <div className="mt-4 space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-ink-700 dark:text-neutral-300">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
