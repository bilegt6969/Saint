"use client";

import { cn } from "@/functions";
import { ArrowRightIcon, XIcon, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icons from "./global/icons";
import Wrapper from "./global/wrapper";
import { Button } from "./ui/button";
import Menu from "./menu";
import MobileMenu from "./mobile-menu";
import Logo from "../../public/Logo.svg";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AuthButton from "../app/auth/AuthButton";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [recentSearches, setRecentSearches] = useState<string[]>(["Zoom Kobe 6 Protro 'All-Star - Sail'", "Air Foamposite One 'Galaxy' 2025", "Kobe 6"]);
    const [isOpen1, setIsOpen1] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const placeholders = [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?",
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        console.log(e.target.value);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?query=${searchQuery.trim()}`);
            setIsOpen1(false);  // Close the modal after submission
        }
        console.log("submitted");
    };

    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen || isModalOpen || isOpen1) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, isModalOpen, isOpen1]);

    // ESC key close modal functionality
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isOpen1) {
                setIsOpen1(false);
            }
        };

        if (isOpen1) {
            window.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen1]);

    return (
        <div className="relative w-full h-full">
            <div className="z-[99] fixed pointer-events-none inset-x-0 h-[88px] bg-[rgba(31,31,31,0.82)] backdrop-blur-sm [mask:linear-gradient(to_bottom,#000_20%,transparent_calc(100%-20%))]"></div>

            <header
                className={cn(
                    "fixed top-4 inset-x-0 mx-auto max-w-6xl px-2 md:px-12 z-[100] transform th",
                    isOpen ? "h-[calc(100%-24px)]" : "h-12"
                )}
            >
                <Wrapper className="backdrop-blur-lg backdrop-brightness-60 rounded-xl lg:rounded-3xl border border-[rgba(124,124,124,0.2)] px- md:px-2 flex items-center justify-start">
                    <div className="flex items-center justify-between w-full sticky mt-[7px] lg:mt-auto mb-auto inset-x-0">
                        <div className="flex items-center flex-1 lg:flex-none pl-0">
                            {/* Logo Section */}
                            <Link
                                href="/"
                                className="text-lg font-semibold transition-colors text-foreground bg-[#232323] hover:bg-neutral-900 py-0 px-[5px] rounded-full border border-neutral-700 flex items-center"
                            >
                                <Image
                                    height={60}
                                    width={60}
                                    src={Logo}
                                    alt="Saint Logo"
                                    className="transition-transform duration-300 transform px-1"
                                />
                            </Link>
                            <div className="items-center hidden ml-4 lg:flex">
                                <Menu />
                            </div>
                        </div>
                        <div className="items-center flex gap-2 lg:gap-4">
                            {/* Open Modal Button */}
                            <Button
                                size="sm"
                                variant="tertiary"
                                onClick={() => setIsOpen1(true)}
                                className="hover:translate-y-[1px] hover:scale-100 rounded-full border border-neutral-700"
                            >
                                <Search className="w-4 h-4 mr-1 hidden lg:block" />
                                Search
                            </Button>

                            {/* AuthButton Component for Sign In/Out */}
                            <AuthButton />

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="lg:hidden p-2 w-8 h-8"
                            >
                                {isOpen ? (
                                    <XIcon className="w-4 h-4 duration-300" />
                                ) : (
                                    <Icons.menu className="w-3.5 h-3.5 duration-300" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
                </Wrapper>
            </header>

            {/* Modal with Blur Effect */}
            {isOpen1 && (
                <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="backdr backdrop-brightness-80 backdrop-blur-2xl border border-neutral-700 rounded-3xl w-[500px] p-6 shadow-2xl relative"
                    >
                       

                        <PlaceholdersAndVanishInput
                            placeholders={placeholders}
                            onChange={handleChange} 
                            onSubmit={onSubmit}
                        />

                        <div className="mt-6 text-neutral-400">
                            <h3 className="text-sm text-neutral-500 mb-2">Recent Searches</h3>
                            {recentSearches.length ? (
                                <ul className="space-y-2">
                                    {recentSearches.map((search, index) => (
                                        <li key={index} className="cursor-pointer hover:text-white transition-all duration-200 flex items-center">
                                            <ChevronRight className="w-4 h-4 text-neutral-500 mr-2"/> {search}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center">No recent searches</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Navbar;