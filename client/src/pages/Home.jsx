import React from "react";
import { Card, Button, Badge, Avatar, Timeline } from "flowbite-react";
import {
  HiArrowRight,
  HiChartPie,
  HiUserGroup,
  HiCurrencyDollar,
  HiSupport,
} from "react-icons/hi";

export default function Home() {
  return (
    <div className="">
      {/* Hero Section */}
      <section className=" dark:bg-gray-900">
        <div className="py-16 px-4 mx-auto max-w-screen-xl text-center lg:py-24 lg:px-12">
          <Badge color="purple" size="xl" className="mb-8">
            #1 Digital Advertising Platform in Pakistan
          </Badge>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Transform Your Digital{" "}
            <span className="text-purple-600">Advertising</span> Journey
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-600 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            Join over 2,000+ businesses that trust Ishtehaar to revolutionize
            their digital advertising campaigns with AI-powered solutions and
            real-time analytics.
          </p>
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Button size="xl" gradientDuoTone="purpleToPink" className="px-8">
              <span className="mr-2">Start Free Trial</span>
              <HiArrowRight className="mt-1 w-5 h-5" />
            </Button>
            <Button size="xl" outline gradientDuoTone="purpleToPink">
              Schedule Demo
            </Button>
          </div>
          <div className="flex justify-center space-x-6 mt-8">
            {["Forbes", "TechCrunch", "Business Insider"].map((partner) => (
              <span key={partner} className="text-gray-400 font-semibold">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "2K+", label: "Active Users" },
              { number: "93%", label: "Success Rate" },
              { number: "24/7", label: "Expert Support" },
              { number: "50M+", label: "Ad Impressions" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <h3 className="text-3xl font-bold text-purple-600">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="py-16 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md mb-12 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Enterprise-Grade Solutions
            </h2>
            <p className="text-gray-500 sm:text-xl dark:text-gray-400">
              Streamline your advertising workflow with our comprehensive suite
              of tools
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <HiChartPie className="w-10 h-10 text-purple-600 mb-4" />,
                title: "Visual Ad Creator",
                description:
                  "Create stunning visual advertisements with our intuitive drag-and-drop editor and professional templates",
              },
              {
                icon: (
                  <HiUserGroup className="w-10 h-10 text-purple-600 mb-4" />
                ),
                title: "Social Scheduler",
                description:
                  "Schedule and automate your posts across multiple social media platforms effortlessly",
              },
              {
                icon: <HiSupport className="w-10 h-10 text-purple-600 mb-4" />,
                title: "24/7 Support",
                description:
                  "Get round-the-clock assistance from our dedicated team of advertising specialists",
              },
              {
                icon: (
                  <HiCurrencyDollar className="w-10 h-10 text-purple-600 mb-4" />
                ),
                title: "Advanced Analytics",
                description:
                  "Track campaign performance with comprehensive analytics and real-time insights",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {feature.title}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-purple-50 dark:bg-gray-800">
        <div className="py-16 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <h2 className="mb-12 text-3xl font-extrabold text-center text-gray-900 dark:text-white">
            Trusted by Industry Leaders
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Ahmed",
                role: "Marketing Director",
                company: "TechCorp",
                content:
                  "Ishtehaar has transformed how we approach digital advertising. The ROI tracking is exceptional.",
              },
              {
                name: "Ali Hassan",
                role: "CEO",
                company: "GrowthMedia",
                content:
                  "The AI-powered analytics have given us insights we never had before. Truly game-changing.",
              },
              {
                name: "Fatima Khan",
                role: "Digital Strategist",
                company: "AdverTech",
                content:
                  "Best-in-class targeting capabilities and an incredibly intuitive interface. Highly recommended.",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <div className="flex flex-col items-center">
                  <Avatar size="lg" rounded className="mb-4" />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role} at {testimonial.company}
                  </span>
                  <p className="mt-4 text-gray-600 text-center">
                    "{testimonial.content}"
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
