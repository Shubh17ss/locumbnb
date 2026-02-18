
import React, { useState } from 'react';
import { adminAuditLogger } from '../../../utils/adminAuditLogger';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'physician' | 'crna' | 'facility' | 'vendor';
  status: 'active' | 'suspended' | 'pending_verification' | 'locked';
  verificationStatus: 'verified' | 'unverified' | 'pending';
  profileComplete: boolean;
  joinedDate: string;
  lastActive: string;
  assignmentsCount: number;
  disputesCount: number;
}

interface AdminSession {
  sessionId: string;
  adminId: string;
  adminEmail: string;
  adminRole: string;
  permissions: {
    canVerifyUsers?: boolean;
    canSuspendUsers?: boolean;
    canLockUsers?: boolean;
    // add any other permissions you need
    [key: string]: any;
  };
}

interface UserManagementProps {
  session: AdminSession;
}

/* -------------------------------------------------------------------------- */
/* Mock data – in a real app this would come from an API                        */
/* -------------------------------------------------------------------------- */
const MOCK_USERS: User[] = [
  {
    id: 'user_001',
    fullName: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    role: 'physician',
    status: 'active',
    verificationStatus: 'verified',
    profileComplete: true,
    joinedDate: '2024-01-15',
    lastActive: '2024-03-20T14:30:00Z',
    assignmentsCount: 12,
    disputesCount: 0,
  },
  {
    id: 'user_002',
    fullName: 'Memorial Hospital',
    email: 'admin@memorialhospital.com',
    phone: '+1 (555) 234-5678',
    role: 'facility',
    status: 'active',
    verificationStatus: 'verified',
    profileComplete: true,
    joinedDate: '2024-02-01',
    lastActive: '2024-03-21T09:15:00Z',
    assignmentsCount: 45,
    disputesCount: 1,
  },
  {
    id: 'user_003',
    fullName: 'Dr. Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 345-6789',
    role: 'crna',
    status: 'pending_verification',
    verificationStatus: 'pending',
    profileComplete: false,
    joinedDate: '2024-03-18',
    lastActive: '2024-03-21T11:45:00Z',
    assignmentsCount: 0,
    disputesCount: 0,
  },
  {
    id: 'user_004',
    fullName: 'TravelMed Services',
    email: 'contact@travelmed.com',
    phone: '+1 (555) 456-7890',
    role: 'vendor',
    status: 'active',
    verificationStatus: 'verified',
    profileComplete: true,
    joinedDate: '2024-01-20',
    lastActive: '2024-03-21T13:20:00Z',
    assignmentsCount: 89,
    disputesCount: 0,
  },
  {
    id: 'user_005',
    fullName: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 567-8901',
    role: 'physician',
    status: 'suspended',
    verificationStatus: 'verified',
    profileComplete: true,
    joinedDate: '2024-02-10',
    lastActive: '2024-03-15T16:00:00Z',
    assignmentsCount: 8,
    disputesCount: 2,
  },
  {
    id: 'user_006',
    fullName: 'City Medical Center',
    email: 'info@citymedical.com',
    phone: '+1 (555) 678-9012',
    role: 'facility',
    status: 'active',
    verificationStatus: 'verified',
    profileComplete: true,
    joinedDate: '2024-01-25',
    lastActive: '2024-03-21T10:30:00Z',
    assignmentsCount: 67,
    disputesCount: 0,
  },
  {
    id: 'user_007',
    fullName: 'Dr. James Wilson',
    email: 'james.wilson@email.com',
    phone: '+1 (555) 789-0123',
    role: 'physician',
    status: 'locked',
    verificationStatus: 'verified',
    profileComplete: true,
    joinedDate: '2024-02-20',
    lastActive: '2024-03-10T12:00:00Z',
    assignmentsCount: 5,
    disputesCount: 3,
  },
  {
    id: 'user_008',
    fullName: 'InsurePro Medical',
    email: 'quotes@insurepro.com',
    phone: '+1 (555) 890-1234',
    role: 'vendor',
    status: 'active',
    verificationStatus: 'verified',
    profileComplete: true,
    joinedDate: '2024-02-05',
    lastActive: '2024-03-21T14:00:00Z',
    assignmentsCount: 156,
    disputesCount: 0,
  },
];

export default function UserManagement({ session }: UserManagementProps) {
  /* -------------------------- State --------------------------------------- */
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<string>('');
  const [actionReason, setActionReason] = useState('');

  /* -------------------------- Filtering ----------------------------------- */
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesVerification =
      verificationFilter === 'all' || user.verificationStatus === verificationFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesVerification;
  });

  /* -------------------------- Action handling ---------------------------- */
  const handleUserAction = (user: User, action: string) => {
    setSelectedUser(user);
    setActionType(action);
    setShowActionModal(true);
  };

  const executeAction = () => {
    if (!selectedUser) return;

    // Basic validation – reason is required
    if (!actionReason.trim()) {
      alert('Please provide a reason for this action.');
      return;
    }

    let newStatus = selectedUser.status;
    let newVerification = selectedUser.verificationStatus;

    switch (actionType) {
      case 'verify':
        newVerification = 'verified';
        break;
      case 'suspend':
        newStatus = 'suspended';
        break;
      case 'reinstate':
        newStatus = 'active';
        break;
      case 'lock':
        newStatus = 'locked';
        break;
      case 'unlock':
        newStatus = 'active';
        break;
      default:
        break;
    }

    // Update the user list immutably
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, status: newStatus, verificationStatus: newVerification }
          : u
      )
    );

    // Log the action
    try {
      adminAuditLogger.log(
        session.adminId,
        session.adminEmail,
        session.adminRole,
        `USER_${actionType.toUpperCase()}`,
        'user',
        selectedUser.id,
        {
          userId: selectedUser.id,
          userEmail: selectedUser.email,
          userRole: selectedUser.role,
          action: actionType,
          reason: actionReason,
          previousStatus: selectedUser.status,
          newStatus,
          previousVerification: selectedUser.verificationStatus,
          newVerification,
        },
        session.sessionId
      );
    } catch (err) {
      console.error('Failed to log admin action:', err);
    }

    // Reset modal state
    setShowActionModal(false);
    setActionReason('');
    setSelectedUser(null);
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) return;

    selectedUsers.forEach((userId) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      try {
        adminAuditLogger.log(
          session.adminId,
          session.adminEmail,
          session.adminRole,
          `BULK_${action.toUpperCase()}`,
          'user',
          userId,
          {
            bulkAction: true,
            totalUsers: selectedUsers.length,
            action,
          },
          session.sessionId
        );
      } catch (err) {
        console.error(`Failed to log bulk ${action} for ${userId}:`, err);
      }
    });

    // Here you would normally also update the users state according to the bulk action.
    // For this mock we just clear the selection and inform the admin.
    setSelectedUsers([]);
    alert(`Bulk action "${action}" applied to ${selectedUsers.length} users`);
  };

  /* -------------------------- Badge helpers ----------------------------- */
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'physician':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'crna':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'facility':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'vendor':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'suspended':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending_verification':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'locked':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  /* ---------------------------------------------------------------------- */
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
            <p className="text-slate-400">Manage all platform users and accounts</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">{selectedUsers.length} selected</span>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
                >
                  <i className="ri-download-line mr-2" />
                  Export
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Total Users</span>
              <i className="ri-user-line text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Active</span>
              <i className="ri-checkbox-circle-line text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {users.filter((u) => u.status === 'active').length}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Pending</span>
              <i className="ri-time-line text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {users.filter((u) => u.verificationStatus === 'pending').length}
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Suspended</span>
              <i className="ri-error-warning-line text-red-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {users.filter((u) => u.status === 'suspended' || u.status === 'locked').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or ID..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            >
              <option value="all">All Roles</option>
              <option value="physician">Physician</option>
              <option value="crna">CRNA</option>
              <option value="facility">Facility</option>
              <option value="vendor">Vendor</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="locked">Locked</option>
            </select>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setStatusFilter('all');
                setVerificationFilter('all');
              }}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              <i className="ri-refresh-line mr-1" />
              Reset Filters
            </button>
            <span className="text-sm text-slate-400">
              Showing {filteredUsers.length} of {users.length} users
            </span>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map((u) => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500 focus:ring-offset-slate-800 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                    Verification
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                    Assignments
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">
                    Last Active
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500 focus:ring-offset-slate-800 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-white font-medium">{user.fullName}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                        <p className="text-xs text-slate-500 font-mono">{user.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                          user.status
                        )}`}
                      >
                        {user.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {user.verificationStatus === 'verified' ? (
                          <i className="ri-checkbox-circle-fill text-green-400" />
                        ) : user.verificationStatus === 'pending' ? (
                          <i className="ri-time-line text-amber-400" />
                        ) : (
                          <i className="ri-close-circle-line text-red-400" />
                        )}
                        <span className="text-sm text-slate-300">
                          {user.verificationStatus.charAt(0).toUpperCase() + user.verificationStatus.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-white font-medium">{user.assignmentsCount}</p>
                        {user.disputesCount > 0 && (
                          <p className="text-xs text-red-400">{user.disputesCount} disputes</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-300">{new Date(user.lastActive).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500">{new Date(user.lastActive).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserDetails(true);
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <i className="ri-eye-line" />
                        </button>

                        {/* Verify */}
                        {user.verificationStatus === 'pending' && session.permissions.canVerifyUsers && (
                          <button
                            onClick={() => handleUserAction(user, 'verify')}
                            className="w-8 h-8 flex items-center justify-center bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                            title="Verify User"
                          >
                            <i className="ri-checkbox-circle-line" />
                          </button>
                        )}

                        {/* Suspend */}
                        {user.status === 'active' && session.permissions.canSuspendUsers && (
                          <button
                            onClick={() => handleUserAction(user, 'suspend')}
                            className="w-8 h-8 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                            title="Suspend User"
                          >
                            <i className="ri-forbid-line" />
                          </button>
                        )}

                        {/* Reinstate */}
                        {user.status === 'suspended' && session.permissions.canSuspendUsers && (
                          <button
                            onClick={() => handleUserAction(user, 'reinstate')}
                            className="w-8 h-8 flex items-center justify-center bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                            title="Reinstate User"
                          >
                            <i className="ri-refresh-line" />
                          </button>
                        )}

                        {/* Lock */}
                        {user.status !== 'locked' && session.permissions.canLockUsers && (
                          <button
                            onClick={() => handleUserAction(user, 'lock')}
                            className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                            title="Lock Profile"
                          >
                            <i className="ri-lock-line" />
                          </button>
                        )}

                        {/* Unlock */}
                        {user.status === 'locked' && session.permissions.canLockUsers && (
                          <button
                            onClick={() => handleUserAction(user, 'unlock')}
                            className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                            title="Unlock Profile"
                          >
                            <i className="ri-lock-unlock-line" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-user-search-line text-4xl text-slate-600 mb-3" />
              <p className="text-slate-400">No users found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">User Details</h3>
              <button
                onClick={() => {
                  setShowUserDetails(false);
                  setSelectedUser(null);
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Full Name</p>
                    <p className="text-white">{selectedUser.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">User ID</p>
                    <p className="text-white font-mono text-sm">{selectedUser.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <p className="text-white">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Role</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                        selectedUser.role
                      )}`}
                    >
                      {selectedUser.role.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                        selectedUser.status
                      )}`}
                    >
                      {selectedUser.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Account Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Verification Status</p>
                    <div className="flex items-center gap-2">
                      {selectedUser.verificationStatus === 'verified' ? (
                        <i className="ri-checkbox-circle-fill text-green-400" />
                      ) : selectedUser.verificationStatus === 'pending' ? (
                        <i className="ri-time-line text-amber-400" />
                      ) : (
                        <i className="ri-close-circle-line text-red-400" />
                      )}
                      <span className="text-white">
                        {selectedUser.verificationStatus.charAt(0).toUpperCase() +
                          selectedUser.verificationStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Profile Complete</p>
                    <div className="flex items-center gap-2">
                      {selectedUser.profileComplete ? (
                        <>
                          <i className="ri-checkbox-circle-fill text-green-400" />
                          <span className="text-white">Complete</span>
                        </>
                      ) : (
                        <>
                          <i className="ri-close-circle-line text-red-400" />
                          <span className="text-white">Incomplete</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Joined Date</p>
                    <p className="text-white">{new Date(selectedUser.joinedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Last Active</p>
                    <p className="text-white">{new Date(selectedUser.lastActive).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Activity Stats */}
              <div>
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Activity Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Total Assignments</p>
                    <p className="text-2xl font-bold text-white">{selectedUser.assignmentsCount}</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-1">Disputes</p>
                    <p className="text-2xl font-bold text-white">{selectedUser.disputesCount}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    setShowUserDetails(false);
                    handleUserAction(selectedUser, 'view_full_profile');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  <i className="ri-file-user-line mr-2" />
                  View Full Profile
                </button>
                <button
                  onClick={() => {
                    setShowUserDetails(false);
                    handleUserAction(selectedUser, 'view_activity');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  <i className="ri-history-line mr-2" />
                  Activity History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">Confirm Action</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                <i className="ri-alert-line text-amber-400 text-xl mt-0.5" />
                <div>
                  <p className="text-amber-300 font-medium mb-1">
                    {actionType === 'verify' && 'Verify User'}
                    {actionType === 'suspend' && 'Suspend User'}
                    {actionType === 'reinstate' && 'Reinstate User'}
                    {actionType === 'lock' && 'Lock Profile'}
                    {actionType === 'unlock' && 'Unlock Profile'}
                  </p>
                  <p className="text-sm text-amber-400/80">
                    You are about to {actionType} {selectedUser.fullName}'s account. This action will be logged.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reason (Required)
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Provide a detailed reason for this action..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowActionModal(false);
                    setActionReason('');
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAction}
                  disabled={!actionReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
