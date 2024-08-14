import {weekdayStrFromNo, pythonToJSDay, JSToPythonDay} from "./utils.js";

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
                    dayNo = parseInt(dayNo);
                    let dayDiv = weekDiv.querySelector(`.${weekdayStrFromNo(dayNo)}`);
                    console.log(dayDiv)
                    dayDiv.style.display = "flex";
                    if (data[dayNo] == true) {
                        dayDiv.classList.add("completed");
                    }
                    else if (data[dayNo] == false) {
                        dayDiv.classList.add("missed");
                    }
                    else if (dayNo == JSToPythonDay(new Date().getDay())) {
                        // console.log(data['habit_name'], dayNo, new Date().getDay());
                        dayDiv.classList.add("today");
                    }
                    else {
                        dayDiv.classList.remove("completed", "missed", "today");
                    }
                }
            )
        })

        // Update last completed
        // const lastCompletedSpan = this.habitDiv.querySelector(".last-completed");
        // fetch(`/get_last_completed?habit_id=${this.habit_id}`)
        // .then(response => response.json())
        // .then(data => {
        //     if (data == null) {
        //         lastCompletedSpan.textContent = "N.A";
        //     }
        //     else {
        //         let lastCompletedDate = new Date(data);
        //         const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        //         const dayOfWeek = daysOfWeek[lastCompletedDate.getDay()];
        //         let formattedDate = `${lastCompletedDate.getDate()}-${lastCompletedDate.getMonth() + 1}-${lastCompletedDate.getFullYear()} (${dayOfWeek})`;
        //         lastCompletedSpan.textContent = formattedDate;
        //     }
        // })
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