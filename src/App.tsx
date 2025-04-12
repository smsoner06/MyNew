import { Authenticated, Unauthenticated } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "./components/ui/toaster";
import { ShoppingLists } from "./components/ShoppingLists";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm px-4 py-3 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-lg font-semibold text-indigo-400">Alışveriş Listem</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex items-start justify-center p-4">
        <div className="w-full max-w-xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-indigo-400 mb-4">Alışveriş Listesi</h1>
        <Authenticated>
          <ShoppingLists />
        </Authenticated>
        <Unauthenticated>
          <p className="text-lg sm:text-xl text-gray-400">Başlamak için giriş yapın</p>
          <SignInForm />
        </Unauthenticated>
      </div>
    </div>
  );
}
