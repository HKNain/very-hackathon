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
  const [days, setDays] = useState(0);
  const [idx, setIdx] = useState(0);
  const [trendingDays, setTrendingDays] = useState(0);

  // modal + form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    taskName: "",
    taskDetails: "",
    taskDuration: "",
    taskType: "",
    isChallenger: false,
  });
  const [formError, setFormError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({
    taskName: "",
    taskDetails: "",
    taskDuration: "",
    taskType: "",
    isStreaksClicked: false,
    isExtraDurationClicked: false,
    isExtraDurationByPoints: false,
    isChallenger: false,
    newImageFile: null,
    imgPreviewUrl: "",
  });
  const [editLoading, setEditLoading] = useState(false);

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
            id: t.taskId,
            title: t.taskName,
            streak: t.streaks,
            taskDetails: t.taskDetails,
            taskDuration: t.taskDuration,
            difficulty: t.difficulty,
            taskType: t.taskType,
            imgSrc: t.taskImage,
            isStreaksClicked: t.isStreaksClicked || false,
            isExtraDurationClicked: t.isExtraDurationClicked || false,
            isExtraDurationByPoints: t.isExtraDurationByPoints || false,
            isChallenger: t.isChallenger,
          }))
      );

      setNormalChallenges(
        tasks
          .filter((t) => t.isChallenger)
          .map((t) => ({
            id: t.taskId,
            title: t.taskName,
            streak: t.streaks,
            taskDetails: t.taskDetails,
            taskDuration: t.taskDuration,
            difficulty: t.difficulty,
            taskType: t.taskType,
            imgSrc: t.taskImage,
            isStreaksClicked: t.isStreaksClicked || false,
            isExtraDurationClicked: t.isExtraDurationClicked || false,
            isExtraDurationByPoints: t.isExtraDurationByPoints || false,
            isChallenger: t.isChallenger,
          }))
      );
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendingData = async () => {
    try {
      const trending = await api.get("/dashboard/trending");
      setIdx(trending.data.index);
      setDays(trending.data.mostPrefferedTracks);
      if(idx == 0){
        setTrendingDays(7)
      }else if(idx == 1){
        setTrendingDays(50);
      }else if(idx == 2){
        setTrendingDays(100);
      }else{
        setTrendingDays(300);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchData();
    getTrendingData();
  }, []);

  const validateForm = () => {
    if (!form.taskName.trim()) return "Task name is required";
    if (!imageFile) return "Task image file is required";
    if (!form.taskDetails.trim()) return "Task details are required";
    if (!form.taskType.trim()) return "Task type is required";
    const durationNum = Number(form.taskDuration);
    if (!durationNum || durationNum < 7)
      return "Duration must be a number >= 7";
    return null;
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setEditForm({
      taskName: task.title || "",
      taskDetails: task.taskDetails || "",
      taskType: task.taskType || "",
      isStreaksClicked: task.isStreaksClicked || false,
      isExtraDurationClicked: task.isExtraDurationClicked || false,
      isExtraDurationByPoints: task.isExtraDurationByPoints || false,
      newImageFile: null,
      imgPreviewUrl: task.imgSrc || "",
    });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditForm({ taskDetails: "" });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setEditForm((p) => ({ ...p, [name]: checked }));
    } else {
      setEditForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm((p) => ({ ...p, newImageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((p) => ({ ...p, imgPreviewUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEdit = async () => {
    if (!editingTaskId) return;

    setEditLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", editingTaskId);
      formData.append("taskName", editForm.taskName);
      formData.append("taskDetails", editForm.taskDetails);
      formData.append("taskType", editForm.taskType);
      formData.append("isStreaksClicked", editForm.isStreaksClicked);
      formData.append(
        "isExtraDurationClicked",
        editForm.isExtraDurationClicked
      );
      formData.append(
        "isExtraDurationByPoints",
        editForm.isExtraDurationByPoints
      );

      if (editForm.newImageFile) {
        formData.append("taskImage", editForm.newImageFile);
      }

      const res = await api.patch("/dashboard/updatetask", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        const updatedTask = res.data.task;

        setActiveChallenges((prev) =>
          prev.map((t) =>
            t.id === updatedTask._id || t.id === updatedTask.id
              ? updatedTask
              : t
          )
        );
        setNormalChallenges((prev) =>
          prev.map((t) =>
            t.id === updatedTask._id || t.id === updatedTask.id
              ? updatedTask
              : t
          )
        );

        toast.success("Task updated successfully");
        cancelEdit();
      } else {
        toast.error("Failed to update task");
      }
    } catch (err) {
      console.error("Update task error:", err);
      toast.error("Error updating task");
    } finally {
      setEditLoading(false);
    }
  };

  // Handle file input change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreviewUrl("");
    }
  };

  // Create task form submit handler using FormData for file upload
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError("");
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("taskName", form.taskName);
      formData.append("taskDetails", form.taskDetails);
      formData.append("taskDuration", form.taskDuration);
      formData.append("taskType", form.taskType);
      formData.append("isChallenger", form.isChallenger);
      formData.append("taskImage", imageFile);

      const res = await api.post("/dashboard/createtask", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowCreateModal(false);
      setForm({
        taskName: "",
        taskDetails: "",
        taskDuration: "",
        taskType: "",
        isChallenger: false,
      });
      setImageFile(null);
      setImagePreviewUrl("");

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

  // Delete task function
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
        style={{ width: `${Math.min((streak) * 8, 100)}%` }}
      />
      <span className="absolute left-2 top-0 text-xs text-white font-semibold">
        {streak} day streak
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
        {/* Left: Challenges */}
        <div className="flex-1 flex flex-col gap-8 overflow-y-auto max-h-[calc(100vh-8rem)] pr-4">
          <section>
            <h2 className="text-white font-bold text-3xl mb-4">
              Normal Challenges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(loading ? Array(3).fill({}) : normalChallenges).map(
                (challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-black/60 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col gap-5 backdrop-blur-lg transition-all hover:scale-105 duration-200 text-white"
                  >
                    {editingTaskId === challenge.id ? (
                      <>
                        <input
                          type="text"
                          name="taskName"
                          value={editForm.taskName}
                          onChange={handleEditChange}
                          placeholder="Task Name"
                          className="p-2 rounded bg-black/20 text-white w-full"
                        />
                        <input
                          type="text"
                          name="taskType"
                          value={editForm.taskType}
                          onChange={handleEditChange}
                          placeholder="Task Type"
                          className="p-2 rounded bg-black/20 text-white w-full mt-2"
                        />
                        <textarea
                          name="taskDetails"
                          value={editForm.taskDetails}
                          onChange={handleEditChange}
                          placeholder="Task Details"
                          rows={3}
                          className="p-2 rounded bg-black/20 text-white w-full mt-2"
                        />
                        Streak++
                        <div className="flex flex-col mt-2 gap-2">
                          <button
                            type="button"
                            name="isStreaksClicked"
                            onClick={() =>
                              setEditForm((p) => ({
                                ...p,
                                isStreaksClicked: !p.isStreaksClicked,
                              }))
                            }
                            className={`px-3 py-1 rounded font-semibold text-white transition-colors ${
                              editForm.isStreaksClicked
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {editForm.isStreaksClicked ? "True" : "False"}
                          </button>
                          Streak Freeze
                          <button
                            type="button"
                            name="isExtraDurationClicked"
                            onClick={() =>
                              setEditForm((p) => ({
                                ...p,
                                isExtraDurationClicked:
                                  !p.isExtraDurationClicked,
                              }))
                            }
                            className={`px-3 py-1 rounded font-semibold text-white transition-colors ${
                              editForm.isExtraDurationClicked
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {editForm.isExtraDurationClicked ? "True" : "False"}
                          </button>
                          Streak Freeze(By points)
                          <button
                            type="button"
                            name="isExtraDurationByPoints"
                            onClick={() =>
                              setEditForm((p) => ({
                                ...p,
                                isExtraDurationByPoints:
                                  !p.isExtraDurationByPoints,
                              }))
                            }
                            className={`px-3 py-1 rounded font-semibold text-white transition-colors ${
                              editForm.isExtraDurationByPoints
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {editForm.isExtraDurationByPoints
                              ? "True"
                              : "False"}
                          </button>
                        </div>
                        <div className="mt-3">
                          <label className="block mb-1">
                            Update Image (optional)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                            className="text-white"
                          />
                          {editForm.imgPreviewUrl && (
                            <img
                              src={editForm.imgPreviewUrl}
                              alt="Preview"
                              className="rounded mt-2 max-h-40 object-contain"
                            />
                          )}
                        </div>
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={saveEdit}
                            disabled={editLoading}
                            className="bg-green-600 px-4 py-1 rounded text-white"
                          >
                            {editLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-600 px-4 py-1 rounded text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center font-bold text-2xl mb-2">
                          {challenge.title || "Untitled"}
                        </div>
                        <div className="flex flex-row justify-between gap-5">
                          <img
                            src={challenge.imgSrc}
                            alt={`img-${challenge.title}`}
                          />
                        </div>
                        <p className="mt-2 text-white whitespace-pre-wrap">
                          {challenge.taskDetails}
                        </p>
                        <StreakBar streak={challenge.streak} />
                        <div className="flex flex-row justify-between mt-2 gap-4">
                          <button
                            className="flex-1 rounded-lg p-2 bg-pink-500/90 font-bold shadow border-none hover:bg-pink-600 transition-all"
                            onClick={() => handleEditClick(challenge)}
                          >
                            Edit
                          </button>
                          <button
                            className="flex-1 rounded-lg p-2 bg-red-500/90 font-bold shadow border-none hover:bg-red-600 transition-all"
                            onClick={() => deleteTask(challenge.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          </section>

          <section>
            <h2 className="text-white font-bold text-3xl mb-4">
              Active Challenges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(loading ? Array(3).fill({}) : activeChallenges).map(
                (challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-black/60 border border-white/20 rounded-2xl shadow-xl p-6 flex flex-col gap-5 backdrop-blur-lg transition-all hover:scale-105 duration-200 text-white"
                  >
                    {editingTaskId === challenge.id ? (
                      <>
                        <input
                          type="text"
                          name="taskName"
                          value={editForm.taskName}
                          onChange={handleEditChange}
                          placeholder="Task Name"
                          className="p-2 rounded bg-black/20 text-white w-full"
                        />
                        <input
                          type="text"
                          name="taskType"
                          value={editForm.taskType}
                          onChange={handleEditChange}
                          placeholder="Task Type"
                          className="p-2 rounded bg-black/20 text-white w-full mt-2"
                        />
                        <textarea
                          name="taskDetails"
                          value={editForm.taskDetails}
                          onChange={handleEditChange}
                          placeholder="Task Details"
                          rows={3}
                          className="p-2 rounded bg-black/20 text-white w-full mt-2"
                        />
                        <div className="flex flex-col mt-2 gap-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="isStreaksClicked"
                              checked={editForm.isStreaksClicked}
                              onChange={handleEditChange}
                            />
                            Is Streaks Clicked
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="isExtraDurationClicked"
                              checked={editForm.isExtraDurationClicked}
                              onChange={handleEditChange}
                            />
                            Is Extra Duration Clicked
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="isExtraDurationByPoints"
                              checked={editForm.isExtraDurationByPoints}
                              onChange={handleEditChange}
                            />
                            Is Extra Duration By Points
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="isChallenger"
                              checked={editForm.isChallenger}
                              onChange={handleEditChange}
                            />
                            Is Challenger
                          </label>
                        </div>
                        <div className="mt-3">
                          <label className="block mb-1">
                            Update Image (optional)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                            className="text-white"
                          />
                          {editForm.imgPreviewUrl && (
                            <img
                              src={editForm.imgPreviewUrl}
                              alt="Preview"
                              className="rounded mt-2 max-h-40 object-contain"
                            />
                          )}
                        </div>
                        <div className="flex gap-4 mt-4">
                          <button
                            onClick={saveEdit}
                            disabled={editLoading}
                            className="bg-green-600 px-4 py-1 rounded text-white"
                          >
                            {editLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-600 px-4 py-1 rounded text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center font-bold text-2xl mb-2">
                          {challenge.title || "Untitled"}
                        </div>
                        <div className="flex flex-row justify-between gap-5">
                          <img
                            src={challenge.imgSrc}
                            alt={`img-${challenge.title}`}
                          />
                        </div>
                        <p className="mt-2 text-white whitespace-pre-wrap">
                          {challenge.taskDetails}
                        </p>
                        <StreakBar streak={challenge.streak} />
                        <div className="flex flex-row justify-between mt-2 gap-4">
                          <button
                            className="flex-1 rounded-lg p-2 bg-pink-500/90 font-bold shadow border-none hover:bg-pink-600 transition-all"
                            onClick={() => handleEditClick(challenge)}
                          >
                            Edit
                          </button>
                          <button
                            className="flex-1 rounded-lg p-2 bg-red-500/90 font-bold shadow border-none hover:bg-red-600 transition-all"
                            onClick={() => deleteTask(challenge.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
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

          <div className="bg-black/40 border border-white/20 rounded-xl h-[160px] flex items-center justify-center shadow-lg backdrop-blur-md text-white font-semibold text-xl" >
            Trending {trendingDays} Days Challenge
            <br />
            Trending {days} Days Non-challenger 
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
                onChange={(e) =>
                  setForm((p) => ({ ...p, taskName: e.target.value }))
                }
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="p-3 rounded bg-black/40 text-white"
              />
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="rounded mt-2 max-h-40 object-contain"
                />
              )}
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
