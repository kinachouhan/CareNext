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
  return (
    <footer className="bg-[#0F172A] text-gray-300 mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <div>
          <div className="bg-white inline-block rounded-lg p-2">
            <img src="Logo.png" className="w-36" />
          </div>

          <h3 className="text-white text-xl font-semibold mt-5">
            CareNXT
          </h3>

          <p className="mt-4 text-gray-400 leading-7 text-sm">
            Innovation with Care. We provide premium dental instruments
            and clinical supplies trusted by dentists, hospitals,
            clinics, and students across India.
          </p>

          <div className="flex gap-4 mt-6">

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#06A1B7] flex items-center justify-center transition"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#06A1B7] flex items-center justify-center transition"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#06A1B7] flex items-center justify-center transition"
            >
              <FaTwitter />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#06A1B7] flex items-center justify-center transition"
            >
              <FaLinkedinIn />
            </a>

          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-5">
            Categories
          </h3>

          <div className="flex flex-col gap-3">

            <Link to="/shop?category=Equipment" className="hover:text-[#06A1B7]">
              Equipment
            </Link>

            <Link to="/shop?category=Endodontics" className="hover:text-[#06A1B7]">
              Endodontics
            </Link>

            <Link to="/shop?category=Orthodontics" className="hover:text-[#06A1B7]">
              Orthodontics
            </Link>

            <Link to="/shop?category=Restorative" className="hover:text-[#06A1B7]">
              Restorative
            </Link>

            <Link to="/shop?category=Handpieces" className="hover:text-[#06A1B7]">
              Handpieces
            </Link>

          </div>

        </div>

        {/* Quick Links */}
        <div>

          <h3 className="text-white text-lg font-semibold mb-5">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3">

            <Link to="/"   className="hover:text-[#06A1B7]">Home</Link>

            <Link to="/about"  className="hover:text-[#06A1B7]">About Us</Link>

            <Link to="/contact"  className="hover:text-[#06A1B7]">Contact</Link>

            <Link to="/wishlist"  className="hover:text-[#06A1B7]">Wishlist</Link>

            <Link to="/cart"  className="hover:text-[#06A1B7]">Cart</Link>

            <Link to="/privacy-policy"  className="hover:text-[#06A1B7]">
              Privacy Policy
            </Link>

            <Link to="/terms"  className="hover:text-[#06A1B7]">
              Terms & Conditions
            </Link>

          </div>

        </div>

        {/* Contact */}
        <div>

          <h3 className="text-white text-lg font-semibold mb-5">
            Contact Us
          </h3>

          <div className="space-y-4">

            <div className="flex gap-3">

              <FiMail className="text-[#06A1B7] mt-1" />

              <a
                href="mailto:mihitenterprises18@gmail.com"
                className="hover:text-[#06A1B7]"
              >
                mihitenterprises18@gmail.com
              </a>

            </div>

            <div className="flex gap-3">

              <FiPhone className="text-[#06A1B7] mt-1" />

              <a
                href="tel:+919667292555"
                className="hover:text-[#06A1B7]"
              >
                +91 9667292555
              </a>

            </div>

            <div className="flex gap-3">

              <FiMapPin className="text-[#06A1B7] mt-1" />

              <p>
                Office #226, 2nd Floor, Oak Tower,
                Paramount Golfmart, Sector Zeta,
                Greater Noida, Uttar Pradesh.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto py-5 px-6 flex flex-col md:flex-row justify-between items-center gap-3">

          <p className="text-sm text-gray-400">
            © 2026 CareNext. All Rights Reserved.
          </p>

          <p className="text-sm text-gray-500">
            Designed with ❤️ for Dental Professionals
          </p>

        </div>

      </div>

    </footer>
  );
};