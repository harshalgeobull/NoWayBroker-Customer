import React from "react";
import PercentIcon from "@mui/icons-material/Percent";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import VideocamIcon from "@mui/icons-material/Videocam";
import SecurityIcon from "@mui/icons-material/Security";

const features = [
    {
        icon: <PercentIcon sx={{ fontSize: 28, color: "#8B1E3F" }} />,
        title: "Zero Brokerage",
        subtitle: "No hidden charges",
    },
    {
        icon: <VerifiedUserIcon sx={{ fontSize: 28 }} />,
        title: "Verified Owners",
        subtitle: "100% verified listings",
    },
    {
        icon: <AutoAwesomeIcon sx={{ fontSize: 28 }} />,
        title: "AI Technology Match",
        subtitle: "Smart recommendation",
    },
    {
        icon: <VideocamIcon sx={{ fontSize: 28 }} />,
        title: "Virtual Tour",
        subtitle: "360° property view",
    },
    {
        icon: <SecurityIcon sx={{ fontSize: 28 }} />,
        title: "Secure & Safe",
        subtitle: "Fraud detection",
    },
];

const FeaturesSection = () => {
    return (
        // <section className="w-full mt-2 mb-2">
        //     <div className="max-w-[94%] xl:max-w-[93%] mx-auto">

        //         <div className="overflow-hidden bg-white border border-gray-200 rounded-3xl shadow-sm">

        //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">

        //                 {features.map((item, index) => (
        //                     <div
        //                         key={index}
        //                         className={`
        //                 flex items-center gap-4
        //                 px-5 py-6
        //                 transition-all duration-300
        //                 hover:bg-[#FAFAFA]

        //                 border-b lg:border-b-0 border-gray-200
        //                 ${index !== features.length - 1 ? "lg:border-r" : ""}
        //             `}
        //                     >

            <section className="w-full mt-2 mb-2">
    <div className="max-w-[94%] xl:max-w-[93%] mx-auto">

        <div className="overflow-hidden bg-white border border-gray-200 rounded-3xl shadow-sm">

            <div className="flex overflow-x-auto lg:grid lg:grid-cols-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                {features.map((item, index) => (
                    <div
                        key={index}
                        className={`
                            flex items-center gap-4
                            min-w-[280px] sm:min-w-[320px] lg:min-w-0
                            px-5 py-6
                            transition-all duration-300
                            hover:bg-[#FAFAFA]
                            border-gray-200
                            ${index !== features.length - 1 ? "lg:border-r" : ""}
                        `}
                    >
                        <div className="flex items-center justify-center flex-shrink-0 w-14 h-14 rounded-full bg-[#FDECEC] text-[#8B1E3F]">
                            {item.icon}
                        </div>

                        <div>
                            <h3 className="text-[17px] font-semibold text-[#1E293B] leading-5">
                                {item.title}
                            </h3>

                            <p className="mt-1 text-[12px] text-[#6B7280] leading-5">
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