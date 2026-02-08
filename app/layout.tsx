import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Yellow Studio",
  description: "Chat-driven AI website builder with live preview.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
