import Link from "next/link";
import Logo from "./logo";
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";

// WhatsApp SVG component
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} Career Guidance System for Kenya CBE. All rights reserved.</p>
          <p className="mt-2 text-sm">Empowering students to make informed career decisions aligned with their talents and passions.</p>
          
          <div className="flex justify-center gap-6 my-6">
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
            </a>
            <a href="#" aria-label="X (Twitter)" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
            </a>
            <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
            </a>
             <a href="#" aria-label="WhatsApp" className="text-gray-400 hover:text-white transition-colors">
                <WhatsAppIcon className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
            </a>
          </div>

          <div className="mt-6">
            <p className="text-sm">Designed by صديق علي</p>
            <p className="text-lg font-semibold text-white mt-1">Sidmadina Tech solutions limited</p>
            <p className="mt-2 text-sm">
              Support Contact: <a href="tel:+2544117448455" className="hover:text-white transition-colors">+254 411 744 8455</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
