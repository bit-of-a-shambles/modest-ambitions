import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modest Ambitions — Software Startup Studio",
  description:
    "An independent software startup studio building small, useful internet businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
