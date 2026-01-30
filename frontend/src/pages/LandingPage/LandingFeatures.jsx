import { motion } from "motion/react";
import {
  BarChart3,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track your performance with detailed charts, metrics, and insights to improve your trading strategy.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description:
      "Log trades instantly and see your portfolio update in real-time with lightning-fast performance.",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Smart Tracking",
    description:
      "Automatically calculate P&L, Greeks, and key metrics for every trade. Never miss important details.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Set alerts, manage position sizes, and get notified when trades need attention.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: TrendingUp,
    title: "Performance Insights",
    description:
      "Understand what's working with detailed win/loss analysis and strategy breakdowns.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your data is encrypted and protected. We never share your trading information.",
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function LandingFeatures() {
  return (
    <section className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 text-white">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful features designed for serious options traders who want to
            level up their game.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
