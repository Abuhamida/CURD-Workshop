import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { CalendarDays, CheckCircle, Clock, ClipboardList } from "lucide-react";
import "chart.js/auto";
import {supabase} from "../../lib/supabase"

const STATUS_CONFIG = {
  todo: { label: "To Do", color: "#f43f5e", icon: ClipboardList },
  in_progress: { label: "In Progress", color: "#f59e0b", icon: Clock },
  review: { label: "Review", color: "#3b82f6", icon: CalendarDays },
  done: { label: "Done", color: "#22c55e", icon: CheckCircle },
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase.from("todos").select("*");
    if (error) console.error(error);
    else setTasks(data);
    setLoading(false);
  }

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status).length;
    return acc;
  }, {});

  const chartData = {
    labels: Object.values(STATUS_CONFIG).map((s) => s.label),
    datasets: [
      {
        data: Object.keys(STATUS_CONFIG).map((s) => counts[s]),
        backgroundColor: Object.keys(STATUS_CONFIG).map((s) => STATUS_CONFIG[s].color),
        borderWidth: 1,
      },
    ],
  };

  const upcomingTasks = [...tasks]
    .filter((t) => t.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(STATUS_CONFIG).map(([key, { label, color, icon: Icon }]) => (
              <div 
                key={key} 
                className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className="p-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  <Icon size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
                  <p className="text-xl sm:text-2xl font-bold">{counts[key]}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Section - Takes full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Tasks by Status</h2>
              <div className="w-full h-auto max-h-96 aspect-square md:aspect-video lg:aspect-square mx-auto">
                <Pie 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                          pointStyle: 'circle'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Upcoming Deadlines - Takes full width on mobile, 1/3 on desktop */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Upcoming Deadlines</h2>
              {upcomingTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming tasks.</p>
              ) : (
                <ul className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <li 
                      key={task.id} 
                      className="p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-700 truncate">{task.title}</p>
                          <div className="flex items-center mt-1">
                            <span 
                              className="inline-block w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: STATUS_CONFIG[task.status]?.color }}
                            ></span>
                            <p className="text-xs text-gray-500">
                              {STATUS_CONFIG[task.status]?.label || task.status}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap ml-2">
                          {new Date(task.due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}