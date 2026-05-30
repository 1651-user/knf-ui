import { Link } from 'react-router-dom';
import { Play, BarChart3, FileDown, Activity, CheckCircle2, Zap, Clock } from 'lucide-react';
import { StatsCard } from '@/components/shared/StatsCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { QuadrantChart } from '@/components/QuadrantChart';
import { MOCK_RUNS, MOCK_RESULTS, MOCK_QUADRANT_DATA } from '@/data/mockData';

const Dashboard = () => {
  const totalRuns = MOCK_RUNS.length;
  const activeRuns = MOCK_RUNS.filter(r => r.status === 'processing' || r.status === 'queued').length;
  const successRate = Math.round((MOCK_RUNS.filter(r => r.status === 'completed').length / totalRuns) * 100);
  const lastThroughput = MOCK_RUNS[0]?.throughput ?? 0;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Hero Header */}
      <header className="animate-fade-in-up">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
          <span className="text-gradient">KNF Studio</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Descriptor Engine for SNCI / SCDI / KNF Analysis
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in-up delay-1"><StatsCard title="Total Runs" value={totalRuns} icon={Activity} variant="default" /></div>
        <div className="animate-fade-in-up delay-2"><StatsCard title="Active Runs" value={activeRuns} icon={Zap} variant="primary" subtitle="Currently processing" /></div>
        <div className="animate-fade-in-up delay-3"><StatsCard title="Success Rate" value={`${successRate}%`} icon={CheckCircle2} variant="success" /></div>
        <div className="animate-fade-in-up delay-4"><StatsCard title="Last Throughput" value={`${lastThroughput} f/min`} icon={Clock} variant="default" /></div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 animate-fade-in-up delay-3">
        <Link to="/runs" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 transition-all btn-press">
          <Play className="w-4 h-4" /> New Run
        </Link>
        <Link to="/results" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-all btn-press">
          <BarChart3 className="w-4 h-4" /> Open Results
        </Link>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-all btn-press">
          <FileDown className="w-4 h-4" /> Import Example Dataset
        </button>
      </div>

      {/* Recent Runs & Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Runs */}
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in-up delay-4">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">Recent Runs</h2>
          </div>
          <div className="divide-y divide-border">
            {MOCK_RUNS.map((run, i) => (
              <Link
                key={run.id}
                to={`/runs/${run.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-all hover:translate-x-0.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{run.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{run.id} · {run.totalFiles} files</p>
                </div>
                <StatusBadge status={run.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Mini Quadrant Chart */}
        <div className="animate-fade-in-up delay-5">
          <div className="mb-3">
            <h2 className="font-display font-semibold text-foreground">Latest Quadrant Analysis</h2>
            <p className="text-xs text-muted-foreground mt-0.5">From run: {MOCK_RUNS[0]?.name}</p>
          </div>
          <QuadrantChart results={MOCK_RESULTS} quadrantData={MOCK_QUADRANT_DATA} compact />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
