import { Metadata } from 'next';
import LocaleRedirect from '@/components/LocaleRedirect';

export const metadata: Metadata = {
  title: 'Redirecting...',
};

export default function Home() {
  return <LocaleRedirect />;
}
