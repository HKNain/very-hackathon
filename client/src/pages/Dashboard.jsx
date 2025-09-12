import React, { useEffect, useState } from "react";
import NavbarDashboard from "../components/layout/NavbarDashboard";
import berry1 from "../components/png/berry1.png";
import berry2 from "../components/png/berry2.png";
import { api } from "../utils/axios.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../CalendarCustom.css";
import toast from "react-hot-toast";

const floatingPNGs = [berry1, berry2, berry1, berry2, berry1, berry2];
const getRandomPosition = () => {
  let top, left;
  do {
    top = Math.random() * 100;
    left = Math.random() * 100;
  } while (top > 40 && top < 60 && left > 30 && left < 70);
  return { top: `${top}%`, left: `${left}%` };
};

const Dashboard = () => {
  const [normalChallenges, setNormalChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal + form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    taskName: "",
    taskImage: "",
    taskDetails: "",
    taskDuration: "",
    taskType: "",
    isChallenger: false,
  });
  const [formError, setFormError] = useState("");

  const randomPositions = floatingPNGs.map(() => ({
    ...getRandomPosition(),
    size: 90 + Math.random() * 35,
    duration: Math.random() * 6 + 6,
  }));

  // Fetch tasks and set states
  const fetchData = async () => {
    try {
      setLoading(true);
      const tasksRes = await api.get("/dashboard/gettasks");
      const tasks = tasksRes?.data?.tasks || [];

      setActiveChallenges(
        tasks
          .filter((t) => !t.isChallenger)
          .map((t) => ({
            id: t.trackId,
            title: t.taskName,
            streak: t.streaks || 0,
            achieved: 0,
            notAchieved: 0,
            taskDetails: t.taskDetails,
            taskDuration: t.taskDuration,
            difficulty: t.difficulty,
          }))
      );

      setNormalChallenges(
        tasks
          .filter((t) => t.isChallenger)
          .map((t) => ({
            id: t.trackId,
            title: t.taskName,
            streak: t.streaks || 0,
            achieved: 0,
            notAchieved: 0,
            taskDetails: t.taskDetails,
            taskDuration: t.taskDuration,
            difficulty: t.difficulty,
          }))
      );
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateForm = () => {
    if (!form.taskName.trim()) return "Task name is required";
    if (!form.taskImage.trim()) return "Task image URL is required";
    if (!form.taskDetails.trim()) return "Task details are required";
    if (!form.taskType.trim()) return "Task type is required";
    const durationNum = Number(form.taskDuration);
    if (!durationNum || durationNum < 7) return "Duration must be a number >= 7";
    return null;
  };

  const handleCreateSubmit = async (e) => {
    e?.preventDefault();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError("");
    setCreating(true);
    try {
      const payload = {
        taskName: form.taskName,
        taskImage: form.taskImage,
        taskDetails: form.taskDetails,
        taskDuration: Number(form.taskDuration),
        taskType: form.taskType,
        isChallenger: Boolean(form.isChallenger),
      };
      const res = await api.post("/dashboard/createtask", payload);
      setShowCreateModal(false);
      setForm({
        taskName: "",
        taskImage: "",
        taskDetails: "",
        taskDuration: "",
        taskType: "",
        isChallenger: false,
      });
      await fetchData();
      if (res?.data?.success) {
        toast.success("Task created Successfully");
      }
    } catch (error) {
      console.error("Create task error:", error);
      alert(error?.response?.data?.error || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  // Delete task from both lists
  const deleteTask = async (id) => {
    if (!id) {
      toast.error("Id not present");
      return;
    }
    try {
      const response = await api.delete("/dashboard/deletetask", {
        data: { id },
      });

      if (response.status === 200) {
        setActiveChallenges((prev) => prev.filter((task) => task.id !== id));
        setNormalChallenges((prev) => prev.filter((task) => task.id !== id));
        toast.success("Task deleted Successfully");
      } else {
        toast.error("Failed to delete Task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const StreakBar = ({ streak }) => (
    <div className="w-full h-5 rounded bg-white/20 overflow-hidden relative">
      <div
        className="h-full bg-gradient-to-r from-pink-400 to-blue-400 rounded"
        style={{ width: `${Math.min((streak || 0) * 8, 100)}%` }}
      />
      <span className="absolute left-2 top-0 text-xs text-white font-semibold">
        {streak ?? 0} day streak
      </span>
    </div>
  );

  return (
    <>
      <NavbarDashboard />
      <div
        className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] relative overflow-hidden pt-32 px-6 gap-8 flex flex-row"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* Left: Challenges section with headings */}
        <div className="flex-1 flex flex-col gap-8 overflow-y-auto max-h-[calc(100vh-8rem)] pr-4">
          <section>
            <h2 className="text-white font-bold text-3xl mb-4">Normal Challenges</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(loading ? Array(3).fill({}) : normalChallenges).map((challenge, idx) => (
                <div
                  key={challenge.id || idx}
                  className="bg-black/60 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col gap-5 backdrop-blur-lg transition-all hover:scale-105 duration-200 text-white"
                >
                  <div className="text-center font-bold text-2xl mb-2">
                    {challenge.title || "Untitled"}
                  </div>
                  <div className="flex flex-row justify-between gap-5">
                    <div className="flex-1 bg-black/40 rounded-xl p-3 text-center border border-white/20 shadow">
                      <div className="font-semibold">Achieved</div>
                      <div>{challenge.achieved ?? 0}</div>
                    </div>
                    <div className="flex-1 bg-black/40 rounded-xl p-3 text-center border border-white/20 shadow">
                      <div className="font-semibold">Not Achieved</div>
                      <div>{challenge.notAchieved ?? 0}</div>
                    </div>
                  </div>
                  <StreakBar streak={challenge.streak} />
                  <div className="flex flex-row justify-between mt-2 gap-4">
                    <button className="flex-1 rounded-lg p-2 bg-pink-500/90 font-bold shadow border-none hover:bg-pink-600 transition-all">Edit</button>
                    <button
                      className="flex-1 rounded-lg p-2 bg-red-500/90 font-bold shadow border-none hover:bg-red-600 transition-all"
                      onClick={() => deleteTask(challenge.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-3xl mb-4">Active Challenges</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(loading ? Array(3).fill({}) : activeChallenges).map((challenge, idx) => (
                <div
                  key={challenge.id || idx}
                  className="bg-black/60 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col gap-5 backdrop-blur-lg transition-all hover:scale-105 duration-200 text-white"
                >
                  <div className="text-center font-bold text-2xl mb-2">
                    {challenge.title || "Untitled"}
                  </div>
                  <div className="flex flex-row justify-between gap-5">
                    <div className="flex-1 bg-black/40 rounded-xl p-3 text-center border border-white/20 shadow">
                      <div className="font-semibold">Achieved</div>
                      <div>{challenge.achieved ?? 0}</div>
                    </div>
                    <div className="flex-1 bg-black/40 rounded-xl p-3 text-center border border-white/20 shadow">
                      <div className="font-semibold">Not Achieved</div>
                      <div>{challenge.notAchieved ?? 0}</div>
                    </div>
                  </div>
                  <StreakBar streak={challenge.streak} />
                  <div className="flex flex-row justify-between mt-2 gap-4">
                    <button className="flex-1 rounded-lg p-2 bg-pink-500/90 font-bold shadow border-none hover:bg-pink-600 transition-all">Edit</button>
                    <button
                      className="flex-1 rounded-lg p-2 bg-red-500/90 font-bold shadow border-none hover:bg-red-600 transition-all"
                      onClick={() => deleteTask(challenge.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Create, Calendar, Trending */}
        <div className="w-[360px] flex flex-col gap-6">
          <button
            className="rounded-lg px-4 py-2 bg-pink-500 text-white font-semibold shadow hover:bg-pink-600"
            onClick={() => setShowCreateModal(true)}
          >
            CREATE
          </button>

          <div className="bg-black/40 border border-white/20 rounded-xl h-[280px] flex flex-col items-center justify-center shadow-lg backdrop-blur-md text-white">
            <Calendar />
          </div>

          <div className="bg-black/40 border border-white/20 rounded-xl h-[160px] flex items-center justify-center shadow-lg backdrop-blur-md text-white font-semibold text-xl">
            Trending (Upcoming)
          </div>
        </div>

        {/* Floating PNGs */}
        {floatingPNGs.map((png, i) => (
          <img
            key={i}
            src={png}
            alt={`floating-${i}`}
            className="absolute animate-floatGlow pointer-events-none opacity-60"
            style={{
              ...randomPositions[i],
              width: randomPositions[i].size,
              height: randomPositions[i].size,
              animationDuration: `${randomPositions[i].duration}s`,
              filter: "drop-shadow(0 0 20px rgba(236,72,153,0.6))",
              zIndex: 1,
            }}
          />
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !creating && setShowCreateModal(false)}
          />
          <form
            onSubmit={handleCreateSubmit}
            className="relative z-50 w-full max-w-xl bg-[#0b0b0f] rounded-xl border border-white/20 p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Create Task</h2>

            {formError && <div className="text-red-400 mb-2">{formError}</div>}

            <div className="grid grid-cols-1 gap-3">
              <input
                className="p-3 rounded bg-black/40 text-white"
                placeholder="Task Name"
                value={form.taskName}
                onChange={(e) => setForm((p) => ({ ...p, taskName: e.target.value }))}
              />
              <input
                className="p-3 rounded bg-black/40 text-white"
                placeholder="Task Image URL"
                value={form.taskImage}
                onChange={(e) => setForm((p) => ({ ...p, taskImage: e.target.value }))}
              />
              <input
                className="p-3 rounded bg-black/40 text-white"
                placeholder="Task Type (e.g. gym)"
                value={form.taskType}
                onChange={(e) => setForm((p) => ({ ...p, taskType: e.target.value }))}
              />
              <textarea
                className="p-3 rounded bg-black/40 text-white"
                placeholder="Task Details"
                value={form.taskDetails}
                onChange={(e) => setForm((p) => ({ ...p, taskDetails: e.target.value }))}
              />
              <input
                className="p-3 rounded bg-black/40 text-white"
                placeholder="Task Duration (days) - min 7"
                type="number"
                min={7}
                value={form.taskDuration}
                onChange={(e) => setForm((p) => ({ ...p, taskDuration: e.target.value }))}
              />
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={form.isChallenger}
                  onChange={(e) => setForm((p) => ({ ...p, isChallenger: e.target.checked }))}
                />
                Is Challenger
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-600 text-white"
                onClick={() => !creating && setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button type="submit" disabled={creating} className="px-4 py-2 rounded bg-pink-500 text-white">
                {creating ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Dashboard;
