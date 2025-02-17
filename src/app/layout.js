import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OCR",
  description: "recognising text from images",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col h-screen">
          <header className="bg-gray-800 text-white p-4">
            <h1 className="text-2xl font-bold">{metadata.title}</h1>
          </header>
          <main className="flex-1 p-4">{children}</main>
          </div>
      </body>
    </html>
  );
}
