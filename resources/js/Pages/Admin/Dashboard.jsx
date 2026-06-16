import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

export default function Dashboard({
    stats,
    hourlyData,
    peakHour,
    weeklyTrend,
    visitTypeBreakdown,
    incidentSeverity,
}) {
    const { auth } = usePage().props;

    const hourLabels = hourlyData.map((_, i) => `${i}:00`);

    const hourlyChartData = {
        labels: hourLabels,
        datasets: [
            {
                label: "Visitors",
                data: hourlyData,
                backgroundColor: "#4299e1",
                borderRadius: 4,
            },
        ],
    };

    const trendChartData = {
        labels: weeklyTrend.map((d) => d.date),
        datasets: [
            {
                label: "Daily Visitors",
                data: weeklyTrend.map((d) => d.count),
                borderColor: "#48bb78",
                backgroundColor: "rgba(72, 187, 120, 0.1)",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    const visitTypeChartData = {
        labels: ["Invited", "Walk-in"],
        datasets: [
            {
                data: [visitTypeBreakdown.invited, visitTypeBreakdown.walkin],
                backgroundColor: ["#4299e1", "#ecc94b"],
                borderWidth: 0,
            },
        ],
    };

    const incidentSeverityChartData = {
        labels: ["Low", "Medium", "High"],
        datasets: [
            {
                data: [
                    incidentSeverity.low,
                    incidentSeverity.medium,
                    incidentSeverity.high,
                ],
                backgroundColor: ["#48bb78", "#ecc94b", "#fc8181"],
                borderWidth: 0,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
        },
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
    };

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="dashboard-header">
                <h2>Welcome, {auth.user.name} ⚙️</h2>
                <p className="text-muted">Estate visitor analytics overview</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-blue">
                    <span className="stat-number">
                        {stats.total_visitors_today}
                    </span>
                    <span className="stat-label">Visitors Today</span>
                </div>
                <div className="stat-card stat-green">
                    <span className="stat-number">{stats.checked_in}</span>
                    <span className="stat-label">Currently Inside</span>
                </div>
                <div className="stat-card stat-gray">
                    <span className="stat-number">{stats.checked_out}</span>
                    <span className="stat-label">Checked Out</span>
                </div>
                <div className="stat-card stat-red">
                    <span className="stat-number">
                        {stats.pending_incidents}
                    </span>
                    <span className="stat-label">Pending Incidents</span>
                </div>
                <div className="stat-card stat-yellow">
                    <span className="stat-number">{stats.total_guards}</span>
                    <span className="stat-label">Total Guards</span>
                </div>
            </div>

            {/* Charts Row */}
            <div className="charts-grid">
                <div className="page-card">
                    <div className="chart-header">
                        <h5 className="page-title mb-0">
                            Visitors by Hour — Today
                        </h5>
                        <span className="peak-badge">
                            🔥 Peak: {peakHour}:00
                        </span>
                    </div>
                    <Bar data={hourlyChartData} options={chartOptions} />
                </div>

                <div className="page-card">
                    <h5 className="page-title">Last 7 Days Trend</h5>
                    <Line data={trendChartData} options={chartOptions} />
                </div>
            </div>
            {/* Breakdown Charts Row */}
            <div className="charts-grid mt-4">
                <div className="page-card">
                    <h5 className="page-title">Visit Type — Today</h5>
                    {visitTypeBreakdown.invited === 0 &&
                    visitTypeBreakdown.walkin === 0 ? (
                        <div className="empty-state">
                            <p>No visitors recorded yet today.</p>
                        </div>
                    ) : (
                        <Doughnut
                            data={visitTypeChartData}
                            options={pieOptions}
                        />
                    )}
                </div>

                <div className="page-card">
                    <h5 className="page-title">Incident Severity — All Time</h5>
                    {incidentSeverity.low === 0 &&
                    incidentSeverity.medium === 0 &&
                    incidentSeverity.high === 0 ? (
                        <div className="empty-state">
                            <p>No incidents reported yet.</p>
                        </div>
                    ) : (
                        <Pie
                            data={incidentSeverityChartData}
                            options={pieOptions}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => <AdminLayout>{page}</AdminLayout>;
