"use client";

import { deleteUser, getUsers, updateUserStatus } from "@/lib/userApi";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

// Style helper matching your layout structures for Roles
const UserRoleBadge = ({ role }) => {
  if (!role) return null;

  const isAdmin = role.toLowerCase() === "admin";
  const badgeStyle = isAdmin
    ? "bg-black text-white border-black"
    : "bg-gray-50 text-gray-500 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest ${badgeStyle}`}
    >
      {role}
    </span>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (error) {
      toast.error("Failed to load user records");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // --- USER ACCOUNT STATUS HANDLER (Active / Suspended) ---
  const handleStatusChange = async (userId, newStatus) => {
    try {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user,
        ),
      );

      if (typeof updateUserStatus === "function") {
        await updateUserStatus(userId, newStatus);
        toast.success(`Account status updated to: ${newStatus}`);
      } else {
        throw new Error("Missing updateUserStatus function");
      }
    } catch (error) {
      toast.error("Could not update account access status");
      console.error(error);
      fetchUsers();
    }
  };

  // --- DELETE USER ACCOUNT RECORD ---
  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this user account? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

      if (typeof deleteUser === "function") {
        await deleteUser(userId);
        toast.success("User account deleted successfully");
      } else {
        throw new Error("Missing deleteUser function");
      }
    } catch (error) {
      toast.error("Could not drop user profile from database");
      console.error(error);
      fetchUsers();
    }
  };

  // Style helper for Account Statuses matching your color badge designs
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "suspended":
        return {
          badge: "bg-red-50 text-red-700 border-red-200",
          dot: "bg-red-500",
        };
      case "pending":
      default:
        return {
          badge: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
        };
    }
  };

  // Format timestamp helper to display relative or localized timing cleanly
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Never";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60000);

    // If it was less than an hour ago
    if (diffMins < 60 && diffMins >= 0) {
      return diffMins <= 1 ? "Just now" : `${diffMins}m ago`;
    }
    // If it was today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }

    // Fallback default formatted output
    return (
      date.toLocaleDateString([], { month: "short", day: "numeric" }) +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Client-side search layout rules
  const filteredUsers = users.filter((user) => {
    const nameToSearch = user.username || "";
    const emailToSearch = user.email || "";
    const idToSearch = user._id || "";

    return (
      nameToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emailToSearch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idToSearch.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  if (loading)
    return (
      <div className="pt-40 text-center font-prata">
        Loading system core users...
      </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      <ToastContainer position="top-right" autoClose={1500} />

      {/* --- TOP HEADER BAR --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-4 gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-prata uppercase tracking-tight">
            User{" "}
            <span className="text-indigo-600 italic font-light">Control</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mt-1.5 uppercase">
            Manage account privileges, roles, and security access states
          </p>
        </div>

        <div className="w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search by Name, Email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 px-4 py-3 text-base sm:text-[10px] font-bold tracking-widest uppercase outline-none focus:border-indigo-600 text-gray-900 bg-white h-11 w-full lg:w-64 transition-all"
          />
        </div>
      </div>

      {/* --- USERS CONTAINER --- */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="border border-gray-100 p-12 text-center text-gray-400 italic bg-white shadow-sm">
            No matching accounts discovered.
          </div>
        ) : (
          paginatedUsers.map((user) => {
            const statusStyles = getStatusStyle(user.status);

            return (
              <div
                key={user._id}
                className="border border-gray-100 bg-white shadow-sm hover:border-gray-200 transition-all overflow-hidden"
              >
                {/* User Top Summary Header Bar */}
                <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-mono text-gray-400 font-bold uppercase">
                      {user._id}
                    </span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="text-gray-500 font-medium">
                      Registered:{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>

                  {/* Dropdown Action Controls */}
                  <div className="flex items-center flex-wrap gap-2">
                    {/* Account Access Status Dropdown */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border ${statusStyles.badge}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`}
                      />
                      <select
                        value={user.status?.toLowerCase() || "active"}
                        onChange={(e) =>
                          handleStatusChange(user._id, e.target.value)
                        }
                        className="bg-transparent border-none text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer text-current pr-2"
                      >
                        <option
                          value="active"
                          className="bg-white text-gray-900"
                        >
                          Status: Active
                        </option>
                        <option
                          value="suspended"
                          className="bg-white text-gray-900"
                        >
                          Status: Suspended
                        </option>
                      </select>
                    </div>

                    {/* Hardcoded SVG Delete Action Button */}
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="ml-2 border border-gray-200 hover:border-red-200 bg-white hover:bg-red-50 p-1.5 transition-all outline-none flex items-center justify-center"
                      style={{ width: "28px", height: "28px" }}
                      title="Terminate User Profile"
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

                {/* Main Identity Content Block — Upgraded to md:grid-cols-4 */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs items-center">
                  {/* Column 1: Profile Details */}
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                      Account Holder
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm capitalize">
                      {user.username || "Anonymous User"}
                    </h4>
                    <p className="text-gray-500 font-mono tracking-tight lowercase">
                      {user.email}
                    </p>
                  </div>

                  {/* Column 2: Phone / Contact Context */}
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                      Contact Line
                    </span>
                    <p className="text-gray-700 font-mono font-medium">
                      {user.phone || "No Phone Profile Linked"}
                    </p>
                  </div>

                  {/* Column 3: Brand New Last Seen Tracker Module */}
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                      Last Active State
                    </span>
                    <p className="text-gray-600 font-medium font-mono text-[11px]">
                      {formatLastSeen(user.lastSeen || user.updatedAt)}
                    </p>
                  </div>

                  {/* Column 4: System Authority Rights Preview */}
                  <div className="flex flex-col items-start md:items-end justify-center">
                    <span className="text-[8px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                      Privilege Classification
                    </span>
                    <UserRoleBadge
                      role={user.isAdmin === true ? "admin" : "customer"}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 text-xs font-semibold disabled:opacity-50 hover:border-indigo-600 transition"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-10 h-10 border text-xs font-semibold transition ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-300 hover:border-indigo-600"
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
            className="px-4 py-2 border border-gray-300 text-xs font-semibold disabled:opacity-50 hover:border-indigo-600 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
