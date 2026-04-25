import type { Metadata } from 'next';
import NotFoundClient from './NotFoundClient';

export const metadata: Metadata = {
  title: '404 - Sivua ei löytynyt | Bistro Saimaa',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
