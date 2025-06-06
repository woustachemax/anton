import Link from "next/link";

export default function Home() {
  return (
    <div className="absolute inset-0 h-full w-full bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-900/20 before:via-transparent before:to-gray-800/20 before:pointer-events-none">
<div className="flex flex-col items-center justify-center h-full">
        <div className="animate-typing overflow-hidden whitespace-nowrap text-6xl text-gray-200 font-extrabold mb-10">
          Welcome to Anton 🤖
        </div>
        <div className="text-gray-400 font-semibold mb-5">
          Brutal Honesty Awaits. Choose wisely.
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <button className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-white hover:text-black">
              Login
            </button>
          </Link>
          <div className="text-gray-400 font-semibold my-3">
                  or
          </div>
          <Link href="/signup">
            <button className="px-6 py-3 bg-white text-black border border-black rounded-lg hover:bg-gray-700 hover:text-gray-200">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
