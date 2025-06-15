import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold">Goldwin</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your premier destination for luxury products and exceptional shopping experiences. 
              Quality, elegance, and customer satisfaction are our top priorities.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/category/electronics" className="block text-gray-400 hover:text-white transition-colors">
                Electronics
              </Link>
              <Link href="/category/fashion" className="block text-gray-400 hover:text-white transition-colors">
                Fashion
              </Link>
              <Link href="/category/accessories" className="block text-gray-400 hover:text-white transition-colors">
                Accessories
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-gray-400 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="/shipping" className="block text-gray-400 hover:text-white transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="block text-gray-400 hover:text-white transition-colors">
                Returns & Exchanges
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Luxury Avenue<br />
                  New York, NY 10001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">support@goldwin.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Goldwin. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}