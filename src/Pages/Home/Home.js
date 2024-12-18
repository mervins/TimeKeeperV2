import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import BG from "../../assets/bg.webp";
import ABOUT from "../../assets/about.webp";
import { BiStopwatch } from "react-icons/bi";
import { IoMdTrendingUp, IoMdDesktop, IoMdClipboard } from "react-icons/io";
import { ImSortAmountDesc } from "react-icons/im";
import Step1Image from "../../assets/step1.webp";
import Step2Image from "../../assets/step2.webp";
import Step3Image from "../../assets/stage3.webp";
import Step4Image from "../../assets/stage4.webp";
import Step5Image from "../../assets/stage5.webp";
import mainLogo from "../../assets/logo.png";
import "./home.css";

export default function Home() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const featuresRef = useRef(null);
    const gettingStartedRef = useRef(null);
    const homeRef = useRef(null);

    const steps = [
        { title: "Set Up Categories", description: "Create categories that best represent the race formats, such as Enduro, Downhill, or Cross Country.", image: Step1Image },
        { title: "Add Race Stages", description: "Define and customize stages for each category, including start and end points, and terrain type.", image: Step2Image },
        { title: "Add Rider", description: "With categories and stages created, add rider profiles, inputting details like name, and category assignment. This ensures each rider is accurately timed within the chosen setup.", image: Step3Image },
        { title: "Record Rider Times", description: "Log the time for each rider at each stage for accurate performance tracking and leaderboard ranking.", image: Step4Image },
        { title: "Evaluate Performance", description: "Automatically grade riders based on their times and calculate overall performance scores.", image: Step5Image },
        { title: "View Results Offline", description: "Access the final leaderboard and individual stats on any device, even offline.", image: ABOUT },
    ];

    const openModal = (image) => {
        setSelectedImage(image);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setModalOpen(false);
    };

    const scrollToSection = (ref) => {
        // const offsetPosition = ref.current.offsetTop - 80; // 80px offset from top for navbar height
        // window.scrollTo({
        //     top: offsetPosition,
        //     behavior: "smooth",
        // });
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white backdrop-blur-sm shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center  md:justify-between h-16">
                        <div className="relative w-[10%]">
                            <img src={mainLogo}/>
                        </div>
                        <div className="">
                            <div className="flex items-center space-x-8 ">
                                <a  className=" font-semibold cursor-pointer text-[#2f2051]" onClick={() => scrollToSection(homeRef)}>Home</a>
                                <a  className="font-semibold cursor-pointer text-[#2f2051]" onClick={() => scrollToSection(featuresRef)}>About</a>
                                <a  className=" font-semibold cursor-pointer text-[#2f2051]" onClick={() => scrollToSection(gettingStartedRef)}>Todo</a>
                                <Link to="/participants" className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md">
                                    Explore
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative h-screen" ref={homeRef}>
                <div className="absolute inset-0 top-[15px]">
                    <img src={BG} className="w-full h-full object-cover" alt="Mountain biker at sunset" />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex flex-col justify-center h-full pt-16">
                        <h1 className="text-6xl font-bold text-white mb-4" style={{ fontFamily: "monospace" }}>
                            EXPLORE<br />ENDURO & DOWNHILL
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl mb-8">
                            Discover the thrilling world of Enduro Mountain Biking, where adrenaline-fueled adventures await. Tackle rugged trails and push your limits.
                        </p>
                        <Link to="/timer" className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-md w-fit text-lg font-semibold">
                            Time with Us
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20 bg-gray-50" ref={featuresRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-16" style={{ fontFamily: "monospace" }}>
                        ABOUT TIMER SYSTEM
                    </h2>
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <img src={ABOUT} className="rounded-lg shadow-xl" alt="Mountain biker jumping" />
                        </div>
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-4">
                                <FeatureItem icon={<ImSortAmountDesc className="h-6 w-6" />} title="Dynamic Category & Stage Creation" description="Easily create and customize categories and stages to suit different race formats and rider types, allowing flexibility in event setup" />
                                <FeatureItem icon={<IoMdClipboard className="h-6 w-6" />} title="Individual Rider Timing" description="Automatically track and record each rider's timing on every stage, ensuring accurate performance data for each competitor" />
                                <FeatureItem icon={<IoMdTrendingUp className="h-6 w-6" />} title="Performance Grading" description="Calculate and assign performance grades to each rider based on their stage times, using customizable grading criteria to match race standards" />
                                <FeatureItem icon={<BiStopwatch className="h-6 w-6" />} title="Real-Time Leaderboard Sorting" description="Display a dynamic leaderboard that ranks riders by their shortest times across stages, updating in real-time as results are logged" />
                                <FeatureItem icon={<IoMdDesktop className="h-6 w-6" />} title="Offline Accessibility on Mobile, Tablet, and Computer" description="Use the system seamlessly across devices, including mobile, tablet, and desktop, with offline functionality to ensure timing and data entry are uninterrupted even without internet access" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TODO Section */}
            <section className="py-20 bg-white" ref={gettingStartedRef}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-16" style={{ fontFamily: "monospace" }}>
                        GETTING STARTED
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                <div className="absolute top-8 left-8 bg-yellow-400 text-white font-bold rounded-full h-10 w-10 flex items-center justify-center">
                                    {index + 1}
                                </div>
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="w-full h-40 object-cover mb-4 rounded-md cursor-pointer transition-transform duration-300 hover:scale-105"
                                    onClick={() => openModal(step.image)}
                                />
                                <h3 className="text-xl font-semibold text-center mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-center">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal for Image Enlargement with Fade-in Animation */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-opacity duration-300 ease-in-out animate-fade-in"
                    onClick={closeModal}
                >
                    <div className="relative max-w-7xl w-full mx-4 transform transition-transform duration-300 ease-in-out animate-scale-up">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-white text-2xl">
                            &times;
                        </button>
                        <img src={selectedImage} alt="Enlarged Step" className="w-full h-auto rounded-lg shadow-lg" />
                    </div>
                </div>
            )}
        </div>
    );
}

function FeatureItem({ icon, title, description }) {
    return (
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 bg-yellow-400 p-2 rounded-lg">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
}
