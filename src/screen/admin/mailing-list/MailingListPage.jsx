"use client";

import {
  getSubscribers,
  updateSubscriberStatus, // For changing Active / Unsubscribed status
  deleteSubscriber,
} from "@/lib/mailingListApi";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

const MailingListControl = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, unsubscribed
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const data = await getSubscribers();
      setSubscribers(data.subscribers || []);
    } catch (error) {
      toast.error("Failed to load newsletter subscribers");
      console.error("Error fetching mailing list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // --- STATUS CHANGE HANDLER ---
  const handleStatusChange = async (subscriberId, newStatus) => {
    try {
      setSubscribers((prev) =>
        prev.map((sub) =>
          sub._id === subscriberId ? { ...sub, status: newStatus } : sub,
        ),
      );

      if (typeof updateSubscriberStatus === "function") {
        await updateSubscriberStatus(subscriberId, newStatus);
        toast.success(`Subscriber marked as ${newStatus}`);
      } else {
        throw new Error("Missing updateSubscriberStatus function");
      }
    } catch (error) {
      toast.error("Could not update subscription status");
      console.error(error);
      fetchSubscribers();
    }
  };

  // --- UNLINK / REMOVE SUBSCRIBER RECORD ---
  const handleDeleteSubscriber = async (subscriberId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this email from the database? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setSubscribers((prev) => prev.filter((sub) => sub._id !== subscriberId));

      if (typeof deleteSubscriber === "function") {
        await deleteSubscriber(subscriberId);
        toast.success("Email removed successfully");
      } else {
        throw new Error("Missing deleteSubscriber function");
      }
    } catch (error) {
      toast.error("Could not purge email record");
      console.error(error);
      fetchSubscribers();
    }
  };

  // --- COPY UTILITIES FOR MARKETING CAMPAIGNS ---
  const copyToClipboard = (text, successMessage) => {
    navigator.clipboard.writeText(text);
    toast.success(successMessage || "Copied to clipboard!");
  };

  const copyAllFilteredEmails = () => {
    if (filteredSubscribers.length === 0) {
      toast.error("No email addresses to copy");
      return;
    }
    const emailList = filteredSubscribers.map((sub) => sub.email).join(", ");
    copyToClipboard(
      emailList,
      `Copied ${filteredSubscribers.length} email addresses!`,
    );
  };

  // Styling helper matching your brand's minimal badge theme
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "unsubscribed":
        return {
          badge: "bg-gray-100 text-gray-500 border-gray-300",
          dot: "bg-gray-400",
        };
      default:
        return {
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
        };
    }
  };

  // Filter & Search Logic
  const filteredSubscribers = subscribers.filter((sub) => {
    const emailToSearch = sub.email || "";
    const matchesSearch = emailToSearch
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const subStatus = sub.status?.toLowerCase() || "active";
    const matchesFilter =
      statusFilter === "all" ||
      (statusFilter === "active" && subStatus === "active") ||
      (statusFilter === "unsubscribed" && subStatus === "unsubscribed");

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);

  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <div className="pt-40 text-center font-prata">
        Loading audience directory...
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      <ToastContainer position="top-right" autoClose={1500} />

      {/* --- TOP HEADER BAR --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-4 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-prata uppercase tracking-tight">
            Mailing{" "}
            <span className="text-indigo-600 italic font-light">List</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 tracking-[0.2em] mt-1.5 uppercase">
            Monitor newsletter signups, export data, and manage client
            subscriptions
          </p>
        </div>

        {/* Global Action Button and Inputs */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={copyAllFilteredEmails}
            className="h-11 bg-black hover:bg-zinc-950 text-white text-[10px] font-bold uppercase tracking-widest px-5 transition-all outline-none flex items-center justify-center gap-2"
          >
            Copy Filtered List
          </button>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 px-3 text-sm font-bold tracking-widest uppercase outline-none focus:border-indigo-600 text-gray-900 bg-white h-11 transition-all cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>

          <input
            type="text"
            placeholder="Search by email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 px-4 py-3 text-base sm:text-sm font-bold tracking-widest uppercase outline-none focus:border-indigo-600 text-gray-900 bg-white h-11 w-full lg:w-64 transition-all"
          />
        </div>
      </div>

      {/* --- MAIN DIRECTORY LISTING --- */}
      <div className="space-y-4">
        {filteredSubscribers.length === 0 ? (
          <div className="border border-gray-100 p-12 text-center text-gray-400 italic bg-white shadow-sm">
            No subscriber records match your current criteria.
          </div>
        ) : (
          paginatedSubscribers.map((sub) => {
            const statusStyles = getStatusStyle(sub.status || "active");

            return (
              <div
                key={sub._id}
                className="border border-gray-100 bg-white shadow-sm hover:border-gray-200 transition-all overflow-hidden"
              >
                {/* Meta Header Information Strip */}
                <div className="bg-gray-50/70 px-4 py-2.5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-sm">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-mono text-gray-400 font-bold uppercase">
                      ID: {sub._id}
                    </span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="text-gray-500 font-medium text-sm md:text-base">
                      Joined:{" "}
                      {sub.createdAt
                        ? new Date(sub.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>

                  {/* Actions & Dropdowns */}
                  <div className="flex items-center gap-2">
                    {/* Status Select Toggle */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border ${statusStyles.badge}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`}
                      />
                      <select
                        value={sub.status?.toLowerCase() || "active"}
                        onChange={(e) =>
                          handleStatusChange(sub._id, e.target.value)
                        }
                        className="bg-transparent border-none text-sm font-bold uppercase tracking-widest outline-none cursor-pointer text-current pr-2"
                      >
                        <option
                          value="active"
                          className="bg-white text-gray-900"
                        >
                          Active
                        </option>
                        <option
                          value="unsubscribed"
                          className="bg-white text-gray-900"
                        >
                          Unsubscribed
                        </option>
                      </select>
                    </div>

                    {/* Delete Icon Button */}
                    <button
                      onClick={() => handleDeleteSubscriber(sub._id)}
                      className="border border-gray-200 hover:border-red-200 bg-white hover:bg-red-50 p-1.5 transition-all outline-none flex items-center justify-center"
                      style={{ width: "28px", height: "28px" }}
                      title="Delete Entry"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ width: "13px", height: "13px" }}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <path
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 7h16M10 4h4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Primary Content Row */}
                <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-xs">
                  {/* Email block and click-to-copy trigger */}
                  <div className="space-y-0.5">
                    <span className="text-sm uppercase tracking-wider text-gray-400 font-bold block">
                      Subscriber Target Address
                    </span>
                    <div className="flex items-center gap-2 group">
                      <span className="font-mono text-gray-900 text-sm md:text-base font-medium tracking-tight break-all">
                        {sub.email}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(sub.email, "Email address copied!")
                        }
                        className="opacity-40 hover:opacity-100 transition-opacity p-1"
                        title="Copy individual email"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-3.5 h-3.5 text-zinc-600"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Context Metrics side block */}
                  <div className="flex items-center gap-8 sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                    <div>
                      <span className="text-sm uppercase tracking-wider text-gray-400 font-bold block mb-0.5">
                        Source
                      </span>
                      <p className="text-gray-600 font-medium capitalize text-sm">
                        {sub.source || "Footer Form"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-500 transition"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-10 h-10 border text-sm font-semibold transition ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white border-gray-200 hover:border-indigo-500"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-500 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MailingListControl;
