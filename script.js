function generatePlan() {
  const activity = document.getElementById("activity").value;
  const sweat = document.getElementById("sweat").value;
  const busy = document.getElementById("busy").value;

  let shower;
  if (activity === "high" || sweat === "yes") {
    shower = "Shower every day 🚿";
  } else if (activity === "medium") {
    shower = "Shower every other day";
  } else {
    shower = "Shower at least 3 times a week";
  }

  let reminder;
  if (busy === "chaos") {
    reminder = "Even your code gets refreshed sometimes. You should too.";
  } else {
    reminder = "Clean habits = clean commits.";
  }

  document.getElementById("output").innerHTML = `
    <h3>Your Personal Hygiene Plan</h3>
    <ul>
      <li>${shower}</li>
      <li>Brush teeth twice a day 🦷</li>
      <li>Use deodorant daily 🧴</li>
      <li>Change clothes regularly 👕</li>
    </ul>
    <p><strong>Friendly reminder:</strong> ${reminder}</p>
  `;
}
