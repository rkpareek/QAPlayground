import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, RoleType } from '../../types';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Clock,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  RotateCcw,
  Send,
  Building,
  KeyRound,
  Eye,
  Edit3,
} from 'lucide-react';

export const UserManagementTab: React.FC = () => {
  const {
    users,
    invitations,
    currentUser,
    projects,
    teams,
    customRoles,
    createUser,
    updateUser,
    deactivateUser,
    reactivateUser,
    deleteUser,
    createInvitation,
    resendInvitation,
    revokeInvitation,
    addUserToTeam,
    removeUserFromTeam,
    addToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'invitations'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');

  // Modals & Drawers
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<RoleType>('qa');
  const [inviteTeamIds, setInviteTeamIds] = useState<string[]>([]);
  const [inviteProjectScope, setInviteProjectScope] = useState<'all' | 'specific'>('all');
  const [inviteProjectIds, setInviteProjectIds] = useState<string[]>([]);

  // Edit User Form State
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editRole, setEditRole] = useState<RoleType>('qa');
  const [editTeamIds, setEditTeamIds] = useState<string[]>([]);
  const [editProjectScope, setEditProjectScope] = useState<'all' | 'specific'>('all');
  const [editProjectIds, setEditProjectIds] = useState<string[]>([]);

  const isOwner = currentUser.role === 'owner' || currentUser.isOwner;
  const isAdmin = isOwner || currentUser.role === 'admin';

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const userStatus = u.isDeactivated ? 'suspended' : u.status || 'active';
    const matchesStatus = statusFilter === 'all' || userStatus === statusFilter;
    const matchesTeam = teamFilter === 'all' || (u.teams && u.teams.includes(teamFilter));

    return matchesSearch && matchesRole && matchesStatus && matchesTeam;
  });

  // Filtered Invitations
  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch =
      inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.name && inv.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || inv.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenInvite = () => {
    setInviteEmail('');
    setInviteName('');
    setInviteRole('qa');
    setInviteTeamIds([]);
    setInviteProjectScope('all');
    setInviteProjectIds([]);
    setIsInviteModalOpen(true);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    createInvitation({
      email: inviteEmail.trim(),
      name: inviteName.trim() || undefined,
      role: inviteRole,
      teamIds: inviteTeamIds,
      projectIds: inviteProjectScope === 'all' ? ['*'] : inviteProjectIds,
    });

    setIsInviteModalOpen(false);
  };

  const handleOpenEditUser = (user: User) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditTitle(user.title);
    setEditRole(user.role);
    setEditTeamIds(user.teams || []);
    const isAll = !user.projectIds || user.projectIds.includes('*') || user.projectIds.length === 0;
    setEditProjectScope(isAll ? 'all' : 'specific');
    setEditProjectIds(user.projectIds?.filter((p) => p !== '*') || []);
    setIsEditUserModalOpen(true);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    updateUser(selectedUser.id, {
      name: editName,
      title: editTitle,
      role: editRole,
      teams: editTeamIds,
      projectIds: editProjectScope === 'all' ? ['*'] : editProjectIds,
    });

    setIsEditUserModalOpen(false);
    setSelectedUser(null);
  };

  const getRoleBadge = (role: RoleType) => {
    switch (role) {
      case 'owner':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">👑 Workspace Owner</span>;
      case 'admin':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-300">🛡️ Administrator</span>;
      case 'qa_lead':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300">🧪 QA Lead</span>;
      case 'qa':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">✓ QA Engineer</span>;
      case 'automation_engineer':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">⚡ Automation (SDET)</span>;
      case 'developer':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-900 border border-teal-300">💻 Developer (Dev)</span>;
      case 'viewer':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">👁️ Viewer (Read-only)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">{role}</span>;
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">User Management & Directory</h2>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {users.length} Active Members
            </span>
            {invitations.filter((i) => i.status === 'pending').length > 0 && (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {invitations.filter((i) => i.status === 'pending').length} Pending Invites
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Invite engineers, assign system roles (Admin, QA, Dev), configure project access scoping, and manage account statuses.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenInvite}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('users')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                activeSubTab === 'users'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Active Directory ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('invitations')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                activeSubTab === 'invitations'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Pending Invitations ({invitations.filter((i) => i.status === 'pending').length})</span>
            </button>
          </div>

          {/* Quick stats pills */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Roles:</span>
            <span className="font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
              {users.filter((u) => u.role === 'admin' || u.role === 'owner').length} Admins
            </span>
            <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
              {users.filter((u) => u.role === 'qa' || u.role === 'qa_lead' || u.role === 'automation_engineer').length} QA
            </span>
            <span className="font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
              {users.filter((u) => u.role === 'developer').length} Devs
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-900 focus:bg-white"
            >
              <option value="all">All Roles</option>
              <option value="owner">Workspace Owner</option>
              <option value="admin">Administrator</option>
              <option value="qa_lead">QA Lead</option>
              <option value="qa">QA Engineer</option>
              <option value="automation_engineer">Automation Engineer (SDET)</option>
              <option value="developer">Developer</option>
              <option value="viewer">Viewer (Read-only)</option>
            </select>
          </div>

          {activeSubTab === 'users' && (
            <>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-900 focus:bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Members</option>
                  <option value="suspended">Suspended / Deactivated</option>
                </select>
              </div>

              <div>
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-900 focus:bg-white"
                >
                  <option value="all">All Teams ({teams.length})</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: ACTIVE USERS TABLE */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Teams</th>
                  <th className="py-3 px-4">Project Scope</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No team members found matching your search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSelf = user.id === currentUser.id;
                    const userTeams = teams.filter((t) => user.teams?.includes(t.id));
                    const isDeactivated = user.isDeactivated || user.status === 'suspended';

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isDeactivated ? 'bg-slate-50/50 opacity-70' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 truncate">{user.name}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                              <div className="text-[10px] text-slate-400">{user.title}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {getRoleBadge(user.role)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {userTeams.length === 0 ? (
                              <span className="text-slate-400 italic text-[11px]">No squads</span>
                            ) : (
                              userTeams.map((t) => (
                                <span
                                  key={t.id}
                                  className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-700 border border-slate-200 bg-white flex items-center gap-1"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                                  {t.name}
                                </span>
                              ))
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {!user.projectIds || user.projectIds.includes('*') || user.projectIds.length === 0 ? (
                            <span className="text-slate-700 font-medium flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-400" />
                              All Projects (Global)
                            </span>
                          ) : (
                            <span className="text-slate-700 font-medium">
                              {user.projectIds.length} Scoped Project{user.projectIds.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {isDeactivated ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1 w-fit">
                              <XCircle className="w-3 h-3" />
                              Suspended
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isAdmin && (
                              <button
                                onClick={() => handleOpenEditUser(user)}
                                className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              >
                                <Edit3 className="w-3 h-3 text-slate-500" />
                                <span>Edit</span>
                              </button>
                            )}

                            {isAdmin && !isSelf && !user.isOwner && (
                              <>
                                {isDeactivated ? (
                                  <button
                                    onClick={() => reactivateUser(user.id)}
                                    className="px-2 py-1 rounded border border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-semibold text-[11px] flex items-center gap-1"
                                    title="Reactivate Account"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Activate</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Suspend user account for ${user.name}? They will lose access immediately.`)) {
                                        deactivateUser(user.id);
                                      }
                                    }}
                                    className="px-2 py-1 rounded border border-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-600 font-semibold text-[11px]"
                                    title="Suspend User"
                                  >
                                    Suspend
                                  </button>
                                )}

                                {isOwner && (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Permanently remove user ${user.name} (${user.email}) from workspace?`)) {
                                        deleteUser(user.id);
                                      }
                                    }}
                                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    title="Delete User"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INVITATIONS TABLE */}
      {activeSubTab === 'invitations' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Invited Email</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Assigned Teams</th>
                  <th className="py-3 px-4">Sent Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvitations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No pending invitations found. Click "Invite Team Member" above to invite engineers.
                    </td>
                  </tr>
                ) : (
                  filteredInvitations.map((inv) => {
                    const invTeams = teams.filter((t) => inv.teamIds?.includes(t.id));
                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                              <Mail className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{inv.name || 'Unnamed Invite'}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{inv.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {getRoleBadge(inv.role)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {invTeams.length === 0 ? (
                              <span className="text-slate-400 italic text-[11px]">None</span>
                            ) : (
                              invTeams.map((t) => (
                                <span
                                  key={t.id}
                                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {t.name}
                                </span>
                              ))
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {new Date(inv.invitedAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" />
                            Pending Invite
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => resendInvitation(inv.id)}
                              className="px-2.5 py-1 rounded border border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <Send className="w-3 h-3" />
                              <span>Resend</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Revoke invitation for ${inv.email}?`)) {
                                  revokeInvitation(inv.id);
                                }
                              }}
                              className="px-2.5 py-1 rounded border border-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-600 font-semibold text-[11px] transition-colors"
                            >
                              Revoke
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: INVITE USER */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Invite Team Member to TestOne</h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="engineer@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Taylor"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Workspace Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'admin', label: 'Administrator', desc: 'Manage users, projects, labels & custom fields' },
                    { id: 'qa_lead', label: 'QA Lead', desc: 'Full test management, suites, plans & run orchestration' },
                    { id: 'qa', label: 'QA Engineer', desc: 'Author test cases, execute manual tests, log defects' },
                    { id: 'automation_engineer', label: 'Automation (SDET)', desc: 'AST code imports, CI pipeline runners, XML sync' },
                    { id: 'developer', label: 'Developer (Dev)', desc: 'View specs, ingest CI results, triage defects' },
                    { id: 'viewer', label: 'Viewer', desc: 'Read-only access across repository & dashboards' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setInviteRole(r.id as RoleType)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        inviteRole === r.id
                          ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-900">{r.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Squad Assignment */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Teams / Squads</label>
                <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {teams.length === 0 ? (
                    <span className="text-slate-400 italic">No teams created yet.</span>
                  ) : (
                    teams.map((t) => {
                      const isSelected = inviteTeamIds.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setInviteTeamIds((prev) =>
                              isSelected ? prev.filter((id) => id !== t.id) : [...prev, t.id]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: isSelected ? '#fff' : t.color }}
                          />
                          <span>{t.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Project Scope */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Access Scope</label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="projectScope"
                      checked={inviteProjectScope === 'all'}
                      onChange={() => setInviteProjectScope('all')}
                      className="text-blue-600"
                    />
                    <span>All Current & Future Projects (Global)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="projectScope"
                      checked={inviteProjectScope === 'specific'}
                      onChange={() => setInviteProjectScope('specific')}
                      className="text-blue-600"
                    />
                    <span>Specific Projects Only</span>
                  </label>
                </div>

                {inviteProjectScope === 'specific' && (
                  <div className="space-y-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 max-h-28 overflow-y-auto">
                    {projects.map((proj) => {
                      const isSelected = inviteProjectIds.includes(proj.id);
                      return (
                        <label
                          key={proj.id}
                          className="flex items-center justify-between p-1.5 rounded hover:bg-white cursor-pointer"
                        >
                          <span className="font-semibold text-slate-800 flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: proj.color }}
                            />
                            {proj.name} ({proj.key})
                          </span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setInviteProjectIds((prev) =>
                                isSelected ? prev.filter((id) => id !== proj.id) : [...prev, proj.id]
                              );
                            }}
                            className="rounded text-blue-600"
                          />
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {isEditUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Edit User: {selectedUser.name}</h3>
              </div>
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={selectedUser.email}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 font-mono text-xs cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as RoleType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                >
                  <option value="owner">👑 Workspace Owner</option>
                  <option value="admin">🛡️ Administrator</option>
                  <option value="qa_lead">🧪 QA Lead</option>
                  <option value="qa">✓ QA Engineer</option>
                  <option value="automation_engineer">⚡ Automation Engineer (SDET)</option>
                  <option value="developer">💻 Developer (Dev)</option>
                  <option value="viewer">👁️ Viewer (Read-only)</option>
                </select>
              </div>

              {/* Squads */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Team Memberships</label>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 max-h-28 overflow-y-auto">
                  {teams.map((t) => {
                    const isSelected = editTeamIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setEditTeamIds((prev) =>
                            isSelected ? prev.filter((id) => id !== t.id) : [...prev, t.id]
                          );
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: isSelected ? '#fff' : t.color }}
                        />
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Save User Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
