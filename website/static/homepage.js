import {weekdayStrFromNo, pythonToJSDay} from "./utils.js";
import {Habit, HabitDisplayManager} from "./habit.js";

export const homepageHabitManager = new HabitDisplayManager(document.getElementsByClassName("card")[0], document.getElementById("content"));

document.getElementById('clear-tasks').addEventListener('click', function() {
    const taskList = document.getElementById('todo-list');
    taskList.innerHTML = '';
});

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

document.getElementById('add-task').addEventListener('click', function() {
    const taskInput = document.getElementById('todo-input');
    const taskValue = taskInput.value.trim();
    if (taskValue) {
        const taskList = document.getElementById('todo-list');
        const newTask = document.createElement('li');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';

        checkbox.addEventListener('click', function() {
            newTask.classList.toggle('completed');
        });

        newTask.appendChild(checkbox);
        newTask.appendChild(document.createTextNode(taskValue));
        taskList.appendChild(newTask);
        taskInput.value = '';
    }
});

document.getElementById('clear-tasks').addEventListener('click', function() {
    const taskList = document.getElementById('todo-list');
    taskList.innerHTML = '';
});



const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "All that glitters is not gold. - William Shakespeare",
    "All the world’s a stage, and all the men and women merely players. - William Shakespeare"
];

const quoteElement = document.getElementById("quote");

function generateRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.textContent = quotes[randomIndex];
}

// Set an interval to generate a new quote every 5 seconds (5000 milliseconds)
setInterval(generateRandomQuote, 5000);

document.addEventListener('DOMContentLoaded', displayAllHabits);