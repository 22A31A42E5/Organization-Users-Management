import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganization, getUsersByOrganization, updateOrganization, createUser, deleteUser } from '../api';
import AddUserModal from './AddUserModal';
import LoadingSpinner from './LoadingSpinner';

const OrganizationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchOrganizationDetails();
    fetchUsers();
  }, [id]);

  const fetchOrganizationDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrganization(id);
      setOrganization(response.data);
      setFormData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load organization details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsersByOrganization(id);
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrganization(id, { status: newStatus });
      await fetchOrganizationDetails();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleSave = async () => {
    try {
      await updateOrganization(id, formData);
      await fetchOrganizationDetails();
      alert('Organization updated successfully');
    } catch (err) {
      alert('Failed to update organization');
    }
  };

  const handleCreateUser = async (userData) => {
    await createUser(userData);
    await fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        await fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!organization) return <div className="p-8">Organization not found</div>;

  return (
    <div className="p-8">
      <div className="mb-4 text-sm text-gray-600">
        &gt; Manage B2B organizations &gt; Organization details
      </div>

      {/* Organization Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            {organization.logo_url ? (
              <img src={organization.logo_url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-3xl">🏢</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{organization.name}</h1>
            <p className="text-gray-600">{organization.organization_mail}</p>
            <p className="text-gray-600">{organization.contact}</p>
            {organization.website_url && (
              <p className="text-blue-600">{organization.website_url}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'basic'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Basic details
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'users'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Users
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Organization Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Organization details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization SLUG
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-2 bg-gray-100 rounded-md">
                      {organization.status}
                    </span>
                    <select
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md"
                      defaultValue=""
                    >
                      <option value="" disabled>Change status</option>
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Admin name
                    </label>
                    <input
                      type="text"
                      name="primary_admin_name"
                      value={formData.primary_admin_name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Admin Mail-id
                    </label>
                    <input
                      type="email"
                      name="primary_admin_email"
                      value={formData.primary_admin_email || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Email ID
                    </label>
                    <input
                      type="email"
                      name="support_email"
                      value={formData.support_email || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone no
                    </label>
                    <input
                      type="tel"
                      name="phone_no"
                      value={formData.phone_no || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternative phone no
                    </label>
                    <input
                      type="tel"
                      name="alternative_phone_no"
                      value={formData.alternative_phone_no || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Maximum Allowed Coordinators */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Maximum Allowed Coordinators</h3>
                <select
                  name="max_coordinators"
                  value={formData.max_coordinators || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Upto 5 Coordinators">Upto 5 Coordinators</option>
                  <option value="Upto 10 Coordinators">Upto 10 Coordinators</option>
                  <option value="Upto 20 Coordinators">Upto 20 Coordinators</option>
                  <option value="Unlimited">Unlimited</option>
                </select>
              </div>

              {/* Timezone */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Timezone</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Common name
                    </label>
                    <input
                      type="text"
                      name="timezone_name"
                      value={formData.timezone_name || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <input
                      type="text"
                      name="timezone_region"
                      value={formData.timezone_region || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Language */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Language</h3>
                <select
                  name="language"
                  value={formData.language || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>

              {/* Website URL */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Official website URL</h3>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com"
                />
              </div>

              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Sr. No</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">User name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">{index + 1}</td>
                        <td className="py-4 px-4 font-medium">{user.name}</td>
                        <td className="py-4 px-4">{user.role}</td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-gray-500 hover:text-red-600"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => setIsUserModalOpen(true)}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <span className="text-xl">+</span> Add user
              </button>
            </div>
          )}
        </div>
      </div>

      <AddUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleCreateUser}
        organizationId={parseInt(id)}
      />
    </div>
  );
};

export default OrganizationDetails;
