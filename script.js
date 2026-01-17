// ----------------
// STATE
// ----------------
let state = JSON.parse(localStorage.getItem("state")) || {
  today: [],
  history: {},  // format: { '2026-01-17': [{name:'Shower', done:true}, ...] }
  badges: []
};

// Default hygiene tasks
const BASE_HABITS = [
  {name: "Shower", done: false},
  {name: "Brush Teeth", done: false},
  {name: "Deodorant", done: false}
];

// ----------------
// INITIALIZATION
// ----------------
function init() {
  if (state.today.length === 0) {
    state.today = [...BASE_HABITS];
  }
  renderPlan();
  renderCalendar();
  renderBadges();
}
init();

// ----------------
// TODAY'S PLAN
// ----------------
const planList = document.getElementById("planList");
const planSettings = document.getElementById("planSettings");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const generatePlanBtn = document.getElementById("generatePlan");

function renderPlan() {
  planList.innerHTML = "";
  state.today.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" ${task.done ? 'checked' : ''}> ${task.name}`;
    li.querySelector("input").addEventListener("change", () => {
      task.done = !task.done;
      saveState();
      renderCalendar(); // update calendar highlight
    });
    planList.appendChild(li);
  });
}

// Open popup for personal questions
planSettings.addEventListener("click", () => {
  popup.classList.remove("hidden");
});

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});

// Generate custom plan based on questions
generatePlanBtn.addEventListener("click", () => {
  const activity = document.getElementById("activity").value;
  const sweat = document.getElementById("sweat").value;
  const skincare = document.getElementById("skincare").value;

  let newPlan = [
    {name: "Brush Teeth", done:false},
    {name: "Shower", done:false},
    {name: "Deodorant", done:false}
  ];

  if (activity === "high" || sweat === "yes") newPlan.push({name:"Extra Shower", done:false});
  if (skincare === "yes") newPlan.push({name:"Face Care", done:false});

  state.today = newPlan;
  popup.classList.add("hidden");
  saveState();
  renderPlan();
  renderCalendar();
});

// ----------------
// CALENDAR
// ----------------
const calendar = document.getElementById("calendar");
const dayPopup = document.getElementById("dayPopup");
const dayTasks = document.getElementById("dayTasks");
const dayTitle = document.getElementById("dayTitle");
const closeDayPopup = document.getElementById("closeDayPopup");

function renderCalendar() {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const lastDate = new Date(year, month+1,0).getDate();

  calendar.innerHTML = "";

  // Header
  const headerRow = document.createElement("tr");
  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d=>{
    const th = document.createElement("th");
    th.innerText = d;
    headerRow.appendChild(th);
  });
  calendar.appendChild(headerRow);

  let row = document.createElement("tr");
  for(let i=0;i<firstDay;i++){
    row.appendChild(document.createElement("td"));
  }

  for(let d=1;d<=lastDate;d++){
    if(row.children.length===7){
      calendar.appendChild(row);
      row = document.createElement("tr");
    }

    const td = document.createElement("td");
    td.innerText = d;
    const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    if(state.history[dateKey] && state.history[dateKey].every(t=>t.done)){
      td.classList.add("completed");
    }

    td.addEventListener("click",()=>{
      openDayPopup(dateKey);
    });

    row.appendChild(td);
  }

  while(row.children.length<7){
    row.appendChild(document.createElement("td"));
  }
  calendar.appendChild(row);
}

function openDayPopup(dateKey){
  dayPopup.classList.remove("hidden");
  dayTitle.innerText = `Tasks for ${dateKey}`;
  dayTasks.innerHTML = "";
  const tasks = state.history[dateKey] || [];
  tasks.forEach(t=>{
    const li = document.createElement("li");
    li.innerText = `${t.done ? "✅" : "❌"} ${t.name}`;
    dayTasks.appendChild(li);
  });
}

closeDayPopup.addEventListener("click",()=>{
  dayPopup.classList.add("hidden");
});

// Save today tasks to history at end of day (for demo, we'll save on checkbox change)
function saveHistory(){
  const todayKey = new Date().toISOString().slice(0,10);
  state.history[todayKey] = state.today.map(t=>({name:t.name,done:t.done}));
}

// ----------------
// BADGES
// ----------------
const badgesDiv = document.getElementById("badges");

function renderBadges(){
  badgesDiv.innerHTML = "";
  state.badges.forEach(b=>{
    const div = document.createElement("div");
    div.className="badge";
    div.innerText = b;
    badgesDiv.appendChild(div);
  });
}

// ----------------
// SAVE STATE
// ----------------
function saveState(){
  saveHistory();
  localStorage.setItem("state",JSON.stringify(state));
  renderBadges();
}

// Elements
const planSettings = document.getElementById("planSettings");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const generatePlanBtn = document.getElementById("generatePlan");

// Open popup when ⚙️ button is clicked
planSettings.addEventListener("click", () => {
  popup.classList.remove("hidden");
});

// Close popup when Cancel is clicked
closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});

// Generate personalized plan when button clicked
generatePlanBtn.addEventListener("click", () => {
  const activity = document.getElementById("activity").value;
  const sweat = document.getElementById("sweat").value;
  const skincare = document.getElementById("skincare").value;

  let newPlan = [
    {name: "Brush Teeth", done:false},
    {name: "Shower", done:false},
    {name: "Deodorant", done:false}
  ];

  if(activity === "high" || sweat === "yes") newPlan.push({name:"Extra Shower", done:false});
  if(skincare === "yes") newPlan.push({name:"Face Care", done:false});

  state.today = newPlan;
  popup.classList.add("hidden");  // hide popup
  saveState();
  renderPlan();
  renderCalendar();
});
