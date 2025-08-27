import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const user = {
  username: 'Hitesh',
  email: 'hitesh@example.com',
};

const achievements = ["Steps Master", "Hydration Pro", "Yoga Flow", "Power Lifter"];
const milestones = ["100 Workouts", "1 Year Active", "500km Run", "Sleep Streak"];
const badges = ["200 Days Badge", "Challenge Champion", "Night Owl", "Early Bird"];
const challenges = ["August Step-Up", "Hydrate Weekly", "Monthly Core", "Yoga Daily"];

const heatmapData = Array.from({ length: 365 }, (_, idx) => ({
  date: new Date(2025, 0, 1 + idx).toISOString().slice(0, 10),
  count: Math.floor(Math.random() * 5), // Example data
}));

const sidebarStyle = "bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000] text-white w-64 min-h-screen flex flex-col justify-between rounded-r-3xl shadow-lg p-8";
const btnStyle = "w-full px-4 py-2 rounded-lg mt-2 font-semibold transition bg-pink-500 hover:bg-pink-600 text-white";

const sectionStyle = "bg-black/60 border border-pink-400 rounded-xl shadow-lg p-6 mb-8 flex flex-col items-center";
const titleStyle = "text-lg font-bold mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent";

const Profile = () => (
  <div className="min-h-screen w-full flex font-poppins bg-gradient-to-br from-[#0a0a0f] via-[#120018] to-[#000000]">
    {/* Sidebar */}
    <aside className={sidebarStyle}>
      <div>
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://i.pravatar.cc/150"
            alt="User"
            className="h-20 w-20 rounded-full border-4 border-pink-500 mb-3 object-cover"
          />
          <p className="text-2xl font-bold">{user.username}</p>
          <p className="text-sm text-gray-300">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-10">
        <button className={btnStyle} onClick={() => alert("Signed out!")}>Sign Out</button>
        <button className="w-full px-4 py-2 rounded-lg mt-2 font-semibold transition bg-red-600 hover:bg-red-700 text-white"
          onClick={() => alert("Deleted account!")}>Delete Account</button>
      </div>
    </aside>

    {/* Main Content */}
    <main className="flex-1 flex flex-col items-center py-10 px-4">
      {/* 2x2 Grid for Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-10 w-full max-w-5xl mb-10">
        {/* Achievements */}
        <section className={sectionStyle}>
          <span className={titleStyle}>Achievements</span>
          <ul>
            {achievements.map((a, i) => (
              <li key={i} className="text-pink-300 mb-1">{a}</li>
            ))}
          </ul>
        </section>
        {/* Milestones */}
        <section className={sectionStyle}>
          <span className={titleStyle}>Milestones</span>
          <ul>
            {milestones.map((m, i) => (
              <li key={i} className="text-purple-300 mb-1">{m}</li>
            ))}
          </ul>
        </section>
        {/* Badges */}
        <section className={sectionStyle}>
          <span className={titleStyle}>Badges</span>
          <div className="flex gap-2 mt-2">
            {badges.map((badge, i) => (
              <div key={i}
                className="px-3 py-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl drop-shadow-md text-white text-xs">
                {badge}
              </div>
            ))}
          </div>
        </section>
        {/* Challenges */}
        <section className={sectionStyle}>
          <span className={titleStyle}>Challenges</span>
          <ul>
            {challenges.map((ch, i) => (
              <li key={i} className="text-blue-300 mb-1">{ch}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Heatmap Section */}
      <div className="w-full max-w-4xl bg-black/60 border border-pink-500 rounded-2xl p-8 mb-2 shadow-lg">
        <h2 className={titleStyle}>Activity Heatmap</h2>
        <CalendarHeatmap
          startDate={new Date(2025, 0, 1)}
          endDate={new Date(2025, 11, 31)}
          values={heatmapData}
          classForValue={value => {
            if (!value || value.count === 0) {
              return "color-empty";
            }
            if (value.count < 2) {
              return "color-scale-1";
            }
            if (value.count < 4) {
              return "color-scale-2";
            }
            return "color-scale-3";
          }}
          showWeekdayLabels
        />
        {/* Custom styles for heatmap cells */}
        <style>{`
          .color-empty { fill: #232323; }
          .color-scale-1 { fill: #ec4899; }
          .color-scale-2 { fill: #a78bfa; }
          .color-scale-3 { fill: #38bdf8; }
        `}
        </style>
      </div>
    </main>
  </div>
);

export default Profile;
