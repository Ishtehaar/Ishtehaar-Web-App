import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { HelpCircle } from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      setErrorMessage(null);
      if (res.ok) {
        navigate("/verify-email");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Ishtehaar
            </span>
          </Link>
          <p className="py-4 text-2xl font-bold">
            Your Digital Marketing Partner
          </p>
        </div>
        
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Username field with tooltip */}
            <div className="mb-6">
              <Label value="Your username" />
              <div className="relative">
                <TextInput
                  type="text"
                  placeholder="Username"
                  id="username"
                  onChange={handleChange}
                />
                <div className="group absolute right-2 top-1/2 -translate-y-1/2">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute right-0 top-0 -translate-y-full mb-2 w-64 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-50">
                    <ul className="list-disc pl-4">
                      <li>Must only contain letters, numbers, and no spaces</li>
                      <li>Must be between 7 and 20 characters</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Email field */}
            <div className="mb-6">
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            
            {/* Password field with tooltip */}
            <div className="mb-6">
              <Label value="Your password" />
              <div className="relative">
                <TextInput
                  type="password"
                  placeholder="Password"
                  id="password"
                  onChange={handleChange}
                />
                <div className="group absolute right-2 top-1/2 -translate-y-1/2">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute right-0 top-0 -translate-y-full mb-2 w-64 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100 z-50">
                    <ul className="list-disc pl-4">
                      <li>Must be at least 8 characters</li>
                      <li>Must include at least one upper case letter</li>
                      <li>Must contain at least one number</li>
                      <li>Must have at least one symbol</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          
          <div className="flex text-sm mt-5 justify-between">
            <div className="flex gap-2">
              <span>Have an account?</span>
              <Link to="/sign-in" className="text-blue-500">
                Sign In
              </Link>
            </div>
            <Link to="/forgot-password" className="text-red-500">
              Forgot Password?
            </Link>
          </div>
          
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}