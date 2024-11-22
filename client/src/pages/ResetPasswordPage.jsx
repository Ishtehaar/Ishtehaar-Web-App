import { useState } from "react";
import { motion } from "framer-motion";
// import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import { Alert } from "flowbite-react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const { resetPassword, error, isLoading, message } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  console.log(token);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords donot match!");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Something went wrong");
        setLoading(false);
        return;
      }
      setLoading(false);
      setErrorMessage(null);
      setSuccessMessage(
        "Password Reset Successfully, redirecting you to login page in 3 seconds..."
      );
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message || "Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800  backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit}>
            <Input
              icon={Lock}
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              type="submit"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Set New Password"}
            </motion.button>
          </form>
        </div>
        {errorMessage && (
          <Alert color="failure" className="mb-6">
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert color="success" className="mb-6">
            {successMessage}
          </Alert>
        )}
      </motion.div>
    </div>
  );
};
export default ResetPasswordPage;
