import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const About = () => {
    const [topSeller, setTopSeller] = useState([]);
    const [realtors, setRealtors] = useState([]);
    

    useEffect(() => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const getTopSeller = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/realtors/topseller/`,
                    config
                );
                setTopSeller(res.data);
            } catch (err) {
                console.log("Error fetching top sellers:", err);
            }
        };

        const getRealtors = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/realtors/`,
                    config
                );
                setRealtors(res.data);
            } catch (err) {
                console.log("Error fetching realtors:", err);
            }
        };

        getTopSeller();
        getRealtors();
    }, []);

	const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
	const setting = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3.5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <main className="about">
            <Helmet>
                <title>Real Estate - About</title>
                <meta name="description" content="About us" />
            </Helmet>

            <section className="container my-3">
                <div className="row">
                    <div className="col-md-9">
                        <h1 className="subheading-about py-3">
                            We find the perfect home for you
                        </h1>
                        <p className="text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Sed vitae sapien a diam eleifend faucibus. Suspendisse
                            vitae sodales leo. Proin hendrerit aliquam interdum.
                            Maecenas tellus ante, ultrices id justo id, venenatis
                            hendrerit orci. Orci varius natoque penatibus et magnis
                            dis parturient montes, nascetur ridiculus mus. Praesent
                            aliquam condimentum ligula eget ullamcorper.
                        </p>
                        <div className="about__display">
                            <img
                                src="https://pbs.twimg.com/media/EYuaH_GWkAAsA5A.jpg"
                                alt="Cristiano Ronaldo Ghar"
                                width="100%"
                                height="auto"
                            />
                        </div>
                        <p className="text-justify mt-3">
                            Suspendisse gravida magna posuere purus laoreet, et
                            elementum velit placerat. Fusce at convallis erat.
                            Curabitur placerat eros eu interdum lacinia. Nulla
                            facilisi. Duis pretium tristique porta. Donec vehicula est
                            a massa interdum vehicula. Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit. Mauris malesuada lacus
                            mauris, eu ultrices neque egestas eu. Class aptent taciti
                            sociosqu ad litora torquent per conubia nostra, per
                            inceptos himenaeos. Morbi elementum enim vitae purus
                            pulvinar tincidunt. Aenean id viverra leo, non vehicula
                            odio. Vestibulum volutpat a nulla at mattis. Nam cursus
                            semper sapien, eu consequat lacus iaculis vel.
                        </p>
                    </div>
					<div className="col-md-3">
                        <div className="heading-component mb-4">
                            <h2>Top Sellers</h2>
                        </div>
                        <Slider {...settings}>
                            {topSeller.map((seller, index) => (
                                <div key={index}>
                                    <figure>
                                        <img
                                            src={seller.photo}
                                            alt={seller.name}
                                            width="100%"
                                            height="auto"
                                        />
                                    </figure>
                                    <div className="details-realtor">
                                        <h2>{seller.name}</h2>
                                        <h5>{seller.phone}</h5>
                                        <h5 className="pb-3">{seller.email}</h5>
                                        <p className="text-justify" style={{ color: "black" }}>
                                            {seller.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </section>

			<section className="container my-4">
                <h1 className="subheading-about py-3">Meet our awesome team!</h1>
                <Slider {...setting}>
                    {realtors.map((realtor, index) => (
                        <div className="col-md-12" key={index} style={{ textAlign: "center" }}>
                            <div className="other-realters-card" style={{ display: "inline-block" }}>
                                <figure style={{ textAlign: "center" }}>
                                    <img
                                        src={realtor.photo}
                                        alt={realtor.name}
                                        className="img-fluid rounded"
										style={{ display: "inline-block" }}
                                    />
                                </figure>
                                <div className="details-realtor p-3">
                                    <h2 className="mb-2">{realtor.name}</h2>
                                    <h5 className="mb-2">{realtor.phone}</h5>
                                    <h5 className="mb-3">{realtor.email}</h5>
                                    <p className="text-muted mb-0">
                                        {realtor.description.length < 120
                                            ? realtor.description
                                            : realtor.description.substring(0, 120) + "..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>
        </main>
    );
};

export default About;
