import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Qur'anka Kariimka (Carabi & Cismaaniya)",
  description: "Website-ka rasmiga ah ee akhriska Qur'anka ee farta Far Soomaali Cismaaniya",
};

export default function RootLayout({ children }) {
  return (
    <html lang="so">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Osmanya:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}