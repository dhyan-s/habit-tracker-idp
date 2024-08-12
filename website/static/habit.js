import {weekdayStrFromNo, pythonToJSDay} from "./utils.js";

export class Habit {
    #templateDiv;

    constructor(templateDiv, parentDiv, habitData) {
        this.#templateDiv = templateDiv;
        this.habitData = habitData;
        this.parentDiv = parentDiv;
        this.createHabitDiv();
        this.hideHabitDiv();
    }

    openHabitInfo(event) {
        var currentDiv = event.currentTarget;
        var detailsDiv = currentDiv.getElementsByClassName("habit-details")[0];
        if (detailsDiv.classList.contains("hidden")) {
            detailsDiv.classList.remove("hidden");
            detailsDiv.classList.add("open");
        } else {
            detailsDiv.classList.add("hidden");
            detailsDiv.classList.remove("open");
        }
    }
    
    updateHabitData() {
        this.habitDiv.querySelector(".habit-title").textContent = this.habitData.name;
        this.habitDiv.querySelector(".habit-notes").textContent = this.habitData.notes;
    
        const weekDiv = this.habitDiv.querySelector(".week");
        const dayDivs = weekDiv.querySelectorAll(".day");
        dayDivs.forEach(
            dayDiv => {
                dayDiv.style.display = "none";
            }
        )
    
        // Display only days which are part of the habit
        fetch(`/get_weekly_completion?habit_id=${this.habitData.id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const keys = Object.keys(data);
            // Handle the days completion display
            keys.forEach(
                dayNo => {
                    let dayDiv = weekDiv.querySelector(`.${weekdayStrFromNo(dayNo)}`);
                    dayDiv.style.display = "flex";
                    if (data[dayNo] == true) {
                        dayDiv.classList.add("completed");
                    }
                    else if (data[dayNo] == false) {
                        dayDiv.classList.add("missed");
                    }
                    // else if (pythonToJSDay(dayNo) == new Date().getDay()) {
                    //     console.log(data['habit_name'], dayNo, pythonToJSDay(dayNo), new Date().getDay());
                    //     dayDiv.classList.add("today");
                    // }
                    else {
                        dayDiv.classList.remove("completed", "missed", "today");
                    }
                }
            )
        })
    }

    createHabitDiv() {
        this.habitDiv = this.#templateDiv.cloneNode(true);
        this.habitDiv.onclick = this.openHabitInfo

        this.updateHabitData(this.habitDiv, this.habitData);

        this.parentDiv.appendChild(this.habitDiv);
    }

    hideHabitDiv() {
        this.habitDiv.style.display = "none";
    }

    showHabitDiv() {
        this.habitDiv.style.display = "block";
    }
}


export class HabitDisplayManager {
    #templateDiv;
    constructor(templateDiv, parentDiv) {
        this.#templateDiv = templateDiv;
        this.parentDiv = parentDiv;

        this.habitList = []
    }

    displayNewHabit(habitData) {
        const habit = new Habit(this.#templateDiv, this.parentDiv, habitData);
        habit.showHabitDiv();
        this.habitList.push(habit);
    }

    getHabitClassById(id) {
        for (habit of this.habitList) {
            if (habit.habitData['id'] == id) {
                return habit
            }
        }
    }

    updateAllHabits() {for (habit of this.habitList) { habit.updateHabitData(); }}
    showAllHabits() {for (habit of this.habitList) { habit.showHabitDiv(); }}
    hideAllHabits() {for (habit of this.habitList) { habit.hideHabitDiv(); }}
}