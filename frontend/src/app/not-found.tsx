import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-16 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-md text-center">
        <h2 className="mb-8 font-extrabold text-9xl text-gray-600 dark:text-gray-300">
          <span className="sr-only">Error</span>404
        </h2>
        <p className="text-2xl font-semibold md:text-3xl text-gray-600">
          Sorry, we couldnt find this page.
        </p>
        <p className="mt-4 mb-8 dark:text-gray-400 text-gray-600">
          But dont worry, you can find plenty of other things on our
          homepage.
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gray-800 hover:bg-gray-600 rounded-full shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
