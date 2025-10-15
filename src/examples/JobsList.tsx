import { useJobQueries } from '../hooks/useJobQueries';
import { useJobMutations } from '../hooks/useJobMutations';

// Example component showing how to use the job queries and mutations
export default function JobsList() {
  const { useJobs } = useJobQueries();
  const { deleteJobMutation, updateJobStatusMutation } = useJobMutations();
  
  const { data: jobsResponse, isLoading, error } = useJobs();

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJobMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateJobStatusMutation.mutate({ id, status });
  };

  if (isLoading) return <div>Loading jobs...</div>;
  if (error) return <div>Error loading jobs: {error.message}</div>;

  const jobs = jobsResponse?.data || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs List</h1>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
            <p className="text-gray-600">{job.companyName}</p>
            <p className="text-sm text-gray-500">{job.location}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleDeleteJob(job.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                disabled={deleteJobMutation.isPending}
              >
                Delete
              </button>
              <select
                value={job.status}
                onChange={(e) => handleStatusChange(job.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
                disabled={updateJobStatusMutation.isPending}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
