import { useState, useRef } from "react";
import { FaMoneyBillWave, FaFileAlt, FaChartBar, FaIdCard, FaCalendarAlt } from "react-icons/fa";
import {
    FaBuilding,
    FaBalanceScale,
    FaHandshake,
    FaPhoneAlt
  } from "react-icons/fa";

export default function NRIPage() {
  // ================= STATES =================
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
  });

  const [showMoreSEO, setShowMoreSEO] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  
  // API Form States
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // Accordions State
  const [accordions, setAccordions] = useState({
    buySell: true,
    propertyManagement: true,
    legal: true,
    popular: true
  });

  // ================= SCROLL REFERENCE =================
  const formRef = useRef(null);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        const nameInput = formRef.current.querySelector('input[name="name"]');
        if (nameInput) nameInput.focus();
      }, 500);
    }
  };

  // ================= DATA =================
  const serviceOptions = [
    "To SELL your property",
    "To BUY a property",
    "To RENT out your property",
    "Legal Services",
    "Property Management Services"
  ];

  const faqs = [
    {
      q: "What is End-to-End Property Management?",
      a: "End-to-end property management is a complete solution where every aspect of your property is handled for you. From tenant search and verification to rent collection, legal documentation, inspections, and maintenance — everything is managed seamlessly by a dedicated team."
    },
    {
      q: "How does NoWayBroker manage my property remotely?",
      a: "NoWayBroker assigns a dedicated Relationship Manager who takes care of your property on your behalf. You receive regular updates, and all activities — including tenant handling, rent collection, and maintenance — are managed efficiently without your physical presence."
    },
    {
      q: "How are tenants verified before renting?",
      a: "Tenants go through a thorough verification process, including background checks, document validation, and screening. This ensures that only reliable and trustworthy tenants are selected for your property."
    },
    {
      q: "How is rent collected and transferred?",
      a: "Rent is collected from tenants on time and transferred directly to your account. The process is fully transparent, and you are kept informed about all transactions."
    },
    {
      q: "What kind of property maintenance services are included?",
      a: "The service includes regular property inspections, repair coordination, and maintenance support. Any issues are identified early and resolved quickly to keep your property in the best condition."
    },
    {
      q: "Do I need to handle legal documentation myself?",
      a: "No, all legal documentation such as rental agreements and related paperwork is handled by the team. This ensures compliance and saves you time and effort."
    }
  ];

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceSelect = (option) => {
    setForm({ ...form, service: option });
    setIsDropdownOpen(false);
  };

  const toggleAccordion = (section) => {
    setAccordions((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  // ================= FORM SUBMISSION API =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.service) {
      setSubmitMessage({ type: "error", text: "Please fill all the fields before submitting." });
      return;
    }

    setIsLoading(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      const response = await fetch("https://api.nowaybroker.com/cust_api/add_nri_leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitMessage({ type: "success", text: "Thank you! Our experts will contact you soon." });
        setForm({ name: "", phone: "", email: "", service: "" }); 
      } else {
        setSubmitMessage({ type: "error", text: "Something went wrong. Please try again later." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage({ type: "error", text: "Network error. Please check your internet connection." });
    } finally {
      setIsLoading(false);
    }
  };

  // ================= RENDER MAIN PAGE =================
  return (
    <div className="bg-[#f8f9fa] min-h-screen relative font-sans text-gray-800">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center shadow-sm gap-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 cursor-pointer">
            {/* <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#fd3752] rounded-full flex items-center justify-center">
               <span className="text-white text-base sm:text-lg font-bold">N</span> 
            </div> */}
             {/* <h1 className="font-extrabold text-gray-900 text-lg sm:text-xl tracking-tight uppercase">NoWayBroker</h1>  */}
          </div>
          <div className="flex items-center gap-1 border border-red-200 bg-red-50 px-2 py-0.5 rounded">
             {/* <span className="text-[9px] sm:text-[10px] text-red-600 font-bold uppercase tracking-wide">
              NRI Services
            </span>  */}
          </div>
        </div>
        {/* <button className="border border-[#42998b] text-[#42998b] font-bold px-3 sm:px-4 py-1.5 rounded flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:bg-teal-50 transition ml-auto">
           <span className="text-base sm:text-lg">📞</span> 919242500000 
        </button> */}
      </nav>

      {/* BACKGROUND HERO IMAGE */}
      <div className="absolute top-[60px] left-0 w-full h-[350px] sm:h-[480px] bg-black z-0">
        <img
          src="https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80"
          alt="NRI Real Estate"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute bottom-0 w-full h-24 sm:h-32 bg-gradient-to-t from-[#f8f9fa] to-transparent"></div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col lg:flex-row items-start gap-8 px-4 pt-8 sm:pt-16 pb-24">

        {/* ================= LEFT SCROLLABLE CONTENT ================= */}
        <div className="w-full lg:w-[60%] flex flex-col gap-6">

          {/* Hero Text */}
          <div className="text-white mb-2 sm:mb-6 mt-4 sm:mt-0">
            <h1 className="text-2xl sm:text-[36px] font-bold leading-tight mb-2 sm:mb-3 text-shadow-md">
              Smooth Property Solutions for NRIs
            </h1>
            <p className="text-[13px] sm:text-[15px] text-gray-100 font-medium">
              Trusted Tenants & Buyer Discovery, Legal Assistance & Property Care - handled by professionals
            </p>
          </div>

          {/* Intro Card */}
          <div className="bg-white p-5 sm:p-7 rounded-xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 mb-3">
              Property Management Services for NRIs in India by NoWayBroker
            </h2>
            <p className="text-gray-600 text-[13px] leading-relaxed">
            Managing a property in India while living overseas can be challenging due to time zone gaps, legal formalities, tax obligations, and various other responsibilities. NoWayBroker’s NRI property management services simplify the entire process, ensuring your property remains safe, maintained, and professionally managed even when you are miles away.
            </p>
          </div>

          {/* Stats Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-center items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200 gap-4 sm:gap-0">
            <div className="w-full sm:w-1/2 text-center pb-2 sm:pb-0">
              <span className="text-[#fd3752] text-2xl font-bold">25,000+</span>
              <span className="text-gray-700 text-[13px] ml-2">properties <strong>RENTED out</strong> monthly</span>
            </div>
            <div className="w-full sm:w-1/2 text-center pt-2 sm:pt-0">
              <span className="text-[#fd3752] text-2xl font-bold">5,000+</span>
              <span className="text-gray-700 text-[13px] ml-2">properties <strong>SOLD</strong> monthly</span>
            </div>
          </div>

          {/* Why Trust Us */}
          <div className="bg-white p-5 sm:p-7 rounded-xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 mb-1">
              Why NRIs Rely on Us for Property Management in India
            </h2>
            <p className="text-gray-500 text-[12px] italic mb-6">Rent, sell, or manage your property — from anywhere in the world</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6 mb-6">
              {[
  {
    icon: <FaBuilding />,
    text: "One-stop platform for buying, selling, renting, property management, legal, RA, and home services"
  },
  {
    icon: <FaBalanceScale />,
    text: "Strong expertise in NRI-focused legal and tax matters"
  },
  {
    icon: <FaHandshake />,
    text: "Local experts providing end-to-end assistance"
  },
  {
    icon: <FaPhoneAlt />,
    text: "NRI-friendly support via toll-free numbers aligned with your time zone"
  }
].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-[13px] text-gray-700 font-medium">
                  <div className="w-8 h-8 bg-[#e8f4f1] text-[#42998b] rounded flex items-center justify-center shrink-0 text-lg">{item.icon}</div>
                  <p className="pt-1">{item.text}</p>
                </div>
              ))}
            </div>
            {/* Scroll Button */}
            <button
  onClick={scrollToForm}
  className="w-full bg-[#691E2E] hover:bg-[#581926] text-white font-semibold py-3 rounded-lg transition-colors"
>
  Become a Partner
</button>
          </div>

          {/* Accordion 1: Buy. Sell. Rent. */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 sm:h-40 bg-gray-900 text-white p-5 sm:p-6 flex flex-col justify-end relative bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center cursor-pointer select-none" onClick={() => toggleAccordion('buySell')}>
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="absolute top-4 right-4 bg-white/20 p-1.5 rounded z-10 backdrop-blur-sm hover:bg-white/30 transition">
                <svg className={`transform transition-transform duration-300 ${!accordions.buySell ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </div>
              <h3 className="font-bold text-xl sm:text-2xl relative z-10">Buy. Sell. Rent.</h3>
              <p className="text-xs text-gray-300 italic mt-1 relative z-10">NoWayBrokerage. No Drama.</p>
            </div>
            {accordions.buySell && (
              <div className="p-5 sm:p-6 space-y-6 bg-white border-t border-gray-100">
                <div>
                  <h4 className="font-bold text-[15px] text-gray-900 mb-1">Looking to rent or sell?</h4>
                  <p className="text-[13px] text-gray-600 leading-relaxed">Our dedicated Relationship Managers take care of everything — from <span className="font-semibold">finding verified tenants/buyers</span> to organizing <span className="font-semibold">property visits</span> and sharing <span className="font-semibold">regular updates</span>, all aligned with your time zone.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-gray-900 mb-1">Planning to buy??</h4>
                  <p className="text-[13px] text-gray-600 leading-relaxed">Purchase your home with confidence — no matter where you are. Explore <span className="font-semibold">4000+ verified builder projects</span> with a <span className="font-semibold">dedicated expert</span> by your side.</p>
                </div>
                {/* Scroll Button */}
                <button onClick={scrollToForm} className="w-full bg-[#691E2E] hover:bg-[#581926] text-white py-3 rounded-lg text-sm font-semibold transition">Explore Now</button>
              </div>
            )}
          </div>

          {/* Accordion 2: Property Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 sm:h-40 bg-gray-900 text-white p-5 sm:p-6 flex flex-col justify-end relative bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center cursor-pointer select-none" onClick={() => toggleAccordion('propertyManagement')}>
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="absolute top-4 right-4 bg-white/20 p-1.5 rounded z-10 backdrop-blur-sm hover:bg-white/30 transition">
                <svg className={`transform transition-transform duration-300 ${!accordions.propertyManagement ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </div>
              <h3 className="font-bold text-xl sm:text-2xl relative z-10">Complete Property Management Solutions </h3>
              <p className="text-xs text-gray-300 italic mt-1 relative z-10">Your Property. Our Responsibility.</p>
            </div>
            {accordions.propertyManagement && (
              <div className="p-5 sm:p-6 border-t border-gray-100">
                <h4 className="font-bold text-[15px] text-gray-900 mb-1">Do you own a property in India?</h4>
                <p className="text-[13px] text-gray-600 mb-5">We take care of everything so you can enjoy complete peace of mind</p>
                <ul className="text-[13px] text-gray-700 space-y-3 mb-6 font-medium">
                  {["Tenant Discovery and Verification", "On-schedule rent transfers", "Move-in, move-out & regular inspections", "Keeping your home in excellent condition", "Complimentary rental agreement"].map((item, idx) => (
                    <li key={idx} className="flex gap-3 items-start sm:items-center">
                      <div className="bg-[#42998b] text-white rounded-full w-[18px] h-[18px] flex items-center justify-center text-[10px] shrink-0 mt-0.5 sm:mt-0">✔</div> {item}
                    </li>
                  ))}
                </ul>
                {/* Scroll Button */}
                <button onClick={scrollToForm} className="w-full bg-[#691E2E] hover:bg-[#581926] text-white py-3 rounded-lg text-sm font-semibold transition">Manage my Property</button>
              </div>
            )}
          </div>

          {/* Accordion 3: Legal Services */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 sm:h-40 bg-gray-900 text-white p-5 sm:p-6 flex flex-col justify-end relative bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center cursor-pointer select-none" onClick={() => toggleAccordion('legal')}>
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="absolute top-4 right-4 bg-white/20 p-1.5 rounded z-10 backdrop-blur-sm hover:bg-white/30 transition">
                <svg className={`transform transition-transform duration-300 ${!accordions.legal ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </div>
              <h3 className="font-bold text-xl sm:text-2xl relative z-10">Legal Services</h3>
              <p className="text-xs text-gray-300 italic mt-1 relative z-10">Be compliant. Be worry-free.</p>
            </div>
            {accordions.legal && (
              <div className="p-5 sm:p-6 border-t border-gray-100">
                <h4 className="font-bold text-[15px] text-gray-900 mb-2">Looking to buy or sell property in India??</h4>
                <p className="text-[13px] text-gray-600 mb-6 leading-relaxed">Get expert assistance with Power of Attorney, Lower TDS Certificate, Khata Transfer, ITR, and Capital Gains — ensuring full compliance, wherever you are.</p>
                {/* Scroll Button */}
                <button onClick={scrollToForm} className="w-full  text-white bg-[#691E2E] hover:bg-[#581926] py-3 rounded-lg text-sm font-semibold  transition">Book Legal Consultation</button>
              </div>
            )}
          </div>

          {/* Popular Services Accordion */}
          <div className="bg-white p-5 sm:p-7 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-1 cursor-pointer select-none" onClick={() => toggleAccordion('popular')}>
              <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900">Services NRIs rely on the most</h2>
              <div className="p-1.5 rounded hover:bg-gray-100 transition shrink-0">
                <svg className={`text-gray-500 transform transition-transform duration-300 ${!accordions.popular ? 'rotate-180' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
              </div>
            </div>
            {accordions.popular && (
              <div className="mt-4">
                <p className="text-[12px] text-gray-500 mb-4 italic">Be compliant. Be worry-free.</p>
                <p className="text-[13px] text-gray-600 mb-6 leading-relaxed">Our expert teams take care of it all — cleaning, maintenance, inspections, rentals, legal agreements, and full home makeovers.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { name: "Painting & Cleaning", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200" },
                    { name: "Property Inspections", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=200" },
                    { name: "Interior Design", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=200" },
                    { name: "Packers & Movers", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=200" },
                    { name: "Rental Agreement", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=200" }
                  ].map((s, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden group border border-gray-200 aspect-square flex flex-col items-center justify-end bg-gray-100 shadow-sm">
                      <div className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${s.img}')` }}></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                      <span className="relative z-10 text-white text-[11px] font-medium text-center p-2 leading-tight w-full">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comparison Table */}
          <div className="bg-white p-5 sm:p-7 rounded-xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 mb-1">Making property matters easy</h2>
            <p className="text-[12px] text-gray-500 mb-6 italic">Why NRIs Prefer NoWayBroker Over Traditional Brokers</p>
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full min-w-[500px] text-[13px] text-left">
                <thead className="bg-[#f8f9fa] text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 sm:px-5 font-bold">Offerings</th>
                    <th className="py-3 px-4 sm:px-5 font-bold text-center border-l border-gray-200">With NoWayBroker</th>
                    <th className="py-3 px-4 sm:px-5 font-bold text-center border-l border-gray-200">Without NoWayBroker</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800">
                  {["One-stop solution", "Dedicated Relationship Manager", "Transparent pricing", "Efficient service", "End-to-end assistance", "ZERO brokerage"].map((feature, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 sm:px-5 font-medium">{feature}</td>
                      <td className="py-3 px-4 sm:px-5 text-center border-l border-gray-200 text-[#42998b] font-bold text-lg">✔</td>
                      <td className="py-3 px-4 sm:px-5 text-center border-l border-gray-200 text-[#fd3752] font-bold text-lg">✘</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white p-5 sm:p-7 rounded-xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 mb-6">Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "LOKESH SINGH", loc: "UK", img: "https://i.pravatar.cc/100?img=11", text: "NoWayBroker has been like a genie in a bottle for renting my apartment. Special thanks to my Relationship Manager and Field RMs who supported me throughout — from finding tenants to finalizing the agreement." },
                { name: "RAJESH KUMAR", loc: "USA", img: "https://i.pravatar.cc/100?img=12", text: "Great service overall! NoWayBroker managed to rent my property in less than a month. The tenants were properly screened, and the team was quick with repairs and excellent in communication." },
                { name: "SUMIT MAHTRE", loc: "INDIA", img: "https://i.pravatar.cc/100?img=13", text: "The team at NoWayBroker Property Management is very responsive and efficient. They take care of everything — from tenant sourcing to timely rent collection and paperwork — making it completely hassle-free." }
              ].map((t, i) => (
                <div key={i} className="border border-gray-200 p-4 rounded-lg flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={t.img} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="text-[11px] font-bold text-gray-800 uppercase">{t.name}, {t.loc}</h4>
                        <div className="text-[#f5a623] text-[12px]">★★★★★</div>
                      </div>
                    </div>
                    <p className="text-[12px] text-gray-600 leading-relaxed line-clamp-5">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blogs */}
          <div className="bg-white p-5 sm:p-7 rounded-xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 mb-6">Blogs</h2>
            <div className="space-y-5">
              {[
                { title: "NRI Fund Transfers from India: RBI Guidelines, $1M Limit & Process (2024)", date: "15 Apr 2026", icon: <FaMoneyBillWave /> },
                { title: "Selling Property in India as an NRI: Tax, TDS & Repatriation Guide (2024)", date: "23 Apr 2026", icon: <FaFileAlt /> },
                { title: "Form 12BB Explained: Meaning, Eligibility & Filing Steps", date: "28 Apr 2026", icon: <FaChartBar /> },
                { title: "OCI Card Guide: Benefits, Eligibility & Rules in India (2024)", date: "3 Apr 2026", icon: <FaIdCard /> }
              ].map((blog, idx) => (
                <div key={idx} className="flex gap-4 items-center cursor-pointer group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-200 text-lg sm:text-xl shadow-sm">
                    {blog.icon}
                  </div>
                  <div>
                    <h4 className="text-[12px] sm:text-[13px] font-bold text-gray-800 group-hover:text-[#42998b] transition leading-tight mb-1">{blog.title}</h4>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium flex items-center gap-1">
                      <FaCalendarAlt className="text-[10px] sm:text-[11px]" /> {blog.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Text Section */}
          <div className="bg-white p-5 sm:p-7 rounded-xl shadow-sm border border-gray-200 transition-all duration-300">
            <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 mb-4">Why Choose NoWayBroker for NRI Property Management?</h2>
            <p className="text-[13px] text-gray-600 mb-4">With NoWayBroker’s NRI property management services, you benefit from complete assistance and full transparency. Here’s what to expect</p>

            <h3 className="text-[14px] font-bold text-gray-800 mt-4 mb-1">Complete Property Management</h3>
            <p className="text-[13px] text-gray-600 mb-4">Our services cover everything, so you can stay worry-free. We manage your property end-to-end, ensuring every task is handled efficiently. From tax filing and tenant verification to legal matters, NoWayBroker takes care of it all — making it the perfect one-stop solution for NRIs.</p>

            {showMoreSEO && (
             <div className="mt-4 animate-fade-in">
               <h3 className="text-[14px] font-bold text-gray-800 mt-4 mb-1">Local Knowledge</h3>
               <p className="text-[13px] text-gray-600 mb-4">Our team possesses strong knowledge of the local real estate market, making us a dependable NRI property management service in India.</p>
               <h3 className="text-[14px] font-bold text-gray-800 mt-4 mb-1">Clear Processes</h3>
               <p className="text-[13px] text-gray-600 mb-6">We focus on building trust with our clients. That’s why our NRI property services follow clear processes with no hidden costs. Every transaction is properly documented.</p>
             </div>
            )}

            <button
              onClick={() => setShowMoreSEO(!showMoreSEO)}
              className="text-[#42998b] font-bold text-[13px] mt-4 hover:underline focus:outline-none"
            >
              {showMoreSEO ? "Read Less" : "Read More"}
            </button>
          </div>

          {/* Frequently Asked Question's Section */}
          <div className="bg-white p-5 sm:p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-[20px] sm:text-[24px] text-[#222222] mb-4">
              Frequently Asked Question's
            </h2>

            <div className="flex flex-col">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 last:border-0">
                  <button
                    className="w-full text-left py-5 flex justify-between items-center focus:outline-none group"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className={`text-[14px] sm:text-[15px] font-bold pr-4 leading-snug transition-colors ${openFaq === index ? 'text-[#5465bd]' : 'text-[#333333]'}`}>
                      {faq.q}
                    </span>
                    <span className="text-gray-600 text-[20px] font-light shrink-0 leading-none ml-4">
                      {openFaq === index ? "✕" : "+"}
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr] opacity-100 pb-5' : 'grid-rows-[0fr] opacity-0 pb-0'}`}>
                    <div className="overflow-hidden">
                      <div className="text-[14px] text-gray-500 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT STICKY FORM (Ref is attached here) ================= */}
        <div ref={formRef} className="w-full lg:w-[40%] lg:sticky top-24 order-1 lg:order-2 mb-6 lg:mb-0">
          <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 relative">
            <h2 className="font-bold text-[16px] sm:text-[18px] text-gray-900 mb-2">Contact our Real Estate Experts</h2>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium whitespace-nowrap uppercase tracking-wider">
                Just fill up the form & we will take care of the rest
              </span>
              <div className="h-[1px] bg-gray-200 w-full"></div>
            </div>

            {/* FORM STARTS HERE */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                name="name"
                value={form.name}
                placeholder="Name"
                className="w-full border border-gray-300 p-3 rounded-lg text-[14px] outline-none focus:border-[#42998b] focus:ring-1 focus:ring-[#42998b] transition bg-white"
                onChange={handleChange}
              />

              <div>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#42998b] focus-within:ring-1 focus-within:ring-[#42998b] bg-white transition">
                  <input
                    name="phone"
                    value={form.phone}
                    placeholder="Phone Number"
                    className="w-full p-3 text-[14px] outline-none bg-white"
                    onChange={handleChange}
                  />
                </div>
                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 mt-1.5">*Enter your international number. We'll call you at no extra cost.</p>
              </div>

              <input
                name="email"
                value={form.email}
                placeholder="Email ID"
                className="w-full border border-gray-300 p-3 rounded-lg text-[14px] outline-none focus:border-[#42998b] focus:ring-1 focus:ring-[#42998b] transition bg-white"
                onChange={handleChange}
              />

              <div className="pt-2">
                <label className="text-[12px] sm:text-[13px] font-bold text-gray-800 block mb-2">Are you looking for</label>
                <div className="relative">
                  <div
                    className={`w-full border p-3 rounded-lg text-[14px] cursor-pointer flex justify-between items-center transition bg-white min-h-[46px] ${isDropdownOpen ? 'border-[#42998b] ring-1 ring-[#42998b]' : 'border-gray-300'}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className={form.service !== "" ? "text-gray-800" : "text-gray-400"}>
                      {form.service === "" ? "Service" : form.service}
                    </span>
                    <span className="text-gray-500 text-xs transform transition-transform duration-200">▼</span>
                  </div>

                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                      <div className="absolute top-[105%] left-0 w-full bg-[#e8f4f1] rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden py-2">
                        {serviceOptions.map((option, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-2 text-[13.5px] text-gray-800 hover:bg-[#d5ebe5] cursor-pointer flex items-center transition-colors"
                            onClick={() => handleServiceSelect(option)}
                          >
                            <span className="w-6 inline-block font-bold">
                              {form.service === option ? "✓" : ""}
                            </span>
                            {option}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-lg font-bold text-[14px] sm:text-[15px] mt-2 shadow-md transition-all flex justify-center items-center ${isLoading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#691E2E] hover:bg-[#581926] text-white hover:shadow-lg'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Check Price"
                )}
              </button>

              {submitMessage.text && (
                <div className={`mt-4 p-3 rounded-lg text-[13px] font-medium text-center transition-all ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {submitMessage.text}
                </div>
              )}
            </form>

            {/* BOTTOM TEXT (No Brokerage...) */}
            <div className="bg-[#f8f9fa] py-3 px-2 rounded-lg mt-6 border border-gray-200 flex justify-center items-center gap-2 sm:gap-3 text-[9px] sm:text-[11px] font-bold text-gray-700">
              <span>No Brokerage</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full shrink-0"></span>
              <span>Only end-to-end assistance</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full shrink-0"></span>
              <span>No Hidden Fees</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}