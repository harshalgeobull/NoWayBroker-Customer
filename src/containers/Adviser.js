import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Adviser = ({ data }) => {
  const [propertyCounts, setPropertyCounts] = useState({
    Owner: 0,
    Broker: 0,
    Developer: 0,
  });
  const [ownerPropertyCount, setOwnerPropertyCount] = useState(0);
  const [agentPropertyCount, setAgentPropertyCount] = useState(0);
  const [builderPropertyCount, setBuilderPropertyCount] = useState(0);
  const [upcomingProjectCount, setUpcomingProjectCount] = useState(0);
  const [rawCounts, setRawCounts] = useState({
    owner: 0,
    agent: 0,
    builder: 0,
  });

  const fetchCounts = async () => {
    try {
      if (data && data.status === 1 && Array.isArray(data.data)) {
        const {
          owner_property_count,
          agent_property_count,
          builder_property_count,
        } = data;

        animateCount(owner_property_count, setOwnerPropertyCount);
        animateCount(agent_property_count, setAgentPropertyCount);
        animateCount(builder_property_count, setBuilderPropertyCount);
        animateCount(20, setUpcomingProjectCount);
      }
    } catch (error) {
      console.error("Error fetching property counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [data]);

  const animateCount = (target, setFn) => {
    let count = 0;
    const maxDisplay = target > 50 ? 50 : target;

    const interval = setInterval(() => {
      count++;
      if (count >= maxDisplay) {
        clearInterval(interval);
        setFn(target > 50 ? "50+" : target);
      } else {
        setFn(count);
      }
    }, 50);
  };

  return (
    <div className="bg-white py-6">
      <div className="max-w-9xl mx-auto px-10">
        <h2 className="text-2xl sm:text-4xl text-gray-900 ">Select Category</h2>
        <p className="text-gray-500 mb-8 text-[18px]">
          Go from browsing to buying
        </p>
        {/* adviser Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* adviser 1 */}
          <Link
            to={`/advisordashboard?label=Owner`}
            className="flex items-center bg-slate-100 rounded-2xl 
            transform hover:scale-105 p-3 no-underline text-gray-800 hover:no-underline"
          >
            <div
              className="w-1/3
            "
            >
              <div className="w-full h-16 mb-2">
                <img
                  src="/image/commercial.jpg"
                  alt="Buying property"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="flex space-x-2">
                <div className="w-full h-16">
                  <img
                    src="/image/commercial.jpg"
                    alt="Buying property"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="w-full h-16">
                  <img
                    src="/image/commercial.jpg"
                    alt="Buying property"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 w-1/2">
              <h3 className="text-3xl font-semibold text-rose-800 mb-2">
                {ownerPropertyCount}
              </h3>
              <p className="text-md text-gray-600 font-bold">Owner</p>
              <p className="text-lg my-text flex items-center">
                Explore <span className="ml-2 text-rose-800">&#8594;</span>
              </p>
            </div>
          </Link>

          {/* adviser 2 */}
          {/* <Link
            to={`/advisordashboard?label=Agent`}
            className="flex items-center bg-slate-100 rounded-2xl  transform hover:scale-105 p-3 no-underline text-gray-800 hover:no-underline"
          >
            <div className="w-1/3">
              <div className="w-full h-16 mb-2">
                <img
                  src="/image/leasing.jpg"
                  alt="Leasing property"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="flex space-x-2">
                <div className="w-1/2 h-16">
                  <img
                    src="/image/leasing.jpg"
                    alt="Leasing property"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="w-1/2 h-16">
                  <img
                    src="/image/leasing.jpg"
                    alt="Leasing property"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 w-1/2">
              <h3 className="text-3xl font-semibold text-rose-800 mb-2">
                {agentPropertyCount}
              </h3>
              <p className="text-md text-gray-600 font-bold">Agent</p>
              <p className="text-lg my-text flex items-center">
                Explore <span className="ml-2 text-rose-800">&#8594;</span>
              </p>
            </div>
          </Link> */}

          {/* adviser 3 */}
          <Link
            to={`/advisordashboard?label=Builder`}
            className="flex items-center bg-slate-100 rounded-2xl transform hover:scale-105 p-3 no-underline text-gray-800 hover:no-underline"
          >
            <div className="w-1/3">
              <div className="w-full h-16 mb-2">
                <img
                  src="/image/plots.jpg"
                  alt="Buy Plots/Land"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              <div className="flex space-x-2">
                <div className="w-1/2 h-16">
                  <img
                    src="/image/plots.jpg"
                    alt="Buy Plots/Land"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="w-1/2 h-16">
                  <img
                    src="/image/plots.jpg"
                    alt="Buy Plots/Land"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 w-1/2">
              <h3 className="text-3xl font-semibold text-rose-800 mb-2">
                {builderPropertyCount}
              </h3>
              <p className="text-md text-gray-600 font-bold">Builders</p>
              <p className="text-lg my-text flex items-center">
                Explore <span className="ml-2 text-rose-800">&#8594;</span>
              </p>
            </div>
          </Link>


          {/* adviser 3 - Upcoming Projects */}

          <Link
            to={`/advisordashboard?label=Builder`}
            className="flex items-center bg-slate-100 rounded-2xl transform hover:scale-105 p-3 no-underline text-gray-800 hover:no-underline"
          >
            <div className="w-1/3">

              <div className="w-full h-16 mb-2">
                <img
                  src="/image/BuilderProject.jpg"
                  alt="Upcoming Projects"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div className="flex gap-2">

                <div className="w-1/2 h-16">
                  <img
                    src="/image/BuilderProject.jpg"
                    alt=""
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                <div className="w-1/2 h-16">
                  <img
                    src="/image/BuilderProject.jpg"
                    alt=""
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

              </div>

            </div>

            <div className="ml-4 w-1/2">

              <h3 className="text-3xl font-semibold text-rose-800 mb-2">
                {upcomingProjectCount}{typeof upcomingProjectCount === "number" && upcomingProjectCount === 20 ? "+" : ""}
              </h3>

              <p className="text-md text-gray-700 font-bold">
                Upcoming Projects
              </p>

              <p className="text-lg my-text flex items-center">
                Explore
                <span className="ml-2 text-rose-800">
                  →
                </span>
              </p>

            </div>

          </Link>
        </div>
      </div>
    </div>
  );
};

export default Adviser;