
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />
        </div>
        
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl"
            >
              <span className="text-gradient-blue">Empower</span> Your Learning Journey
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto"
            >
              Transform your educational experience with intelligent assistance and comprehensive study tools that adapt to your unique learning style.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Link to="/seneca">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500">
                  Get Started
                </Button>
              </Link>
              <Button variant="ghost" size="lg">
                Learn more →
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-16 max-w-5xl mx-auto"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                <div className="absolute top-0 h-10 w-full bg-gray-100 flex items-center px-4 space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <img 
                  src="/placeholder.svg" 
                  alt="Product screenshot" 
                  className="w-full h-auto pt-10 bg-gradient-to-b from-indigo-50 to-white"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold text-indigo-600">FEATURES</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to excel</p>
            <p className="mt-6 text-lg text-gray-600">Our comprehensive suite of tools is designed to help you master any subject with ease.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-5">
                  <span className="text-indigo-600 text-xl font-semibold">{index + 1}</span>
                </div>
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
            <h2 className="text-base font-semibold text-indigo-600">PRICING</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Choose Your Plan
            </p>
            <p className="mt-6 text-lg text-gray-600">
              Select the perfect package for your learning needs
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`relative h-full ${
                  plan.featured ? 'border-indigo-200 shadow-md' : 'border-gray-200'
                }`}>
                  {plan.featured && (
                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-4xl font-bold tracking-tight text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <svg
                            className="h-5 w-5 text-indigo-600 mr-3"
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
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className={`w-full ${
                        plan.featured
                          ? 'bg-indigo-600 hover:bg-indigo-500'
                          : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Stay Updated
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Get the latest updates and educational resources delivered to your inbox
              </p>
              <div className="mt-8 flex max-w-md mx-auto items-center gap-x-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="min-w-0 flex-auto bg-white"
                />
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2025 Sparx365, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
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
    description: "Access a vast library of educational materials, practice questions, and study guides tailored to your curriculum."
  },
  {
    title: "Progress Tracking",
    description: "Monitor your learning progress with detailed analytics and personalized insights to optimize your study time."
  },
  {
    title: "Personalized Learning Paths",
    description: "Follow customized learning journeys designed to address your specific areas of improvement and learning goals."
  },
  {
    title: "Interactive Study Tools",
    description: "Engage with interactive flashcards, quizzes, and practice exercises to reinforce your understanding."
  },
  {
    title: "Collaborative Learning",
    description: "Connect with peers and tutors to collaborate on challenging topics and share learning resources."
  }
];

const pricingPlans = [
  {
    name: "Basic",
    price: "39.99",
    description: "Perfect for individual students or casual learners",
    features: [
      "30+ Learning Features",
      "5 AI-Powered Sessions/Week",
      "Basic Analytics",
      "Email Support",
      "Access to Core Materials"
    ]
  },
  {
    name: "Standard",
    price: "69.99",
    featured: true,
    description: "Ideal for dedicated students and educators",
    features: [
      "All Basic Features",
      "Unlimited AI Sessions",
      "Advanced Analytics",
      "Priority Support",
      "Full Resource Library Access",
      "Custom Learning Paths"
    ]
  },
  {
    name: "Enterprise",
    price: "Contact",
    description: "Tailored solutions for schools and educational institutions",
    features: [
      "All Standard Features",
      "Custom Integration",
      "Dedicated Account Manager",
      "Team Management Tools",
      "API Access",
      "Branded Experience"
    ]
  }
];

export default Landing;
