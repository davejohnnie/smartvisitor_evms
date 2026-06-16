import { Head, Link, router, usePage } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';

export default function VisitorList({ visits }) {
    const { flash } = usePage().props;

    const handleDelete = (visitId) => {
        if (confirm('Are you sure you want to remove this visitor invitation?')) {
            router.delete(route('tenant.visits.destroy', visitId));
        }
    };

    const statusBadge = (status) => {
        const map = {
            'pending':     'badge bg-warning text-dark',
            'checked-in':  'badge bg-success',
            'checked-out': 'badge bg-secondary',
        };
        return map[status] || 'badge bg-light';
    };

    return (
        <>
            <Head title="My Visitors" />

            <div className="page-card">
                <div className="page-title-row">
                    <h4 className="page-title">My Visitors</h4>
                    <Link href={route('tenant.invite')} className="btn btn-primary btn-sm">
                        + Invite New Visitor
                    </Link>
                </div>

                {flash?.success && (
                    <div className="alert alert-success">{flash.success}</div>
                )}

                {visits.length === 0 ? (
                    <div className="empty-state">
                        <p>You have not invited any visitors yet.</p>
                        <Link href={route('tenant.invite')} className="btn btn-primary mt-2">
                            Invite Your First Visitor
                        </Link>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table sv-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Purpose</th>
                                    <th>Date</th>
                                    <th>Time In</th>
                                    <th>Time Out</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visits.map((visit) => (
                                    <tr key={visit.visit_id}>
                                        <td>{visit.visitor?.full_name}</td>
                                        <td>{visit.visitor?.phone_number}</td>
                                        <td>{visit.purpose}</td>
                                        <td>{visit.visit_date}</td>
                                        <td>{visit.expected_time_in}</td>
                                        <td>{visit.expected_time_out}</td>
                                        <td>
                                            <span className={statusBadge(visit.status)}>
                                                {visit.status}
                                            </span>
                                        </td>
                                        <td>
                                            {visit.status === 'pending' && (
                                                <button
                                                    onClick={() => handleDelete(visit.visit_id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

VisitorList.layout = (page) => <TenantLayout>{page}</TenantLayout>;