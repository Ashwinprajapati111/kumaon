import React from "react";
import Header from "../Component/Header.js";
import Footer from "../Component/Footer.js";
import Test from "../Component/Test.js";
import { Link } from "react-router-dom";

export default function AboutUs() {
    return (
        <>
            <Header />
            <div className="bg-white text-gray-800">

                {/* HERO */}
                <section className="bg-gradient-to-r from-green-50 to-emerald-100 py-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        About Kumaon Organics
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600">
                        Himalayan wellness rooted in purity, sustainability, and conscious living.
                    </p>
                </section>

                {/* INTRO */}
                <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
                    <img
                        src="/images/IMG_3259.jpg"
                        alt="Kumaon Hills"
                        className="rounded-2xl shadow-lg"
                    />

                    <div>
                        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Kumaon Organics is a Himalayan wellness brand built on three pillars:
                            <strong> single-origin purity, functional health, and conscious luxury.</strong>
                            Our products come directly from the Kumaon hills of Uttarakhand —
                            not blended, not diluted, and never mass-produced.
                        </p>

                        <p className="mt-4 text-gray-600">
                            We bring clean-label, traceable wellness products that support gut health,
                            metabolism, skin, and overall well-being — designed for modern lifestyles.
                        </p>
                    </div>
                </section>

                {/* FEATURES */}
                <section className="bg-gray-50 py-16">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            What Makes Us Special
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">

                            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                                <h3 className="font-semibold text-lg mb-2">
                                    🌿 Single-Origin Purity
                                </h3>
                                <p className="text-gray-600">
                                    Sourced directly from the Kumaon region, ensuring traceability and authenticity.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                                <h3 className="font-semibold text-lg mb-2">
                                    🧪 Clean & Natural
                                </h3>
                                <p className="text-gray-600">
                                    No additives, no preservatives — just raw, unfiltered, nutrient-rich products.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                                <h3 className="font-semibold text-lg mb-2">
                                    💚 Functional Wellness
                                </h3>
                                <p className="text-gray-600">
                                    Designed to support gut health, metabolism, immunity, and overall wellness.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                                <h3 className="font-semibold text-lg mb-2">
                                    🌾 Small-Batch Production
                                </h3>
                                <p className="text-gray-600">
                                    Carefully produced in small lots with attention to quality and sourcing.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                                <h3 className="font-semibold text-lg mb-2">
                                    🤝 Farmer Connected
                                </h3>
                                <p className="text-gray-600">
                                    We work closely with Himalayan farmers to ensure fair practices.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                                <h3 className="font-semibold text-lg mb-2">
                                    🌍 Eco-Conscious Luxury
                                </h3>
                                <p className="text-gray-600">
                                    Sustainable sourcing with a “less but better” philosophy.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="max-w-5xl mx-auto px-6 py-16">
                    <h2 className="text-3xl font-bold text-center mb-10">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">

                        <div>
                            <h3 className="font-semibold">What is Kumaon Organics?</h3>
                            <p className="text-gray-600">
                                A wellness brand offering pure, natural, and ethically sourced Himalayan products.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Are your products organic?</h3>
                            <p className="text-gray-600">
                                Yes, we use natural farming practices with no harmful chemicals.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Do you use preservatives?</h3>
                            <p className="text-gray-600">
                                No. Our products are free from artificial additives and preservatives.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">Do you support local farmers?</h3>
                            <p className="text-gray-600">
                                Yes, we work directly with Himalayan farmers and support local communities.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold">How should I store products?</h3>
                            <p className="text-gray-600">
                                Store in a cool, dry place away from sunlight.
                            </p>
                        </div>

                    </div>
                </section>

                {/* CTA */}
                <section className="bg-[#d1a345] text-white text-center py-16">
                    <h2 className="text-3xl font-bold mb-4">
                        Experience Himalayan Wellness
                    </h2>
                    <p className="mb-6">
                        Discover clean, natural products crafted for modern living.
                    </p>
                    <Link
                        to="/"
                        onClick={() => {
                            setTimeout(() => {
                                window.scrollTo({ top: 650, behavior: "smooth" });
                            }, 100);
                        }}
                    >
                        <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                            Shop Now
                        </button>
                    </Link>
                </section>

            </div>
            <Test />
            <Footer />
        </>
    );
}