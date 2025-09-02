import React, { useEffect, useState } from "react";
import NavbarDashboard from "../components/layout/NavbarDashboard";
import berry1 from "../components/png/berry1.png";
import berry2 from "../components/png/berry2.png";
import { api } from "../utils/axios.js";

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
  const [streak, setStreak] = useState(null);
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

  // moved fetchData outside useEffect so it can be reused after creation
  const fetchData = async () => {
    try {
      setLoading(true);
      // get tasks (active challenges)
      const tasksRes = await api.get("/dashboard/gettasks");
      const tasks = tasksRes?.data?.tasks || [];
      setActiveChallenges(
        tasks.map((t) => ({
          id: t._id,
          title: t.taskName,
          streak: t.streaks || 0,
          achieved: 0,
          notAchieved: 0,
          taskDetails: t.taskDetails,
          taskDuration: t.taskDuration,
          difficulty: t.difficulty,
        }))
      );

      // get achievements & history (server controller may respond variably)
      const achRes = await api.get("/dashboard/achievements").catch(() => ({}));
      // try to read common shapes
      const userAchievements =
        achRes?.data?.userAchievements ||
        achRes?.data?.Achievements ||
        achRes?.data?.achievements ||
        [];
      const userHistoryTask =
        achRes?.data?.userHistoryTask || achRes?.data?.taskHistory || [];
      // use history as normalChallenges placeholder if available
      setNormalChallenges(
        userHistoryTask.length ? userHistoryTask : userAchievements
      );

      // streak
      const streakRes = await api.get("/dashboard/streak").catch(() => ({}));
      const streakVal =
        streakRes?.data?.user?.regularlyComingToWebsiteDays ||
        streakRes?.data?.regularlyComingToWebsiteDays ||
        streakRes?.data?.success ||
        streakRes?.data;
      setStreak(typeof streakVal === "number" ? streakVal : null);
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
    if (!durationNum || durationNum < 7)
      return "Duration must be a number >= 7";
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
      // on success refresh tasks and close modal
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
        alert(res.data.success);
      }
    } catch (error) {
      console.error("Create task error:", error);
      alert(error?.response?.data?.error || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await api.delete("/dashboard/deletetask", {
        data: { id },
      });

      if (response.status === 200) {
        setActiveChallenges((prevChallenges) =>
          prevChallenges.filter((challenge) => challenge.id !== id)
        );
      } else {
        alert(response.data.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Delete task error:", error);
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
        className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] relative overflow-hidden pt-32 px-6 gap-8 flex flex-col"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* top bar with CREATE button */}
        <div className="w-full flex justify-end">
          <button
            className="rounded-lg px-4 py-2 bg-pink-500 text-white font-semibold shadow hover:bg-pink-600"
            onClick={() => setShowCreateModal(true)}
          >
            CREATE
          </button>
        </div>

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

        <div className="relative z-10 w-full flex flex-row gap-6">
          <div className="flex-1 flex overflow-x-auto gap-4 pb-2">
            {(loading ? Array(3).fill({}) : normalChallenges).map(
              (challenge, idx) => (
                <div
                  key={challenge.id || idx}
                  className="min-w-[180px] h-[80px] bg-black/40 border border-white/20 rounded-xl p-3 flex flex-col justify-between shadow-lg backdrop-blur-md cursor-pointer text-white hover:scale-105 transition-transform"
                >
                  <div className="font-bold">
                    {challenge.title || challenge.taskName || "No Title"}
                  </div>
                  <div className="text-xs">
                    {challenge.desc ||
                      challenge.taskDetails ||
                      challenge.description ||
                      ""}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="flex-shrink-0 w-[320px] bg-black/40 border border-white/20 rounded-xl h-[120px] flex flex-col items-center justify-center shadow-lg backdrop-blur-md text-white">
            <span>Calendar (Coming Soon)</span>
            <div className="mt-2">Streak: {streak ?? "—"}</div>
          </div>
        </div>

        <div className="relative z-10 w-full flex flex-row gap-6">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(loading ? Array(6).fill({}) : activeChallenges).map(
              (challenge) => (
                <div
                  key={challenge.id}
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
                    <button className="flex-1 rounded-lg p-2 bg-pink-500/90 font-bold shadow border-none hover:bg-pink-600 transition-all">
                      Edit
                    </button>
                    <button
                      className="flex-1 rounded-lg p-2 bg-red-500/90 font-bold shadow border-none hover:bg-red-600 transition-all"
                      onClick={() => deleteTask(challenge.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="flex-shrink-0 w-[320px] bg-black/40 border border-white/20 rounded-xl h-auto min-h-[480px] flex items-center justify-center shadow-lg backdrop-blur-md text-white font-semibold text-xl">
            Trending
          </div>
        </div>
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
                onChange={(e) =>
                  setForm((p) => ({ ...p, taskName: e.target.value }))
                }
              />
              <input
                className="p-3 rounded bg-black/40 text-white"
                placeholder="Task Image URL"
                value={form.taskImage}
                onChange={(e) =>
                  setForm((p) => ({ ...p, taskImage: e.target.value }))
                }
              />
              <input
                className="p-3 rounded bg-black/40 text-white"
                placeholder="Task Type (e.g. gym)"
                value={form.taskType}
                onChange={(e) =>
                  setForm((p) => ({ ...p, taskType: e.target.value }))
                }
              />
              <textarea
                className="p-3 rounded bg-black/40 text-white"
                placeholder="Task Details"
                value={form.taskDetails}
                onChange={(e) =>
                  setForm((p) => ({ ...p, taskDetails: e.target.value }))
                }
              />
              <input
                className="p-3 rounded bg-black/40 text-white"
                placeholder="Task Duration (days) - min 7"
                type="number"
                min={7}
                value={form.taskDuration}
                onChange={(e) =>
                  setForm((p) => ({ ...p, taskDuration: e.target.value }))
                }
              />
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={form.isChallenger}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isChallenger: e.target.checked }))
                  }
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
              <button
                type="submit"
                disabled={creating}
                className="px-4 py-2 rounded bg-pink-500 text-white"
              >
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
