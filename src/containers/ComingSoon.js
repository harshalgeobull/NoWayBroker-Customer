import React, { useState , useEffect } from "react";
import { Helmet } from "react-helmet";
import { Mail, Bell, ShieldCheck, Users, Headphones } from "lucide-react";

const ComingSoon = (props) => {
  const { city_name } = props.match.params;
  const cityName = decodeURIComponent(city_name);

  useEffect(() => {
  window.scrollTo(0, 0);
}, [city_name]);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitted(true);
    setEmail("");

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      <Helmet>
        <title>NOWAYBROKER</title>
        <meta
          name="description"
          content={`NowayBroker is coming soon to ${cityName}. Be the first to know when we launch.`}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <main className="w-full overflow-hidden bg-white">
        {/* =========================================================
            HERO SECTION
        ========================================================= */}
        <section className="relative w-full overflow-hidden">
          {/* Background Image
              IMPORTANT:
              Image is inside public/image/
              Therefore use /image/... directly.
          */}
          <img
            src="/image/coming-soon-city.png"
            alt="City skyline"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center

              max-lg:object-[62%_center]
              max-md:object-[68%_center]
              max-sm:object-[72%_center]
            "
          />

          {/* Desktop gradient */}
          <div
            className="
              absolute
              inset-0
              hidden
              bg-gradient-to-r
              from-white
              via-white/95
              via-[42%]
              to-transparent
              lg:block
            "
          />

          {/* Tablet gradient */}
          <div
            className="
              absolute
              inset-0
              hidden
              bg-gradient-to-r
              from-white
              via-white/90
              via-[46%]
              to-white/10
              md:block
              lg:hidden
            "
          />

          {/* Mobile gradient */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-white
              via-white/90
              via-[42%]
              to-white/20

              md:hidden
            "
          />

          {/* Additional mobile bottom overlay */}
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-[35%]
              bg-gradient-to-t
              from-white/90
              to-transparent

              md:hidden
            "
          />

          {/* "Bigger Possibilities Ahead" script tag over the image */}
          <div
            className="
              absolute
              right-[6%]
              top-[8%]
              z-10
              hidden
              text-right
              lg:block
            "
          >
            <p
              className="text-[30px] leading-[1.15] text-[#12203F]"
              style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
            >
              Bigger
              <br />
              Possibilities
              <br />
              Ahead
            </p>
            <svg
              className="ml-auto mt-1 w-24 text-[#7A1D3D]"
              viewBox="0 0 100 12"
              fill="none"
            >
              <path
                d="M2 8C25 2 55 2 98 9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Hero Content */}
          <div
            className="
              relative
              z-10
              mx-auto
              flex
              min-h-[600px]
              w-full
              max-w-[1500px]
              items-center

              px-[55px]
              py-[70px]

              max-xl:px-10

              max-lg:min-h-[560px]
              max-lg:px-8
              max-lg:py-[60px]

              max-md:min-h-[640px]
              max-md:px-6
              max-md:py-[50px]

              max-sm:min-h-[680px]
              max-sm:px-5
              max-sm:py-[42px]

              max-[400px]:px-4
            "
          >
            <div
              className="
                w-full
                max-w-[560px]

                max-lg:max-w-[520px]

                max-md:mx-auto
                max-md:max-w-[600px]
                max-md:text-center
              "
            >
              {/* Eyebrow */}
              <p
                className="
                  mb-3
                  text-[13px]
                  font-bold
                  uppercase
                  tracking-[2px]
                  text-[#7A1D3D]

                  max-sm:text-[11px]
                  max-sm:tracking-[1.5px]
                "
              >
                New Cities. More Opportunities.
              </p>

              {/* Heading */}
              <h1
                className="
                  text-[54px]
                  font-extrabold
                  leading-[1.05]
                  tracking-[-1.5px]
                  text-[#111C33]

                  max-xl:text-[48px]

                  max-lg:text-[44px]

                  max-md:text-[40px]

                  max-sm:text-[34px]

                  max-[400px]:text-[30px]
                "
              >
                Coming Soon!
              </h1>

              <span
                className="
                  mt-3
                  block
                  h-[3px]
                  w-[110px]
                  rounded-full
                  bg-[#7A1D3D]

                  max-md:mx-auto
                "
              />

              {/* Description */}
              <p
                className="
                  mt-6
                  max-w-[480px]
                  text-[17px]
                  leading-7
                  text-gray-600

                  max-md:mx-auto
                  max-md:mt-5
                  max-md:max-w-[500px]
                  max-md:text-[16px]
                  max-md:leading-6

                  max-sm:text-[15px]
                  max-sm:leading-6
                "
              >
                We're preparing to bring verified properties, trusted
                owners and a better real estate experience to {cityName}.
              </p>

              {/* Email Form */}
              <form
                onSubmit={handleSubmit}
                className="
                  mt-7
                  flex
                  w-full
                  max-w-[560px]
                  items-center
                  gap-3

                  max-md:mx-auto

                  max-sm:flex-col
                  max-sm:gap-3
                "
              >
                <div
                  className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3.5
                    shadow-sm

                    max-sm:w-full
                  "
                >
                  <Mail size={18} className="shrink-0 text-gray-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="
                      w-full
                      min-w-0
                      border-none
                      bg-transparent
                      text-sm
                      text-gray-800
                      outline-none
                      placeholder:text-gray-400
                    "
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-[#7A1D3D]
                    px-6
                    py-3.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    duration-200
                    hover:bg-[#5F1730]
                    active:scale-[0.98]

                    max-sm:w-full
                  "
                >
                  <Bell size={16} />
                  Notify Me
                </button>
              </form>

              {/* Success / Privacy line */}
              {submitted ? (
                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-green-600

                    max-md:justify-center
                  "
                >
                  <ShieldCheck size={17} />
                  Thank you! We'll keep you updated.
                </div>
              ) : (
                <p
                  className="
                    mt-3
                    text-xs
                    text-gray-500

                    max-md:text-center
                  "
                >
                  Be the first to know when we launch in {cityName}.
                </p>
              )}

              {/* Trust points */}
              <div
                className="
                  mt-9
                  flex
                  items-center
                  gap-8

                  max-md:justify-center
                  max-md:gap-6

                  max-sm:flex-wrap
                  max-sm:justify-center
                  max-sm:gap-x-6
                  max-sm:gap-y-4
                "
              >
                <TrustPoint icon={<ShieldCheck size={19} />}>
                  Verified
                  <br />
                  Properties
                </TrustPoint>

                <TrustPoint icon={<Users size={19} />}>
                  Genuine
                  <br />
                  Owners
                </TrustPoint>

                <TrustPoint icon={<Headphones size={19} />}>
                  Reliable
                  <br />
                  Support
                </TrustPoint>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

/* =========================================================
   TRUST POINT
========================================================= */

const TrustPoint = ({ icon, children }) => {
  return (
    <div className="flex items-center gap-3">
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#FBEAEF]
          text-[#7A1D3D]
        "
      >
        {icon}
      </div>

      <span className="text-[13px] font-semibold leading-[1.25] text-gray-800">
        {children}
      </span>
    </div>
  );
};

export default ComingSoon;