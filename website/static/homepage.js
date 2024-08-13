import {weekdayStrFromNo, pythonToJSDay} from "./utils.js";
import {Habit, HabitDisplayManager} from "./habit.js";

export const homepageHabitManager = new HabitDisplayManager(document.getElementsByClassName("card")[0], document.getElementById("content"));

function openProfileMenu() {
    var profileMenu = document.getElementById("profile-menu");
    profileMenu.classList.remove("hidden");
    profileMenu.classList.add("visible");
}

function closeProfileMenu() {
    var profileMenu = document.getElementById("profile-menu");
    profileMenu.classList.remove("visible");
    profileMenu.classList.add("hidden");
}

document.querySelector('.menu-trigger').addEventListener('click', function() {
    document.getElementById('sideMenu').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('visible');
});

document.getElementById('overlay').addEventListener('click', function() {
    document.getElementById('sideMenu').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
});

function displayAllHabits() {
    // // Remove all cards
    // const cards = document.getElementsByClassName("card");
    // for (let i=1; i<cards.length; i++) { // Spare the first invisible card to use as template
    //     habitsDiv.remove(cards[i]);
    // }

    fetch("/get_all_habits")
    .then(response => response.json())
    .then(habits => {
        for (let habit of habits) {
            homepageHabitManager.displayNewHabit(habit);
        }
    })
}

document.getElementById('addTaskButton').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText !== '') {
        const taskList = document.getElementById('taskList');

        const li = document.createElement('li');
        li.className = 'task-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function() {
            li.classList.toggle('completed');
        });
        
        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(taskText));
        taskList.appendChild(li);

        taskInput.value = '';
    }
});

document.addEventListener('DOMContentLoaded', displayAllHabits);