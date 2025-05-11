import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function DashAdminComplaints() {
  const { currentUser } = useSelector((state) => state.user);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [currentComplaint, setCurrentComplaint] = useState(null);

  // Form states
  const [adminComment, setAdminComment] = useState("");
  const [status, setStatus] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch all complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/complaint/get-complaints");
      if (!response.ok) {
        setError("Failed to fetch complaints");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setComplaints(data);
      setFilteredComplaints(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      showToast(error.message, "error");
    }
  };

  // Fetch complaints stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/complaint/get-complaint-stats");
      if (!response.ok) {
        setError("Failed to fetch complaint statistics");
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  // Fetch complaints by status
  const fetchComplaintsByStatus = async (status) => {
    if (status === "all") {
      fetchComplaints();
      return;
    }

    try {
      setTabLoading(true);
      const response = await fetch(`/api/complaint/get-complaints/${status}`);
      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }
      const data = await response.json();
      setComplaints(data);
      setFilteredComplaints(data);
      setTabLoading(false);
    } catch (error) {
      setError(error.message);
      setTabLoading(false);
      showToast(error.message, "error");
    }
  };

  // Fetch complaint details
  const fetchComplaintDetails = async (id) => {
    try {
      const response = await fetch(`/api/complaint/get-complaint/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch complaint details");
      }
      const data = await response.json();
      setCurrentComplaint(data);
      return data;
    } catch (error) {
      showToast(error.message, "error");
      return null;
    }
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    // This is a placeholder for your toast implementation
    console.log(`${type}: ${message}`);
  };

  // Update complaint status
  const updateStatus = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/complaint/update-complaint-status/${currentComplaint._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            adminComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update complaint status");
      }

      setShowUpdateModal(false);
      setAdminComment("");
      setStatus("");
      showToast("Complaint status updated successfully");

      // Refresh data
      fetchStats();
      fetchComplaintsByStatus(activeTab);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Resolve complaint
  const resolveComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/complaint/resolve-complaint/${currentComplaint._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve complaint");
      }

      setShowResolveModal(false);
      setAdminComment("");
      showToast("Complaint resolved successfully");

      // Refresh data
      fetchStats();
      fetchComplaintsByStatus(activeTab);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle view complaint
  const handleViewComplaint = async (id) => {
    const complaintData = await fetchComplaintDetails(id);
    if (complaintData) {
      setShowViewModal(true);
    }
  };

  // Handle update complaint
  const handleUpdateComplaint = async (id) => {
    const complaintData = await fetchComplaintDetails(id);
    if (complaintData) {
      setStatus(complaintData.status);
      setAdminComment(complaintData.adminComment || "");
      setShowUpdateModal(true);
    }
  };

  // Handle resolve complaint
  const handleResolveComplaint = async (id) => {
    const complaintData = await fetchComplaintDetails(id);
    if (complaintData) {
      setAdminComment(complaintData.adminComment || "");
      setShowResolveModal(true);
    }
  };

  // Filter complaints based on search term
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredComplaints(complaints);
    } else {
      const filtered = complaints.filter(
        (complaint) =>
          complaint.subject?.toLowerCase().includes(term) ||
          complaint.description?.toLowerCase().includes(term)
      );
      setFilteredComplaints(filtered);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Load complaints on component mount
  useEffect(() => {
    if (currentUser) {
      fetchComplaints();
      fetchStats();
    }
  }, [currentUser]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchComplaintsByStatus(tab);
  };

  // Full page loader component
  const FullPageLoader = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-l text-gray-200">Loading complaints data...</p>
      </div>
    </div>
  );

  // Table loader component
  const TableLoader = () => (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-3 text-gray-300">Loading...</p>
      </div>
    </div>
  );

  // If the initial page is loading, show a full-page loader
  if (loading && complaints.length === 0) {
    return <FullPageLoader />;
  }

  return (
    <div className="p-6 min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center ">
          Complaint Management
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-lg shadow-sm border border-gray-700 ">
            <h3 className="text-2xl font-bold ">{stats.total}</h3>
            <p className="text-gray-500">Total Complaints</p>
          </div>

          <div className="p-4 rounded-lg shadow-sm border border-yellow-700 ">
            <h3 className="text-2xl font-bold text-yellow-500">
              {stats.pending}
            </h3>
            <p className="text-yellow-400">Pending</p>
          </div>

          <div className="p-4 rounded-lg shadow-sm border border-blue-700 ">
            <h3 className="text-2xl font-bold text-blue-500">
              {stats.inProgress}
            </h3>
            <p className="text-blue-400">In Progress</p>
          </div>

          <div className="p-4 rounded-lg shadow-sm border border-green-700 ">
            <h3 className="text-2xl font-bold text-green-500">
              {stats.resolved}
            </h3>
            <p className="text-green-400">Resolved</p>
          </div>

          <div className="p-4 rounded-lg shadow-sm border border-red-700 ">
            <h3 className="text-2xl font-bold text-red-500">
              {stats.rejected}
            </h3>
            <p className="text-red-400">Rejected</p>
          </div>
        </div>

        {/* Search & Filter Container */}
        <div className=" rounded-lg border border-gray-700 p-4 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className=" border border-gray-600 text-gray-100 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Tabs for filtering */}
            <div className="w-full md:w-auto overflow-x-auto">
              <ul className="flex flex-nowrap">
                <li className="mr-1">
                  <button
                    onClick={() => handleTabChange("all")}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                      activeTab === "all"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    All
                  </button>
                </li>
                <li className="mr-1">
                  <button
                    onClick={() => handleTabChange("pending")}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                      activeTab === "pending"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    Pending
                  </button>
                </li>
                <li className="mr-1">
                  <button
                    onClick={() => handleTabChange("in-progress")}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                      activeTab === "in-progress"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    In Progress
                  </button>
                </li>
                <li className="mr-1">
                  <button
                    onClick={() => handleTabChange("resolved")}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                      activeTab === "resolved"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    Resolved
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("rejected")}
                    className={`px-4 py-2 rounded-t-lg text-sm font-medium ${
                      activeTab === "rejected"
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    Rejected
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && complaints.length === 0 && (
          <div
            className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative my-4 text-center"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <div className="flex justify-center mt-2">
              <button
                className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={fetchComplaints}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Complaints Table Container */}
        <div className=" rounded-lg border border-gray-700 shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12   text-xs font-medium uppercase tracking-wider border-b border-gray-700">
            <div className="col-span-1 px-6 py-3 text-left">#</div>
            <div className="col-span-4 px-6 py-3 text-left">Subject</div>
            <div className="col-span-2 px-6 py-3 text-left">Status</div>
            <div className="col-span-2 px-6 py-3 text-left">Created</div>
            <div className="col-span-3 px-6 py-3 text-left">Actions</div>
          </div>

          {/* Loading State */}
          {tabLoading ? (
            <div className="w-full h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3 ">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table Body */}
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint, index) => (
                  <div
                    key={complaint._id}
                    className="grid grid-cols-12 border-b border-gray-700  transition-colors text-sm"
                  >
                    <div className="col-span-1 px-6 py-4 font-medium ">
                      {index + 1}
                    </div>
                    <div className="col-span-4 px-6 py-4  truncate">
                      {complaint.subject}
                    </div>
                    <div className="col-span-2 px-6 py-4">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </div>
                    <div className="col-span-2 px-6 py-4 ">
                      {formatDate(complaint.createdAt)}
                    </div>
                    <div className="col-span-3 px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewComplaint(complaint._id)}
                          className="bg-gray-700 text-blue-400 hover:bg-gray-600 px-3 py-1 rounded-md text-sm transition-colors"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleUpdateComplaint(complaint._id)}
                          disabled={
                            complaint.status === "resolved" ||
                            complaint.status === "rejected"
                          }
                          className={`px-3 py-1 rounded-md text-sm transition-colors ${
                            complaint.status === "resolved" ||
                            complaint.status === "rejected"
                              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                              : "bg-gray-700 text-indigo-400 hover:bg-gray-600"
                          }`}
                        >
                          Update
                        </button>

                        {complaint.status !== "resolved" && (
                          <button
                            onClick={() =>
                              handleResolveComplaint(complaint._id)
                            }
                            className="bg-gray-700 text-green-400 hover:bg-gray-600 px-3 py-1 rounded-md text-sm transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-12 h-64">
                  <div className="col-span-12 flex items-center justify-center text-gray-400">
                    No complaints found
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* View Complaint Modal */}
        {showViewModal && currentComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-gray-800 rounded-lg shadow-xl mx-auto w-full max-w-2xl border border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-700 rounded-t">
                <h3 className="text-xl font-semibold text-white">
                  Complaint Details
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-700 hover:text-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={() => setShowViewModal(false)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="mb-5">
                  <h5 className="text-lg font-medium text-white mb-2">
                    Subject
                  </h5>
                  <p className="text-gray-300 bg-gray-700 p-3 rounded-lg">
                    {currentComplaint.subject}
                  </p>
                </div>

                <div className="mb-5">
                  <h5 className="text-lg font-medium text-white mb-2">
                    Description
                  </h5>
                  <p className="text-gray-300 bg-gray-700 p-3 rounded-lg">
                    {currentComplaint.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <h5 className="text-lg font-medium text-white mb-2">
                      Status
                    </h5>
                    <span
                      className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadge(
                        currentComplaint.status
                      )}`}
                    >
                      {currentComplaint.status}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-lg font-medium text-white mb-2">
                      Created On
                    </h5>
                    <p className="text-gray-300">
                      {formatDate(currentComplaint.createdAt)}
                    </p>
                  </div>
                </div>

                {currentComplaint.adminComment && (
                  <div className="mb-5">
                    <h5 className="text-lg font-medium text-white mb-2">
                      Admin Comment
                    </h5>
                    <p className="text-gray-300 bg-gray-700 p-3 rounded-lg">
                      {currentComplaint.adminComment}
                    </p>
                  </div>
                )}

                {currentComplaint.resolvedAt && (
                  <div className="mb-5">
                    <h5 className="text-lg font-medium text-white mb-2">
                      Resolved On
                    </h5>
                    <p className="text-gray-300">
                      {formatDate(currentComplaint.resolvedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center p-5 border-t border-gray-700 rounded-b">
                <button
                  type="button"
                  className="bg-gray-700 text-white hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-gray-800 rounded-lg shadow-xl mx-auto w-full max-w-lg border border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-700 rounded-t">
                <h3 className="text-xl font-semibold text-white">
                  Update Complaint Status
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-700 hover:text-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={() => setShowUpdateModal(false)}
                  disabled={submitting}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Body */}
              <form onSubmit={updateStatus}>
                <div className="p-6 space-y-6">
                  <div>
                    <label
                      htmlFor="status"
                      className="block mb-2 text-sm font-medium text-gray-200"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      className="bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                      disabled={submitting}
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="adminComment"
                      className="block mb-2 text-sm font-medium text-gray-200"
                    >
                      Admin Comment
                    </label>
                    <textarea
                      id="adminComment"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-100 bg-gray-700 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add your comments or notes here"
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      disabled={submitting}
                    ></textarea>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-3 p-5 border-t border-gray-700 rounded-b">
                  <button
                    type="button"
                    className="bg-gray-700 text-white hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                    onClick={() => setShowUpdateModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Resolve Complaint Modal */}
        {showResolveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-gray-800 rounded-lg shadow-xl mx-auto w-full max-w-lg border border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-700 rounded-t">
                <h3 className="text-xl font-semibold text-white">
                  Resolve Complaint
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-700 hover:text-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  onClick={() => setShowResolveModal(false)}
                  disabled={submitting}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Body */}
              <form onSubmit={resolveComplaint}>
                <div className="p-6 space-y-6">
                  <p className="text-gray-300 text-center mb-2">
                    Are you sure you want to mark this complaint as resolved?
                  </p>

                  <div>
                    <label
                      htmlFor="resolutionComment"
                      className="block mb-2 text-sm font-medium text-gray-200"
                    >
                      Resolution Comment
                    </label>
                    <textarea
                      id="resolutionComment"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-100 bg-gray-700 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add resolution details or comments here"
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      disabled={submitting}
                    ></textarea>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-3 p-5 border-t border-gray-700 rounded-b">
                  <button
                    type="button"
                    className="bg-gray-700 text-white hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                    onClick={() => setShowResolveModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none transition-colors"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Resolving...
                      </div>
                    ) : (
                      "Resolve Complaint"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
