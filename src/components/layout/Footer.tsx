import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 mb-4 md:mb-0 font-medium">
            © {currentYear} Muhammad Iksan Kiat. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-accent transition-colors font-medium"
              aria-label="GitHub"
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-accent transition-colors font-medium"
              aria-label="LinkedIn"
            >
              LinkedIn
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-accent transition-colors font-medium"
              aria-label="Twitter"
            >
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
