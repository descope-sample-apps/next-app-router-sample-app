import Link from "next/link";

export default function Nav() {
    return <div
    className={`fixed top-0 w-full flex justify-center bg-white/0 z-30 transition-all`}
  >
    <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full">
      <Link href="/" className="flex items-center font-display text-2xl">
        <p>Descope</p>
      </Link>
      <div className="space-x-4">
        <Link href="/login">Log in</Link>
        <Link
            className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
            href="/signup"
        >
        Sign up
        </Link>
      </div>
    </div>
  </div>
}