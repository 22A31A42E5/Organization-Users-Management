import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizations, createOrganization, deleteOrganization } from '../api';
import AddOrganizationModal from './AddOrganizationModal';
import LoadingSpinner from './LoadingSpinner';

const OrganizationsList = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await getOrganizations();
      setOrganizations(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load organizations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (data) => {
    await createOrganization(data);
    await fetchOrganizations();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await deleteOrganization(id);
        await fetchOrganizations();
      } catch (err) {
        alert('Failed to delete organization');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Blocked':
        return 'status-blocked';
      case 'Inactive':
        return 'status-inactive';
      default:
        return 'status-inactive';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <div className="mb-4 text-sm text-gray-600">
        &gt; Manage B2B organizations
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">B2B organizations</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Sr. No</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Organizations</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Pending requests</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org, index) => (
                <tr
                  key={org.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/organizations/${org.id}`)}
                >
                  <td className="py-4 px-4">{index + 1}</td>
                  <td className="py-4 px-4 font-medium">{org.name}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {org.pending_requests_count} pending requests
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center">
                      <span className={`status-dot ${getStatusColor(org.status)}`}></span>
                      {org.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={(e) => handleDelete(org.id, e)}
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
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add Organization
        </button>
      </div>

      <AddOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrganization}
      />
    </div>
  );
};

export default OrganizationsList;
