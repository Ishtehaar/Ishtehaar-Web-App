// import React from "react";
// import { Check, Search, Award } from "lucide-react";
// import { Button } from "flowbite-react";
// import { Link } from "react-router-dom";

// const PricingComponent = () => {

//   const handleUpgrade = async () => {
//     try {
//       const response = await fetch("/api/stripe/create-checkout-session", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         // body: JSON.stringify({ userId: "12345" }) // Pass current user ID
//       });

//       const data = await response.json();
//       if (data.url) {
//         window.location.href = data.url; // Redirect user to Stripe checkout
//       }
//     } catch (error) {
//       console.error("Error upgrading:", error);
//     }
//   };

//   return (
//     <div className="w-full p-8 rounded-lg">
//       <div className="text-center mb-10">
//         <h2 className="text-3xl font-bold mb-3">Ishtehaar Plans</h2>
//         <p className="text-gray-500 max-w-2xl mx-auto">
//           Optimize your advertising strategy with AI-powered ad solutions
//           tailored specifically for your business needs.
//         </p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
//         {/* Free Plan */}
//         <div className="bg rounded-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300">
//           <div className="p-6">
//             <div className="flex items-center mb-4">
//               <Search className="text-indigo-400 mr-3" size={24} />
//               <div>
//                 <h3 className="font-bold text-xl">Free Plan</h3>
//                 <p className="text-gray-500 text-sm">
//                   Start your advertising journey
//                 </p>
//               </div>
//             </div>

//             <div className="mb-6">
//               <div className="flex items-baseline">
//                 <span className="text-4xl font-bold">$0</span>
//                 <span className="text-gray-500 ml-2">/month</span>
//               </div>
//             </div>

//             <div className="space-y-4 mb-8">
//               <div className="flex items-start">
//                 <Check
//                   size={20}
//                   className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
//                 />
//                 <span>Create up to 5 advertisements</span>
//               </div>
//               <div className="flex items-start">
//                 <Check
//                   size={20}
//                   className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
//                 />
//                 <span>Basic ad templates</span>
//               </div>
//               <div className="flex items-start">
//                 <Check
//                   size={20}
//                   className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
//                 />
//                 <span>Standard support</span>
//               </div>
//               <div className="pt-16">
//                 {/* Extra space to push down the separator line */}
//               </div>
//             </div>
//           </div>

//           <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
//               <Link to = "/dashboard">
//               <Button gradientDuoTone = "purpleToBlue" className="w-full px-4  text-white rounded font-medium transition-colors">
//                 Get Started
//               </Button>
//               </Link>
         
//           </div>
//         </div>

//         {/* Premium Plan */}
//         <div className="rounded-lg overflow-hidden border border-indigo-500 relative hover:shadow-lg hover:shadow-indigo-900/20 transition-all duration-300">
//           <div className="absolute top-0 right-0">
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-4 py-1 font-medium">
//               RECOMMENDED
//             </div>
//           </div>

//           <div className="p-6">
//             <div className="flex items-center mb-4">
//               <Award className="text-indigo-400 mr-3" size={24} />
//               <div>
//                 <h3 className="font-bold text-xl">Premium Plan</h3>
//                 <p className="text-gray-500 text-sm">
//                   Unlimited advertising potential
//                 </p>
//               </div>
//             </div>

//             <div className="mb-6">
//               <div className="flex items-baseline">
//                 <span className="text-4xl font-bold">$10</span>
//                 <span className="text-gray-500 ml-2">/month</span>
//               </div>
//             </div>

//             <div className="space-y-4 mb-8">
//               <div className="flex items-start">
//                 <Check
//                   size={20}
//                   className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
//                 />
//                 <span className="font-medium">Unlimited advertisements</span>
//               </div>
//               <div className="flex items-start">
//                 <Check
//                   size={20}
//                   className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
//                 />
//                 <span>Premium ad templates</span>
//               </div>
//               <div className="flex items-start">
//                 <Check
//                   size={20}
//                   className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
//                 />
//                 <span>Priority support</span>
//               </div>
//               <div className="flex items-start">
//                 <Check
//                   size={20}
//                   className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
//                 />
//                 <span>Advanced analytics dashboard</span>
//               </div>
//               <div className="flex items-start">
//                 <Check
//                   size={20}
//                   className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
//                 />
//                 <span>Campaign performance insights</span>
//               </div>
//             </div>
//           </div>

//           <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
//               <Button  onClick = {handleUpgrade} gradientDuoTone = "purpleToPink" className="w-full px-4  text-white rounded font-mediumtransition-colors">
//                 Upgrade Now
//               </Button>

//           </div>
//         </div>
//       </div>

//       <div className="mt-8 text-center text-gray-500 text-sm max-w-3xl mx-auto">
//         <p className="flex items-center justify-center gap-2">
//           <span>
//             The more advertisements you create, the more visibility your
//             business will gain across platforms.
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default PricingComponent;



import React, { useState, useEffect } from "react";
import { Check, Search, Award, Loader } from "lucide-react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

const PricingComponent = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/subscription/get-subscriptions');
        const data = await response.json();
        
        if (data.success) {
          setPlans(data.data);
        } else {
          setError(data.message || 'Failed to fetch plans');
        }
      } catch (error) {
        setError('Error fetching subscription plans');
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  const handleUpgrade = async (planId) => {
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect user to Stripe checkout
      }
    } catch (error) {
      console.error("Error upgrading:", error);
    }
  };

  // Fallback plans if API fails or is loading
  const defaultPlans = [
    {
      _id: "free",
      planName: "Free Plan",
      planPrice: 0,
      features: [
        "Create up to 5 advertisements",
        "Basic ad templates",
        "Standard support"
      ],
      isRecommended: false,
      buttonText: "Get Started",
      buttonUrl: "/dashboard"
    },
    {
      _id: "premium",
      planName: "Premium Plan",
      planPrice: 10,
      features: [
        "Unlimited advertisements",
        "Premium ad templates", 
        "Priority support",
        "Advanced analytics dashboard",
        "Campaign performance insights"
      ],
      isRecommended: true,
      buttonText: "Upgrade Now",
      buttonUrl: "#upgrade"
    }
  ];

  // Use default plans when loading or if there's an error
  const displayPlans = loading || error || plans.length === 0 ? defaultPlans : plans;

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-500">Loading pricing plans...</p>
      </div>
    );
  }

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
        {displayPlans.map((plan, index) => (
          <div 
            key={plan._id}
            className={`rounded-lg overflow-hidden border ${plan.isRecommended ? 'border-indigo-500 relative hover:shadow-lg hover:shadow-indigo-900/20' : 'border-gray-700 hover:border-indigo-500'} transition-all duration-300`}
          >
            {plan.isRecommended && (
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-4 py-1 font-medium">
                  RECOMMENDED
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center mb-4">
                {plan.isRecommended ? (
                  <Award className="text-indigo-400 mr-3" size={24} />
                ) : (
                  <Search className="text-indigo-400 mr-3" size={24} />
                )}
                <div>
                  <h3 className="font-bold text-xl">{plan.planName}</h3>
                  <p className="text-gray-500 text-sm">
                    {plan.isRecommended ? "Unlimited advertising potential" : "Start your advertising journey"}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">${plan.planPrice}</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start">
                    <Check
                      size={20}
                      className="text-indigo-400 mr-3 mt-0.5 flex-shrink-0"
                    />
                    <span className={plan.isRecommended && idx === 0 ? "font-medium" : ""}>
                      {feature}
                    </span>
                  </div>
                ))}
                {plan.features.length < 4 && plan.planPrice === 0 && (
                  <div className="pt-16">
                    {/* Extra space to push down the separator line */}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
              {plan.planPrice === 0 || plan.buttonUrl.startsWith('/') ? (
                <Link to={plan.buttonUrl}>
                  <Button 
                    gradientDuoTone={plan.isRecommended ? "purpleToPink" : "purpleToBlue"} 
                    className="w-full px-4 text-white rounded font-medium transition-colors"
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={() => handleUpgrade(plan._id)}
                  gradientDuoTone={plan.isRecommended ? "purpleToPink" : "purpleToBlue"} 
                  className="w-full px-4 text-white rounded font-medium transition-colors"
                >
                  {plan.buttonText}
                </Button>
              )}
            </div>
          </div>
        ))}
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