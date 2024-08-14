import { DailyHabit } from "./daily_review.js";

// Tab switching functionality
document.getElementById('check-in-tab').addEventListener('click', function() {
    switchTab('check-in-section', this);
});
document.getElementById('daily-tab').addEventListener('click', function() {
    switchTab('daily-review-section', this);
});
document.getElementById('weekly-tab').addEventListener('click', function() {
    switchTab('weekly-review-section', this);
});

function switchTab(sectionId, tab) {
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    tab.classList.add('active');
}

function displayTodaysHabits() {
    fetch("/get_todays_habits")
    .then(response => response.json())
    .then(todays_habits => {
        for (let habit of todays_habits) {
            const habitDisplay = new DailyHabit(habit['id']);
            console.log(`${habit.name}: ${habit.completion}`)
            if (habit['completion']) {
                habitDisplay.displayCompletedHabit(habit['name'], habit['completion']['completion_notes']);
            }
            else {
                habitDisplay.displayHabit();
            }
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    displayTodaysHabits();
})
