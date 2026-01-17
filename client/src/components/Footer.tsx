import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-heading font-bold tracking-tight">
                Axiom Gearz
              </span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Smart Tech. Real Value. We provide top-tier audio equipment, networking solutions, and tech accessories with reliable local support.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-accent transition-colors">Shop All Products</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/dashboard" className="hover:text-accent transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Categories</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/shop?category=Speakers" className="hover:text-accent transition-colors">Speakers</Link></li>
              <li><Link href="/shop?category=Audio+Equipment" className="hover:text-accent transition-colors">Audio Equipment</Link></li>
              <li><Link href="/shop?category=Networking" className="hover:text-accent transition-colors">Networking</Link></li>
              <li><Link href="/shop?category=Accessories" className="hover:text-accent transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-accent" />
                <span>Level 4, Multiplan Center, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <span>support@axiomgearz.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Axiom Gearz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
