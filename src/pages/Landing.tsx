import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 md:py-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-30" />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              Empower Your Learning Journey
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto"
            >
              Transform your educational experience with intelligent assistance and comprehensive study tools.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500">
                Get Started
              </Button>
              <Button variant="ghost" size="lg">
                Learn more →
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-8 bg-white rounded-2xl shadow-sm ring-1 ring-gray-100"
              >
                <div className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Choose Your Plan
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Select the perfect package for your learning needs
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-8 bg-white rounded-2xl shadow-sm ring-1 ${
                  plan.featured ? 'ring-indigo-600' : 'ring-gray-100'
                }`}
              >
                <div className="text-xl font-semibold text-gray-900 mb-4">
                  {plan.name}
                </div>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 w-full ${
                    plan.featured
                      ? 'bg-indigo-600 hover:bg-indigo-500'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Stay Updated
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get the latest updates and educational resources delivered to your inbox
            </p>
            <div className="mt-8 flex max-w-md mx-auto gap-x-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-auto"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-500">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    title: "Smart Learning Assistant",
    description: "Get instant help with your homework and study materials using our AI-powered learning assistant."
  },
  {
    title: "Comprehensive Resources",
    description: "Access a vast library of educational materials, practice questions, and study guides."
  },
  {
    title: "Progress Tracking",
    description: "Monitor your learning progress with detailed analytics and personalized insights."
  }
];

const pricingPlans = [
  {
    name: "Basic",
    price: "39.99",
    features: [
      "30+ Features",
      "Priority Support",
      "4 Team Members",
      "Premium Features",
      "Data Insights"
    ]
  },
  {
    name: "Standard",
    price: "69.99",
    featured: true,
    features: [
      "Access 80+ Enterprise Features",
      "Priority Support",
      "10 Team Members",
      "Premium Features",
      "Unlimited Data Insights"
    ]
  },
  {
    name: "Enterprise",
    price: "Contact",
    features: [
      "Access All Features",
      "Priority Support",
      "Unlimited Members",
      "Premium Features",
      "Unlimited Data Insights"
    ]
  }
];

export default Landing; 