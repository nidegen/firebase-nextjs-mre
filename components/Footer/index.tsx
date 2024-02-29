import { useTranslation } from "next-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-100 py-12 text-sm mt-auto">
      <div className="container mx-auto text-center flex flex-col items-center">
        <span className="text-neutral-500 mb-4">Test Footer</span>
      </div>
    </footer>
  );
}
