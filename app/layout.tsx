import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Pokédex App",
  description:
    "Explore over 800 Pokémon with detailed information in our beautifully designed Pokédex app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <header className="shadow-md">
            <nav className="container mx-auto flex justify-between items-center py-4 px-6">
              <Link href="/">
                <h1 className="text-4xl font-extrabold hover:underline">Pokédex</h1>
              </Link>
              <ul className="flex space-x-4 text-lg">
                <li>
                  <ThemeToggle /> {/* Use the client-side theme toggle component */}
                </li>
              </ul>
            </nav>
          </header>
          <main className="flex min-h-screen flex-col items-center p-6">
            <div className="container mx-auto">{children}</div>
          </main>
          <footer className=" py-6">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 Pokédex App. All rights reserved. Created by Aland Mariwan</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
