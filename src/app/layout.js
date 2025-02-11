import { Inter, Calistoga } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const calistoga = Calistoga({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ['400'],
});

export const metadata = {
  title: "Er. Hamza",
  description: "Front end developer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={twMerge(inter.variable, calistoga.variable, 'bg-[#030014] text-white antialiased font-sans')}
      >
        {children}
      </body>
    </html>
  );
}
