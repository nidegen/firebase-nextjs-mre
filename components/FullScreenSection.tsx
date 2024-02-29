import { ReactNode } from "react";

interface FullscreenSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export default function FullscreenSection({
  id,
  children,
  className,
}: FullscreenSectionProps) {
  return (
    <section
      id={id}
      className={`min-h-screen flex items-center justify-center md:pt-24 ${className}`}
    >
      {children}
    </section>
  );
}
