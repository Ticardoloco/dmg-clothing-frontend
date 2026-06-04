"use client";

import { getMessages, deleteMessage } from "@/lib/contactApi";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data.contacts || []);
    } catch (error) {
      toast.error("Failed to load contact messages");
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // --- DELETE MESSAGE RECORD ---
  const handleDeleteMessage = async (messageId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this contact inquiry? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId),
      );

      if (typeof deleteMessage === "function") {
        await deleteMessage(messageId);
        toast.success("Message deleted successfully");
      } else {
        throw new Error("Missing deleteMessage function");
      }
    } catch (error) {
      toast.error("Could not delete message from database");
      console.error(error);
      fetchMessages();
    }
  };

  // Status helper mapping directly to your system's badge styles
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "read":
        return {
          badge: "bg-gray-50 text-gray-400 border-gray-200",
          dot: "bg-gray-300",
        };
      case "unread":
      default:
        return {
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
          dot: "bg-indigo-600",
        };
    }
  };

  // Search logic covering name, email, subject, or message content snippets
  const filteredMessages = messages.filter((msg) => {
    const nameToSearch = msg.name || "";
    const emailToSearch = msg.email || "";
    const subjectToSearch = msg.subject || "";
    const contentToSearch = msg.message || "";

    return (
      nameToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emailToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subjectToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contentToSearch.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;

  const currentMessages = filteredMessages.slice(
    indexOfFirstMessage,
    indexOfLastMessage,
  );

  if (loading)
    return (
      <div className="pt-40 text-center font-prata">
        Loading customer inquiries...
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      <ToastContainer position="top-right" autoClose={1500} />

      {/* --- TOP HEADER BAR --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-4 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-prata uppercase tracking-tight">
            Inbound{" "}
            <span className="text-indigo-600 italic font-light">Messages</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 tracking-[0.2em] mt-1.5 uppercase">
            Review and respond to client inquiries and contact forms
          </p>
        </div>

        <div className="w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search by Keyword, Email, Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 px-4 py-3 text-base sm:text-sm font-bold tracking-widest uppercase outline-none focus:border-indigo-600 text-gray-900 bg-white h-11 w-full lg:w-64 transition-all"
          />
        </div>
      </div>

      {/* --- MESSAGES CONTAINER --- */}
      <div className="space-y-6">
        {filteredMessages.length === 0 ? (
          <div className="border border-gray-100 p-12 text-center text-gray-400 italic bg-white shadow-sm">
            No incoming correspondence found.
          </div>
        ) : (
          currentMessages.map((msg) => {
            const statusStyles = getStatusStyle(msg.status);
            const isUnread = msg.status?.toLowerCase() !== "read";

            return (
              <div
                key={msg._id}
                className={`border bg-white shadow-sm transition-all overflow-hidden ${
                  isUnread
                    ? "border-indigo-100 ring-1 ring-indigo-50/50"
                    : "border-gray-100"
                }`}
              >
                {/* Top Context Summary Strip */}
                <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-mono text-gray-400 font-bold uppercase">
                      {msg._id}
                    </span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="text-gray-500 font-medium text-sm md:text-base">
                      Received:{" "}
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleString()
                        : "Recent"}
                    </span>
                  </div>

                  {/* Status controls and delete actions */}
                  <div className="flex items-center flex-wrap gap-2">
                    {/* Hardcoded Minimal Trash SVG (Perfect match to Orders module) */}
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="ml-2 border border-gray-200 hover:border-red-200 bg-white hover:bg-red-50 p-1.5 transition-all outline-none flex items-center justify-center"
                      style={{ width: "28px", height: "28px" }}
                      title="Purge Message Record"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{
                          width: "14px",
                          height: "14px",
                          display: "block",
                        }}
                        className="w-3.5 h-3.5 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <path
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"
                          stroke="#9ca3af"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4 7h16M10 4h4"
                          stroke="#9ca3af"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Primary Content Grid */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm items-start">
                  {/* Column 1: Sender Identification */}
                  <div className="space-y-1 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-2">
                    <span className="text-sm uppercase tracking-wider text-gray-400 font-bold block mb-1">
                      Sender Details
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm md:text-base capitalize">
                      {msg.fullName || "Anonymous Sender"}
                    </h4>
                    <p className="text-gray-500 text-sm md:text-base font-medium tracking-tight lowercase">
                      {msg.email}
                    </p>
                  </div>

                  {/* Column 2 & 3: Message Text Area (Spanned for enhanced readability) */}
                  <div className="md:col-span-3 space-y-2">
                    <div>
                      <span className="text-sm uppercase tracking-wider text-gray-400 font-bold block mb-1">
                        Inquiry Body
                      </span>
                      <div className="bg-gray-50/80 p-3 border border-gray-100 text-gray-700 leading-relaxed text-sm md:text-base wrap-break-word whitespace-pre-line rounded-sm">
                        {msg.message || "Empty message body received."}
                      </div>
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

export default ContactMessages;
