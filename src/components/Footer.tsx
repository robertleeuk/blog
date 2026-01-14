import { Locale } from '@/types/post';
import { t } from '@/lib/i18n';

interface FooterProps {
  locale: Locale;
}

export default function Footer({ locale }: FooterProps) {
  return (
    <footer className="mt-auto">
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-neutral-500 dark:text-neutral-500 text-sm">
          {t(locale, 'footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
