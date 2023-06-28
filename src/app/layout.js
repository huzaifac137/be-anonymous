import "./globals.css";
import { Metadata } from "next";
import { Fragment } from "react";
import NavBar from "../../components/navBar";
import Provider from "../../components/SessionProvider";
import { getServerSession } from "next-auth";

export default function RootLayout({ children }) {
  const session = getServerSession();
  return (
    <html lang="en">
      <body>
        <Provider>
          {!session ? null : <NavBar />}
          {children}
        </Provider>
      </body>
    </html>
  );
}
