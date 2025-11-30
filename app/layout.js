import {
  Geist,
  Geist_Mono,
  Montserrat,
  Oswald,
  Raleway,
  Roboto,
} from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { ThemeProvider } from "next-themes";
import { AddDrawer } from "./components/AddDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const montserrat = Raleway({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Expense Tracker",
  description: "track your expenses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* <Header /> */}
          {children}
          <AddDrawer />
        </ThemeProvider>
      </body>
    </html>
  );
}
