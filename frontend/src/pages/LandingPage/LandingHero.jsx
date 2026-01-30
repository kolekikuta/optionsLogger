import React from "react"
import { Link } from "react-router-dom"
import { Button } from '@/components/ui/button'
import { motion } from "motion/react";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function LandingHero() {


    return (
        <section className="relative min-h-screen flex items-center justify-center">
            {/* Animated background gradient orbs */}
            <div className="absolute inset-0 w-full">
                <motion.div
                className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                />
                <motion.div
                className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
                animate={{
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                />
            </div>

            <div className="relative mx-auto px-6 py-24 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left column - Text content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-500/30"
                    >
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Smart Options Tracking</span>
                    </motion.div>

                    <h1 className="text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                    Track Your Options.
                    <br />
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Own Your Future.
                    </span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
                    The simplest way to log, analyze, and optimize your stock options
                    trades. Make smarter decisions with powerful insights.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/sign-up">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 px-8 py-6 text-lg"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-emerald-500 px-8 py-6 text-lg"
                    >
                        View Demo
                    </Button>
                    </div>

                </motion.div>

                {/* Right column - Visual */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative"
                >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10" />
                    <img
                        src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
                        alt="Options trading dashboard"
                        className="w-full h-auto"
                    />
                    </div>

                    {/* Floating card elements */}
                    <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -bottom-6 -left-6 bg-gray-900 rounded-xl shadow-xl p-4 border border-gray-800"
                    >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                        <div className="text-sm text-gray-500">Total P&L</div>
                        <div className="text-xl font-bold text-emerald-400">+$12,450</div>
                        </div>
                    </div>
                    </motion.div>

                    <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-6 -right-6 bg-gray-900 rounded-xl shadow-xl p-4 border border-gray-800"
                    >
                    <div className="text-sm text-gray-500 mb-1">Win Rate</div>
                    <div className="text-2xl font-bold text-white">73.5%</div>
                    </motion.div>
                </motion.div>
                </div>
            </div>
        </section>
    );
}