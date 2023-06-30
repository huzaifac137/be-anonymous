import "./globals.css";
import { Metadata } from "next";
import { Fragment } from "react";
import NavBar from "../../components/NavBar";
import Provider from "../../components/SessionProvider";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";
export default function RootLayout({ children }) {
  const session = getServerSession();
  return (
    <html lang="en">
      <body>
        <Provider>
          <NavBar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
