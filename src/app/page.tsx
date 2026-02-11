import { Metadata } from 'next';
import LocaleRedirect from '@/components/LocaleRedirect';

export const metadata: Metadata = {
  title: 'Redirecting...',
  other: {
    'http-equiv': 'refresh',
    content: '0; url=/blog/ko/blog',
  },
};

export default function Home() {
  return <LocaleRedirect />;
}
