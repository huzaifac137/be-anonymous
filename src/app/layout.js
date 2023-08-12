import "./globals.css";
import { Metadata } from "next";
import { Fragment } from "react";
import NavBar from "../../components/NavBar";
import Provider from "../../components/SessionProvider";
import {Oxygen} from "@next/font/google";


const oxygen = Oxygen({ 
  weight: '400',
  variable: '--oxygen-font' ,
  subsets : ["latin"]
});



export const dynamic = "force-dynamic";
export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={oxygen.className}>
        <Provider>
          <NavBar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
