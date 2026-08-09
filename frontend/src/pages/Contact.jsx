import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div>
      <section>
        <div className="rounded-xl max-w-7xl mx-auto px-5 text-center bg-gradient-to-r from-[#06A1B7] to-cyan-700 py-20">

          <h1 className="text-5xl font-bold text-white">
            Contact Us
          </h1>

          <p className="text-cyan-100 mt-5 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a product inquiry,
            need support, or want to partner with us, our team is here to help.
          </p>

        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 py-20">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Get In Touch
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow p-6 flex gap-5">
                <div className="w-14 h-14 rounded-full bg-[#06A1B7]/10 flex items-center justify-center">
                  <FaPhoneAlt className="text-[#06A1B7]" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">
                    +91 9667292555
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex gap-5">
                <div className="w-14 h-14 rounded-full bg-[#06A1B7]/10 flex items-center justify-center">
                  <FaEnvelope className="text-[#06A1B7]" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">
                    mihitenterprises18@gmail.com
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex gap-5">
                <div className="w-20 h-14 rounded-full bg-[#06A1B7]/10 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-[#06A1B7]" />
                </div>
                <div>
                  <h3 className="font-semibold">Office Address</h3>
                  <p className="text-gray-600">
                    Office #226, 2nd Floor, Oak Tower,
                    Paramount Golfmart,
                    Sector Zeta,
                    Greater Noida,
                    Uttar Pradesh.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 flex gap-5">
                <div className="w-14 h-14 rounded-full bg-[#06A1B7]/10 flex items-center justify-center">
                  <FaClock className="text-[#06A1B7]" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    Business Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Saturday
                  </p>
                  <p className="text-gray-600">
                    9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8">
              Send Message
            </h2>
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-xl px-5 py-3 focus:outline-none focus:border-[#06A1B7]"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-xl px-5 py-3 focus:outline-none focus:border-[#06A1B7]"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full border rounded-xl px-5 py-3 focus:outline-none focus:border-[#06A1B7]"
              />
              <textarea
                rows="6"
                placeholder="Your Message"
                className="w-full border rounded-xl px-5 py-3 focus:outline-none focus:border-[#06A1B7]"
              />
              <button
                className="w-full bg-[#06A1B7] hover:bg-cyan-700 text-white py-4 rounded-xl font-semibold transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>


      <section className="max-w-7xl mx-auto px-5 pb-20">
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <iframe
            title="location"
            src="https://www.google.com/maps?q=Greater+Noida&output=embed"
            className="w-full h-[400px]"
            loading="lazy"
          ></iframe>
        </div>
      </section>

    </div>
  );
};

export default Contact;