import { Inter } from 'next/font/google';
import './globals.css';
import "./css/acss/acss.css"
import "./css/fontawesome/css/all.min.css"

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kontribute - Collect Money from Groups, Stress-Free',
  description: 'Stop tracking payments in WhatsApp. Create a link, share it, and collect automatically.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <script src="/tailwind.cdn.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}