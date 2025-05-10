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
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center mt-4">
          Complaint Management
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="p-4 rounded-lg shadow-sm border border-gray-700 ">
            <h3 className="text-2xl font-bold ">{stats.total}</h3>
            <p className="text-gray-500">Total Complaints</p>
          </div>

          <div className=" border-yellow-700 border p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-yellow-500">
              {stats.pending}
            </h3>
            <p className="text-yellow-400">Pending</p>
          </div>

          <div className=" border-blue-700 border p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-blue-500">
              {stats.inProgress}
            </h3>
            <p className="text-blue-400">In Progress</p>
          </div>

          <div className=" border-green-700 border p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-green-500">
              {stats.resolved}
            </h3>
            <p className="text-green-400">Resolved</p>
          </div>

          <div className=" border-red-700 border p-4 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-red-500">
              {stats.rejected}
            </h3>
            <p className="text-red-400">Rejected</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-4">
          <div className="relative max-w-md">
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
              className=" border border-gray-700 text-gray-100 text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Tabs for filtering */}
        <div className="mb-0 border-b border-gray-700 w-full">
          <div className="w-full overflow-x-auto">
            <ul className="flex flex-nowrap -mb-px text-sm font-medium text-center min-w-max">
              <li className="mr-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabChange("all");
                  }}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "all"
                      ? "text-blue-500 border-blue-500 active"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  All Complaints
                </a>
              </li>
              <li className="mr-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabChange("pending");
                  }}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "pending"
                      ? "text-blue-500 border-blue-500 active"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  Pending
                </a>
              </li>
              <li className="mr-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabChange("in-progress");
                  }}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "in-progress"
                      ? "text-blue-500 border-blue-500 active"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  In Progress
                </a>
              </li>
              <li className="mr-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabChange("resolved");
                  }}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "resolved"
                      ? "text-blue-500 border-blue-500 active"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  Resolved
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabChange("rejected");
                  }}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "rejected"
                      ? "text-blue-500 border-blue-500 active"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  Rejected
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Error Message */}
        {error && complaints.length === 0 && (
          <div
            className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative my-4 w-full text-center"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <div className="flex justify-center mt-2">
              <button
                className="bg-red-700 hover:bg-red-800 text-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={fetchComplaints}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Complaints Table Container - Fixed Width */}
        <div className="w-full bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-700 min-h-80 relative">
          {/* Tab Loading State */}
          {tabLoading ? (
            <TableLoader />
          ) : (
            /* Table Content */
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-full table-fixed divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      Subject
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-32"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-32"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-48"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((complaint, index) => (
                      <tr key={complaint._id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {complaint.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(complaint.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewComplaint(complaint._id)}
                              className="bg-gray-700 text-blue-400 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
                            >
                              View
                            </button>

                            <button
                              onClick={() =>
                                handleUpdateComplaint(complaint._id)
                              }
                              disabled={
                                complaint.status === "resolved" ||
                                complaint.status === "rejected"
                              }
                              className={`${
                                complaint.status === "resolved" ||
                                complaint.status === "rejected"
                                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                  : "bg-gray-700 text-indigo-400 hover:bg-gray-600"
                              } px-3 py-1 rounded-md text-sm`}
                            >
                              Update
                            </button>

                            {complaint.status !== "resolved" && (
                              <button
                                onClick={() =>
                                  handleResolveComplaint(complaint._id)
                                }
                                className="bg-gray-700 text-green-400 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        No complaints found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Complaint Modal */}
        {showViewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-gray-800 rounded-lg shadow-xl mx-auto w-full max-w-2xl border border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-700 rounded-t">
                <h3 className="text-xl font-semibold text-gray-100">
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
              {currentComplaint && (
                <div className="p-6">
                  <div className="mb-5">
                    <h5 className="text-lg font-medium text-gray-200 mb-2">
                      Subject
                    </h5>
                    <p className="text-gray-300 bg-gray-700 p-3 rounded-lg">
                      {currentComplaint.subject}
                    </p>
                  </div>

                  <div className="mb-5">
                    <h5 className="text-lg font-medium text-gray-200 mb-2">
                      Description
                    </h5>
                    <p className="text-gray-300 bg-gray-700 p-3 rounded-lg">
                      {currentComplaint.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <h5 className="text-lg font-medium text-gray-200 mb-2">
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
                      <h5 className="text-lg font-medium text-gray-200 mb-2">
                        Created On
                      </h5>
                      <p className="text-gray-300">
                        {formatDate(currentComplaint.createdAt)}
                      </p>
                    </div>
                  </div>

                  {currentComplaint.adminComment && (
                    <div className="mb-5">
                      <h5 className="text-lg font-medium text-gray-200 mb-2">
                        Admin Comment
                      </h5>
                      <p className="text-gray-300 bg-gray-700 p-3 rounded-lg">
                        {currentComplaint.adminComment}
                      </p>
                    </div>
                  )}

                  {currentComplaint.resolvedAt && (
                    <div className="mb-5">
                      <h5 className="text-lg font-medium text-gray-200 mb-2">
                        Resolved On
                      </h5>
                      <p className="text-gray-300">
                        {formatDate(currentComplaint.resolvedAt)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-center p-5 border-t border-gray-700 rounded-b">
                <button
                  type="button"
                  className="bg-gray-700 text-gray-200 hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5"
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
                <h3 className="text-xl font-semibold text-gray-100">
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
                    className="bg-gray-700 text-gray-200 hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5"
                    onClick={() => setShowUpdateModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-gray-100 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-xl mx-auto w-full max-w-lg">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Resolve Complaint
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
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
                  <p className="text-gray-700 text-center mb-2">
                    Are you sure you want to mark this complaint as resolved?
                  </p>

                  <div>
                    <label
                      htmlFor="resolutionComment"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Resolution Comment
                    </label>
                    <textarea
                      id="resolutionComment"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add resolution details or comments here"
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      disabled={submitting}
                    ></textarea>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-3 p-5 border-t border-gray-200 rounded-b">
                  <button
                    type="button"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5"
                    onClick={() => setShowResolveModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
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
