import { useState } from "react";
import { Check } from "lucide-react";

interface Props {
  email: string;
  className: string;
  children: React.ReactNode;
}

export default function EmailButton({ email, className, children }: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (e.g. insecure context) — mailto still
      // attempts to fire regardless, so this is a silent no-op.
    }
  };

  return (
    <a href={`mailto:${email}`} onClick={handleClick} className={className}>
      {copied ? (
        <>
          <Check size={15} />
          Copied!
        </>
      ) : (
        children
      )}
    </a>
  );
}