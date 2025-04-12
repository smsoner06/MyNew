import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useAction(api.auth.signIn);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await signIn({ 
          params: {
            username,
            password
          }
        });
      }}
      className="flex flex-col gap-4 mt-8 mx-auto max-w-sm p-4"
    >
      <input
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="px-4 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400"
        placeholder="Kullanıcı Adı"
      />
      <input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-4 py-2 bg-gray-800 rounded-md text-white placeholder-gray-400"
        placeholder="Şifre"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition-colors"
      >
        Giriş Yap
      </button>
    </form>
  );
}
