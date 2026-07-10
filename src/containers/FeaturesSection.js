import React from "react";
import PercentIcon from "@mui/icons-material/Percent";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import VideocamIcon from "@mui/icons-material/Videocam";
import SecurityIcon from "@mui/icons-material/Security";

const features = [
    {
        icon: <PercentIcon sx={{ fontSize: 34 }} />,
        title: "Zero Brokerage",
        subtitle: "No hidden charges",
    },
    {
        icon: <VerifiedUserIcon sx={{ fontSize: 34 }} />,
        title: "Verified Owners",
        subtitle: "100% verified listings",
    },
    {
        icon: <AutoAwesomeIcon sx={{ fontSize: 34 }} />,
        title: "AI Property Match",
        subtitle: "Smart recommendation",
    },
    {
        icon: <VideocamIcon sx={{ fontSize: 34 }} />,
        title: "Virtual Tour",
        subtitle: "360° property view",
    },
    {
        icon: <SecurityIcon sx={{ fontSize: 34 }} />,
        title: "Secure & Safe",
        subtitle: "Fraud detection",
    },
];

const FeaturesSection = () => {
    return (
        <section className="w-full mt-10 mb-10">
            <div className="w-full max-w-[97%] mx-auto">

                <div className="w-full overflow-hidden bg-white border border-gray-200 shadow-xl rounded-3xl">

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5">

                        {features.map((item, index) => (
                            <div
                                key={index}
                                className={`
                  flex items-center gap-5
                 px-8 py-10 lg:py-12
                  transition-all duration-300
                  hover:bg-gray-50

                  border-b border-gray-200
                  xl:border-b-0

                  ${index !== features.length - 1
                                        ? "xl:border-r border-gray-200"
                                        : ""
                                    }
                `}
                            >
                                <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 rounded-full bg-green-50 text-green-600">
                                    {item.icon}
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500">
                                        {item.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;