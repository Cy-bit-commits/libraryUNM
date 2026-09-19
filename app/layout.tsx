import { Inter } from "next/font/google";
import './globals.css';
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevents render-blocking and preload timeout warnings
  preload: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
