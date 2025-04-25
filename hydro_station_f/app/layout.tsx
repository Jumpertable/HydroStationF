import { Lato } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const roboto = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <header className="flex justify-end items-center font-bold text-blue-800 text-xl gap-4 p-4 bg-blue-300">
          <Link className="mr-auto" href="/Customer/Store">
            HydroStation
          </Link>
        </header>
        <main className="min-h-[60vh] bg-blue-50">{children}</main>

        <footer>Copyright reserved</footer>
      </body>
    </html>
  );
}
