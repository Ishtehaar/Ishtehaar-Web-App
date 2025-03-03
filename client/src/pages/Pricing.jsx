import React from "react";
import { Check, Search, Award } from "lucide-react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

const PricingComponent = () => {

  const handleUpgrade = async () => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ userId: "12345" }) // Pass current user ID
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect user to Stripe checkout
      }
    } catch (error) {
      console.error("Error upgrading:", error);
    }
  };

  return (
    <div className="w-full p-8 rounded-lg">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Ishtehaar Plans</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Optimize your advertising strategy with AI-powered ad solutions
          tailored specifically for your business needs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg rounded-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Search className="text-indigo-400 mr-3" size={24} />
              <div>
                <h3 className="font-bold text-xl">Free Plan</h3>
                <p className="text-gray-500 text-sm">
                  Start your advertising journey
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Check
                  size={20}
                  className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
                />
                <span>Create up to 5 advertisements</span>
              </div>
              <div className="flex items-start">
                <Check
                  size={20}
                  className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
                />
                <span>Basic ad templates</span>
              </div>
              <div className="flex items-start">
                <Check
                  size={20}
                  className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
                />
                <span>Standard support</span>
              </div>
              <div className="pt-16">
                {/* Extra space to push down the separator line */}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
              <Link to = "/dashboard">
              <Button className="w-full px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors">
                Get Started
              </Button>
              </Link>
         
          </div>
        </div>

        {/* Premium Plan */}
        <div className="rounded-lg overflow-hidden border border-indigo-500 relative hover:shadow-lg hover:shadow-indigo-900/20 transition-all duration-300">
          <div className="absolute top-0 right-0">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-4 py-1 font-medium">
              RECOMMENDED
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center mb-4">
              <Award className="text-indigo-400 mr-3" size={24} />
              <div>
                <h3 className="font-bold text-xl">Premium Plan</h3>
                <p className="text-gray-500 text-sm">
                  Unlimited advertising potential
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$10</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Check
                  size={20}
                  className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
                />
                <span className="font-medium">Unlimited advertisements</span>
              </div>
              <div className="flex items-start">
                <Check
                  size={20}
                  className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
                />
                <span>Premium ad templates</span>
              </div>
              <div className="flex items-start">
                <Check
                  size={20}
                  className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
                />
                <span>Priority support</span>
              </div>
              <div className="flex items-start">
                <Check
                  size={20}
                  className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
                />
                <span>Advanced analytics dashboard</span>
              </div>
              <div className="flex items-start">
                <Check
                  size={20}
                  className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
                />
                <span>Campaign performance insights</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
              <Button  onClick = {handleUpgrade} className="w-full px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors">
                Upgrade Now
              </Button>

          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm max-w-3xl mx-auto">
        <p className="flex items-center justify-center gap-2">
          <span>
            The more advertisements you create, the more visibility your
            business will gain across platforms.
          </span>
        </p>
      </div>
    </div>
  );
};

export default PricingComponent;
