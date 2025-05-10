import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Maximize2,
  FileText,
  ChevronLeft,
  List,
  Clock,
  Info,
  CheckCircle,
  AlertTriangle,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function IshtehaarMadagarChatbot() {
  const { currentUser } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // "chat", "file", "view"
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your assistant. I can answer FAQs, help you file a complaint, or view your complaint history. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [complaintData, setComplaintData] = useState({
    subject: "",
    description: "",
  });
  const [formError, setFormError] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(""); // "submitting", "success", "error", or ""
  const [userComplaints, setUserComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [complaintsError, setComplaintsError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const subjectInputRef = useRef(null);

  // FAQ responses for quick matching

  // Fetch user complaints
  const fetchUserComplaints = async () => {
    setComplaintsLoading(true);
    setComplaintsError("");

    try {
      const response = await fetch(
        `/api/complaint/get-user-complaints/${currentUser._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await response.json();
      setUserComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaintsError("Failed to load complaints. Please try again later.");
    } finally {
      setComplaintsLoading(false);
    }
  };

  // Function to get response from backend
  const getBotResponse = async (userMessage) => {
    setIsTyping(true);

    // Check if user wants to file a complaint
    if (
      (userMessage.toLowerCase() === "yes" ||
        userMessage.toLowerCase() === "ok") &&
      messages[messages.length - 1].text.includes("complaint form")
    ) {
      setIsTyping(false);
      openComplaintForm();
      return "Opening the complaint form. Please fill in the required details.";
    }

    // Check if user wants to view complaints
    if (
      (userMessage.toLowerCase() === "yes" ||
        userMessage.toLowerCase() === "ok") &&
      (messages[messages.length - 1].text.includes("past complaints") ||
        messages[messages.length - 1].text.includes("complaint history"))
    ) {
      setIsTyping(false);
      openComplaintsList();
      return "Opening your complaint history. You can see the status of all your complaints.";
    }

    try {
      // Check if it's a complaint-related query
      if (
        userMessage.toLowerCase().includes("file complaint") ||
        userMessage.toLowerCase().includes("file a complaint") ||
        userMessage.toLowerCase().includes("new complaint") ||
        userMessage.toLowerCase().includes("submit complaint") ||
        userMessage.toLowerCase().includes("report issue")
      ) {
        setIsTyping(false);
        return "You can file a complaint using our complaint form. Would you like to open the complaint form now?";
      }

      // Check if it's a view complaints query
      if (
        userMessage.toLowerCase().includes("view complaint") ||
        userMessage.toLowerCase().includes("my complaint") ||
        userMessage.toLowerCase().includes("complaint history") ||
        userMessage.toLowerCase().includes("complaint status") ||
        userMessage.toLowerCase().includes("check status")
      ) {
        setIsTyping(false);
        return "You can view your complaint history and check the status of your complaints. Would you like to view your past complaints?";
      }

      // Check for FAQ matches
      const lowerMessage = userMessage.toLowerCase();
      for (const [key, response] of Object.entries(faqResponses)) {
        if (lowerMessage.includes(key.toLowerCase())) {
          setIsTyping(false);
          return response;
        }
      }

      // If no match found, call backend API
      const response = await fetch(
        "http://localhost:5005/webhooks/rest/webhook",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sender: "user", message: userMessage }),
        }
      );

      const data = await response.json();
      setIsTyping(false);
      return (
        data[0]?.text ||
        "I'm not sure how to answer that. Would you like to file a complaint, view your complaint history, or ask about our services?"
      );
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setIsTyping(false);
      return "Sorry, I'm having trouble connecting to my knowledge base right now. Would you like to file a complaint or view your complaint history instead?";
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");

    const botResponse = await getBotResponse(inputMessage);

    if (botResponse) {
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && activeTab === "chat") {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized, activeTab]);

  // Focus on subject field when complaint form opens
  useEffect(() => {
    if (activeTab === "file" && subjectInputRef.current) {
      subjectInputRef.current.focus();
    }
  }, [activeTab]);

  // Fetch complaints when complaints list view is opened
  useEffect(() => {
    if (activeTab === "view") {
      fetchUserComplaints();
    }
  }, [activeTab]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    setActiveTab("chat");
  };

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const toggleFullScreen = (e) => {
    e.stopPropagation();
    setIsFullScreen(!isFullScreen);
  };

  const openComplaintForm = () => {
    setActiveTab("file");
    setFormError("");
    setSubmissionStatus("");
  };

  const openComplaintsList = () => {
    setActiveTab("view");
  };

  const returnToChat = () => {
    setActiveTab("chat");
    setComplaintData({ subject: "", description: "" });
    setFormError("");
    setSubmissionStatus("");
    setSelectedComplaint(null);
  };

  const handleComplaintInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear form error when user starts typing
    if (formError) setFormError("");
  };

  const submitComplaint = async (e) => {
    e.preventDefault();

    // Validate form
    if (!complaintData.subject.trim() || !complaintData.description.trim()) {
      setFormError("Please fill in all required fields");
      return;
    }

    setSubmissionStatus("submitting");

    try {
      // Call the API to submit the complaint
      const response = await fetch("/api/complaint/register-complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser._id,
          subject: complaintData.subject,
          description: complaintData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      const data = await response.json();

      // Add success message to chat
      const successMessage = {
        id: messages.length + 1,
        text: `Your complaint has been successfully submitted. Reference #: ${data.complaint._id.substring(
          0,
          8
        )}. We'll get back to you soon.`,
        sender: "bot",
      };

      setMessages((prev) => [...prev, successMessage]);
      setSubmissionStatus("success");

      // Return to chat after short delay
      setTimeout(() => {
        returnToChat();
      }, 2000);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setSubmissionStatus("error");
      setFormError(
        "There was an error submitting your complaint. Please try again."
      );
    }
  };

  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-amber-600";
      case "in_progress":
        return "text-blue-600";
      case "resolved":
        return "text-emerald-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} className="text-amber-600" />;
      case "in_progress":
        return <Info size={16} className="text-blue-600" />;
      case "resolved":
        return <CheckCircle size={16} className="text-emerald-600" />;
      case "rejected":
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="font-sans">
      {/* Chat toggle button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center z-50"
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat container */}
      {isOpen && (
        <div
          className={`fixed ${
            isFullScreen
              ? "inset-0 m-0 rounded-none"
              : "bottom-6 right-6 rounded-lg w-80 md:w-96"
          } bg-white shadow-2xl flex flex-col transition-all duration-200 border border-gray-200 overflow-hidden z-50`}
          style={{
            height: isMinimized ? "60px" : isFullScreen ? "100%" : "500px",
          }}
        >
          {/* Chat header */}
          <div
            className="bg-indigo-600 text-white p-4 flex justify-between items-center cursor-pointer"
            onClick={toggleMinimize}
          >
            <div className="flex items-center space-x-2">
              {activeTab === "chat" && <MessageSquare size={20} />}
              {activeTab === "file" && <FileText size={20} />}
              {activeTab === "view" && <List size={20} />}
              <h3 className="font-medium">
                {activeTab === "chat" && "Ishtehaar Madagar"}
                {activeTab === "file" && "File a Complaint"}
                {activeTab === "view" && "My Complaints"}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={toggleFullScreen}
                className="hover:bg-indigo-700 p-1 rounded"
                aria-label={isFullScreen ? "Minimize" : "Maximize"}
              >
                {isFullScreen ? (
                  <Minimize2 size={16} />
                ) : (
                  <Maximize2 size={16} />
                )}
              </button>
              <button
                onClick={toggleMinimize}
                className="hover:bg-indigo-700 p-1 rounded"
                aria-label={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? (
                  <Maximize2 size={16} />
                ) : (
                  <Minimize2 size={16} />
                )}
              </button>
              <button
                onClick={toggleChat}
                className="hover:bg-indigo-700 p-1 rounded"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Navigation tabs */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("chat")}
                    className={`flex-1 py-3 text-sm font-medium flex justify-center items-center ${
                      activeTab === "chat"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500 hover:text-indigo-600"
                    }`}
                  >
                    <MessageSquare size={16} className="mr-1" />
                    Chat
                  </button>
                  <button
                    onClick={openComplaintForm}
                    className={`flex-1 py-3 text-sm font-medium flex justify-center items-center ${
                      activeTab === "file"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500 hover:text-indigo-600"
                    }`}
                  >
                    <FileText size={16} className="mr-1" />
                    File Complaint
                  </button>
                  <button
                    onClick={openComplaintsList}
                    className={`flex-1 py-3 text-sm font-medium flex justify-center items-center ${
                      activeTab === "view"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500 hover:text-indigo-600"
                    }`}
                  >
                    <List size={16} className="mr-1" />
                    My Complaints
                  </button>
                </div>
              </div>

              {/* Tab content */}
              {activeTab === "chat" && (
                <>
                  {/* Chat messages */}
                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === "user"
                              ? "bg-indigo-600 text-white rounded-br-none"
                              : "bg-gray-200 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          {message.text.split("\n").map((text, i) => (
                            <span key={i}>
                              {text}
                              {i !== message.text.split("\n").length - 1 && (
                                <br />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start mb-4">
                        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none max-w-xs lg:max-w-md">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div
                              className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messageEndRef} />
                  </div>

                  {/* Chat input */}
                  <div className="border-t border-gray-200 p-3 bg-white">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your question..."
                        className="flex-1 border-0 bg-transparent py-2 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center"
                        disabled={inputMessage.trim() === ""}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Complaint Form */}
              {activeTab === "file" && (
                <div className="flex-1 flex flex-col bg-gray-50 overflow-auto">
                  <form
                    onSubmit={submitComplaint}
                    className="p-4 flex-1 overflow-auto"
                  >
                    <div className="mb-4">
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={subjectInputRef}
                        type="text"
                        id="subject"
                        name="subject"
                        value={complaintData.subject}
                        onChange={handleComplaintInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Brief subject of your complaint"
                        disabled={
                          submissionStatus === "submitting" ||
                          submissionStatus === "success"
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={complaintData.description}
                        onChange={handleComplaintInputChange}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Please provide detailed information about your complaint"
                        disabled={
                          submissionStatus === "submitting" ||
                          submissionStatus === "success"
                        }
                      ></textarea>
                    </div>

                    {formError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                        <AlertTriangle size={16} className="mr-2 mt-0.5" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {submissionStatus === "success" && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-start">
                        <CheckCircle size={16} className="mr-2 mt-0.5" />
                        <span>
                          Complaint submitted successfully! Returning to chat...
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={returnToChat}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white 
                          ${
                            submissionStatus === "submitting"
                              ? "bg-indigo-400"
                              : submissionStatus === "success"
                              ? "bg-green-500"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          }`}
                        disabled={
                          submissionStatus === "submitting" ||
                          submissionStatus === "success"
                        }
                      >
                        {submissionStatus === "submitting"
                          ? "Submitting..."
                          : submissionStatus === "success"
                          ? "Submitted!"
                          : "Submit Complaint"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Complaints List View */}
              {activeTab === "view" && (
                <div className="flex-1 bg-gray-50 overflow-auto">
                  {selectedComplaint ? (
                    <div className="p-4">
                      {/* Complaint Details View */}
                      <div className="mb-4">
                        <button
                          onClick={() => setSelectedComplaint(null)}
                          className="text-indigo-600 hover:text-indigo-800 flex items-center mb-4"
                        >
                          <ChevronLeft size={16} />
                          <span>Back to complaints</span>
                        </button>

                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium text-gray-900">
                                {selectedComplaint.subject}
                              </h3>
                              <div className="flex items-center">
                                {getStatusIcon(selectedComplaint.status)}
                                <span
                                  className={`ml-1 text-sm font-medium ${getStatusColor(
                                    selectedComplaint.status
                                  )}`}
                                >
                                  {selectedComplaint.status
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Reference #:{" "}
                              {selectedComplaint._id.substring(0, 8)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Submitted:{" "}
                              {formatDate(selectedComplaint.createdAt)}
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Description
                              </h4>
                              <p className="text-gray-900 whitespace-pre-wrap">
                                {selectedComplaint.description}
                              </p>
                            </div>

                            {/* Admin Response Section */}
                            {selectedComplaint.response && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">
                                  Response
                                </h4>
                                <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                                  <p className="text-gray-900 whitespace-pre-wrap">
                                    {selectedComplaint.response}
                                  </p>
                                  <div className="text-sm text-gray-500 mt-2">
                                    Responded:{" "}
                                    {formatDate(selectedComplaint.updatedAt)}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Admin Comment Section */}
                            {selectedComplaint.adminComment && (
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-1">
                                  Admin Comment
                                </h4>
                                <div className="bg-indigo-50 p-3 rounded-md border border-indigo-100">
                                  <div className="flex items-start gap-2">
                                    <User
                                      size={18}
                                      className="text-indigo-600 mt-1"
                                    />
                                    <div className="flex-1">
                                      <p className="text-gray-800 whitespace-pre-wrap">
                                        {selectedComplaint.adminComment}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Status History */}
                            {selectedComplaint.statusUpdates &&
                              selectedComplaint.statusUpdates.length > 0 && (
                                <div className="mt-6">
                                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                                    Status History
                                  </h4>
                                  <div className="space-y-4">
                                    {selectedComplaint.statusUpdates.map(
                                      (update, index) => (
                                        <div key={index} className="flex">
                                          <div className="mr-3 flex flex-col items-center">
                                            <div
                                              className={`h-4 w-4 rounded-full ${
                                                getStatusColor(update.status) ||
                                                "bg-gray-400"
                                              }`}
                                            ></div>
                                            {index <
                                              selectedComplaint.statusUpdates
                                                .length -
                                                1 && (
                                              <div className="h-full w-0.5 bg-gray-300"></div>
                                            )}
                                          </div>
                                          <div className="pb-4">
                                            <p className="text-sm font-medium text-gray-800">
                                              Status changed to{" "}
                                              <span
                                                className={getStatusColor(
                                                  update.status
                                                )}
                                              >
                                                {update.status
                                                  .replace("_", " ")
                                                  .toUpperCase()}
                                              </span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {formatDate(update.timestamp)}
                                            </p>
                                            {update.comment && (
                                              <p className="text-sm text-gray-700 mt-1 italic">
                                                "{update.comment}"
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      {complaintsLoading ? (
                        <div className="text-center py-8">
                          <div className="inline-block w-6 h-6 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
                          <p className="mt-2 text-gray-600">
                            Loading your complaints...
                          </p>
                        </div>
                      ) : complaintsError ? (
                        <div className="text-center py-8">
                          <AlertTriangle
                            size={24}
                            className="mx-auto text-red-500"
                          />
                          <p className="mt-2 text-red-600">{complaintsError}</p>
                          <button
                            onClick={fetchUserComplaints}
                            className="mt-2 text-blue-600 hover:text-blue-800 underline"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : userComplaints.length === 0 ? (
                        <div className="text-center py-8">
                          <Info size={24} className="mx-auto text-gray-400" />
                          <p className="mt-2 text-gray-600">
                            You haven't filed any complaints yet.
                          </p>
                          <button
                            onClick={openComplaintForm}
                            className="mt-2 text-blue-600 hover:text-blue-800"
                          >
                            File a new complaint
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-medium text-gray-700 mb-4">
                            Your Complaint History
                          </h3>
                          <div className="space-y-3">
                            {userComplaints.map((complaint) => (
                              <div
                                key={complaint._id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md cursor-pointer transition-shadow"
                                onClick={() => viewComplaintDetails(complaint)}
                              >
                                <div className="px-4 py-3">
                                  <div className="flex justify-between items-center">
                                    <h4 className="font-medium text-gray-900 truncate">
                                      {complaint.subject}
                                    </h4>
                                    <div className="flex items-center">
                                      {getStatusIcon(complaint.status)}
                                      <span
                                        className={`ml-1 text-xs font-medium ${getStatusColor(
                                          complaint.status
                                        )}`}
                                      >
                                        {complaint.status
                                          .replace("_", " ")
                                          .toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    Ref #: {complaint._id.substring(0, 8)} •{" "}
                                    {formatDate(complaint.createdAt)}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-2 truncate">
                                    {complaint.description}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-2 truncate">
                                    {complaint.adminComment}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
