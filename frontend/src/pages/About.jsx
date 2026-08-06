import {
  ShieldCheck,
  Truck,
  HeartHandshake,
  BadgeCheck,
  Target,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router";

const About = () => {
const navigate = useNavigate()
  return (
    <div>

      {/* Hero */}
      <section className="">
        <div className="max-w-7xl mx-auto px-5 text-center bg-gradient-to-r from-[#06A1B7] to-cyan-700 py-20 rounded-xl">

          <h1 className="text-5xl font-bold text-white">
            About CareNXT
          </h1>

          <p className="text-cyan-100 mt-5 max-w-3xl mx-auto text-lg">
            Innovation with Care — Delivering trusted dental products that
            empower clinics, hospitals, and dental professionals across India.
          </p>

        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-5 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <img
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
            alt=""
            className="rounded-3xl shadow-xl h-[500px] object-cover"
          />

          <div>

            <span className="text-[#06A1B7] font-semibold uppercase">
              Who We Are
            </span>

            <h2 className="text-4xl font-bold mt-3">
              Your Trusted Dental Marketplace
            </h2>

            <p className="text-gray-600 mt-6 leading-8">
              CareNXT is dedicated to supplying high-quality dental
              instruments, equipment, and clinical essentials for dentists,
              hospitals, clinics, and students.
            </p>

            <p className="text-gray-600 mt-4 leading-8">
              We carefully select every product to ensure excellent quality,
              reliability, and value so dental professionals can focus on
              providing the best patient care.
            </p>

          </div>

        </div>

      </section>

      {/* Mission & Vision */}

      <section className="max-w-7xl mx-auto px-5 pb-20">

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <Target className="text-[#06A1B7]" size={45} />

            <h3 className="text-2xl font-bold mt-5">
              Our Mission
            </h3>

            <p className="text-gray-600 mt-4 leading-7">
              To make premium dental products accessible through dependable
              service, transparent pricing, and a seamless online shopping
              experience.
            </p>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <Eye className="text-[#06A1B7]" size={45} />

            <h3 className="text-2xl font-bold mt-5">
              Our Vision
            </h3>

            <p className="text-gray-600 mt-4 leading-7">
              To become one of India's most trusted destinations for dental
              professionals seeking innovative and quality clinical solutions.
            </p>

          </div>

        </div>

      </section>

      {/* Why Choose */}

      <section>

        <div className="max-w-7xl mx-auto px-5 bg-white py-20 rounded-xl">

          <h2 className="text-4xl font-bold text-center">
            Why Choose CareNXT?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <BadgeCheck className="mx-auto text-[#06A1B7]" size={42} />
              <h3 className="font-semibold mt-4">Premium Quality</h3>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <Truck className="mx-auto text-[#06A1B7]" size={42} />
              <h3 className="font-semibold mt-4">Fast Delivery</h3>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <ShieldCheck className="mx-auto text-[#06A1B7]" size={42} />
              <h3 className="font-semibold mt-4">
                Genuine Products
              </h3>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <HeartHandshake className="mx-auto text-[#06A1B7]" size={42} />
              <h3 className="font-semibold mt-4">
                Customer First
              </h3>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-20">

        <div className="max-w-7xl mx-auto bg-[#06A1B7] rounded-3xl p-12 text-center">

          <h2 className="text-4xl font-bold text-white">
            Ready to Upgrade Your Dental Practice?
          </h2>

          <p className="text-cyan-100 mt-5">
            Browse our carefully selected dental instruments and equipment.
          </p>

          <button onClick={()=>navigate("/shop")} className="mt-8 bg-white text-[#06A1B7] px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition">
            Shop Now
          </button>

        </div>

      </section>

    </div>
  );
};

export default About;