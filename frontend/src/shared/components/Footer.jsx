import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import {
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { Link } from "react-router"; 
export const Footer = () => {
  
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0F172A] text-gray-300 mt-20 border-t border-gray-800/80">
      
      {/* MAIN FOOTER CONTAINER */}
      <div className="max-w-[1400px] mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* BRAND COLUMN */}
        <div className="space-y-4">
          <div className="bg-white inline-block rounded-xl p-2.5 shadow-sm">
            <img src="Logo.png" alt="CareNXT Logo" className="w-32 object-contain" />
          </div>

          <h3 className="text-white text-xl font-bold tracking-tight">
            CareNXT
          </h3>

          <p className="text-gray-400 leading-relaxed text-sm">
            Innovation with Care. We provide premium dental instruments
            and clinical supplies trusted by dentists, hospitals,
            clinics, and students across India.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3 pt-2">
            {[
              { icon: <FaFacebookF size={16} />, href: "#", label: "Facebook" },
              { icon: <FaInstagram size={16} />, href: "#", label: "Instagram" },
              { icon: <FaTwitter size={16} />, href: "#", label: "Twitter" },
              { icon: <FaLinkedinIn size={16} />, href: "#", label: "LinkedIn" },
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-800/80 hover:bg-[#06A1B7] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* CATEGORIES COLUMN */}
        <div>
          <h3 className="text-white text-base font-bold uppercase tracking-wider mb-5">
            Categories
          </h3>

          <ul className="flex flex-col space-y-3 text-sm">
            {[
              { name: "Equipment", query: "Equipment" },
              { name: "Endodontics", query: "Endodontics" },
              { name: "Orthodontics", query: "Orthodontics" },
              { name: "Restorative", query: "Restorative" },
              { name: "Handpieces", query: "Handpieces" },
            ].map((cat) => (
              <li key={cat.name}>
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.query)}`}
                  onClick={handleScrollTop}
                  className="hover:text-[#06A1B7] transition-colors inline-block"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* QUICK LINKS COLUMN */}
        <div>
          <h3 className="text-white text-base font-bold uppercase tracking-wider mb-5">
            Quick Links
          </h3>

          <ul className="flex flex-col space-y-3 text-sm">
            {[
              { name: "Home", path: "/" },
              { name: "About Us", path: "/about" },
              { name: "Contact", path: "/contact" },
              { name: "Wishlist", path: "/wishlist" },
              { name: "Cart", path: "/cart" },
              { name: "Privacy Policy", path: "/" },
              { name: "Terms & Conditions", path: "/" },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={handleScrollTop}
                  className="hover:text-[#06A1B7] transition-colors inline-block"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>


        <div>
          <h3 className="text-white text-base font-bold uppercase tracking-wider mb-5">
            Contact Us
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <FiMail className="text-[#06A1B7] shrink-0 mt-1" size={18} />
              <a
                href="mailto:mihitenterprises18@gmail.com"
                className="hover:text-[#06A1B7] transition-colors break-all"
              >
                mihitenterprises18@gmail.com
              </a>
            </div>

            <div className="flex items-start gap-3">
              <FiPhone className="text-[#06A1B7] shrink-0 mt-1" size={18} />
              <a
                href="tel:+919667292555"
                className="hover:text-[#06A1B7] transition-colors"
              >
                +91 9667292555
              </a>
            </div>

            <div className="flex items-start gap-3">
              <FiMapPin className="text-[#06A1B7] shrink-0 mt-1" size={18} />
              <p className="text-gray-400 leading-relaxed">
                Office #226, 2nd Floor, Oak Tower,
                Paramount Golfmart, Sector Zeta,
                Greater Noida, Uttar Pradesh.
              </p>
            </div>
          </div>
        </div>

      </div>

    
      <div className="border-t border-gray-800/80 bg-[#0B1120]">
        <div className="max-w-[1400px] mx-auto py-5 px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()} CareNXT. All Rights Reserved.
          </p>

          <p className="text-xs sm:text-sm text-gray-500">
            Designed with <span className="text-red-500">❤️</span> for Dental Professionals
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;