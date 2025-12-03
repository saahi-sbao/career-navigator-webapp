import Link from "next/link";
import Logo from "./logo";
import { Facebook, Linkedin, Twitter } from "lucide-react";

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
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
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