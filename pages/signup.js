import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Head from 'next/head'

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://dennislaw-xr6xja66ya-uk.a.run.app/signup", {
        username,
        full_name: fullName,
        password,
      });

      if (response.data.success) {
        // Save user details or any other needed data here
        router.push("/login");
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError("Username already exits ");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <Head>
        <title>Sign Up</title>
      </Head>
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-blue-800 sm:text-3xl">
          Get started today
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">Create an account</p>

          {error && <p className="text-center text-red-500">{error}</p>}

          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="full_name" className="sr-only">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="full_name"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter a Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-blue-800 px-5 py-3 text-sm font-medium text-white"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Have an account?{" "}
            <Link className="underline" href="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
