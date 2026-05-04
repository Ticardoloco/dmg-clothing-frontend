import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/general/Footer";
import Header from "@/components/general/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dmg Clothing",
  description: "DMG Clothing is a modern fashion brand focused on stylish, high-quality apparel. It blends creativity, comfort, and durability to deliver trendy outfits for everyday wear. The brand promotes confidence and self-expression, offering unique designs that appeal to diverse tastes and contemporary lifestyles.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
       <div className="">
        <Header/>
         {children}
         <Footer/>
       </div>
        </body>
    </html>
  );
}
