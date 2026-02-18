import React, { useState } from 'react';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  addedDate: string;
  lastActive: string;
  status: 'active' | 'inactive';
}

const PERMISSIONS: Permission[] = [
  { id: 'financial', name: 'Financial Access', description: 'View and manage payments, escrow, and invoices' },
  { id: 'credentials', name: 'Credential Review', description: 'Review physician credentials and documents' },
  { id: 'posting', name: 'Job Posting', description: 'Create, edit, and manage job postings' },
  { id: 'contracts', name: 'Contract Management', description: 'Review and sign contracts' },
  { id: 'disputes', name: 'Dispute Management', description: 'Handle disputes and complaints' }
];

const ROLES: Role[] = [
  { id: 'admin', name: 'Administrator', permissions: ['financial', 'credentials', 'posting', 'contracts', 'disputes'] },
  { id: 'hr', name: 'HR Manager', permissions: ['credentials', 'posting', 'contracts'] },
  { id: 'finance', name: 'Finance Manager', permissions: ['financial'] },
  { id: 'recruiter', name: 'Recruiter', permissions: ['posting', 'credentials'] },
  { id: 'viewer', name: 'Viewer', permissions: [] }
];

export default function StaffAccessManagement() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [isSending, setIsSending] = useState(false);

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'John Administrator',
      email: 'john.admin@memorial.com',
      role: 'admin',
      addedDate: '2024-01-15',
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@memorial.com',
      role: 'hr',
      addedDate: '2024-02-20',
      lastActive: '1 day ago',
      status: 'active'
    },
    {
      id: '3',
      name: 'Sarah Finance',
      email: 'sarah.finance@memorial.com',
      role: 'finance',
      addedDate: '2024-01-15',
      lastActive: '3 hours ago',
      status: 'active'
    }
  ]);

  const handleSendInvite = async () => {
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      addedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Never',
      status: 'active'
    };
    
    setStaffMembers([...staffMembers, newStaff]);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteName('');
    setInviteRole('viewer');
    setIsSending(false);
  };

  const handleRevokeAccess = (staffId: string) => {
    if (confirm('Are you sure you want to revoke access for this staff member?')) {
      setStaffMembers(staffMembers.filter(s => s.id !== staffId));
    }
  };

  const getRolePermissions = (roleId: string): string[] => {
    const role = ROLES.find(r => r.id === roleId);
    return role ? role.permissions : [];
  };

  const getRoleName = (roleId: string): string => {
    const role = ROLES.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Staff Access Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage team members and their permissions</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
        >
          <i className="ri-user-add-line mr-2"></i>
          Invite Staff Member
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
          <div>
            <p className="text-sm text-blue-900 font-medium">Role-Based Access Control</p>
            <p className="text-sm text-blue-800 mt-1">
              All actions are logged with user identity and timestamp for audit purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Team Members ({staffMembers.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Added Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">{staff.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                      {getRoleName(staff.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(staff.addedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {staff.lastActive}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      staff.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStaff(staff);
                          setShowPermissionsModal(true);
                        }}
                        className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
                        title="View Permissions"
                      >
                        <i className="ri-shield-user-line text-lg"></i>
                      </button>
                      <button
                        onClick={() => handleRevokeAccess(staff.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Revoke Access"
                      >
                        <i className="ri-user-unfollow-line text-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Invite Staff Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@memorial.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {getRolePermissions(inviteRole).length} permissions included
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvite}
                  disabled={isSending || !inviteEmail || !inviteName}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 whitespace-nowrap"
                >
                  {isSending ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Sending...
                    </>
                  ) : (
                    'Send Invite'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedStaff.name}</h3>
                <p className="text-sm text-gray-600">{getRoleName(selectedStaff.role)}</p>
              </div>
              <button
                onClick={() => {
                  setShowPermissionsModal(false);
                  setSelectedStaff(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Permissions</h4>
              {PERMISSIONS.map(permission => {
                const hasPermission = getRolePermissions(selectedStaff.role).includes(permission.id);
                return (
                  <div
                    key={permission.id}
                    className={`p-4 rounded-lg border ${
                      hasPermission
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{permission.description}</p>
                      </div>
                      <div className="ml-3">
                        {hasPermission ? (
                          <i className="ri-checkbox-circle-fill text-green-600 text-xl"></i>
                        ) : (
                          <i className="ri-close-circle-fill text-gray-400 text-xl"></i>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <i className="ri-information-line mr-1"></i>
                All actions by this user are logged with timestamp and IP address for audit purposes.
              </p>
            </div>

            <button
              onClick={() => {
                setShowPermissionsModal(false);
                setSelectedStaff(null);
              }}
              className="w-full mt-4 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
