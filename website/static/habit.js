import {weekdayStrFromNo, pythonToJSDay, JSToPythonDay} from "./utils.js";

export class Habit {
    #templateDiv;

    constructor(templateDiv, parentDiv, habitData) {
        this.#templateDiv = templateDiv;
        this.habitData = habitData;
        this.parentDiv = parentDiv;
        this.openHabitInfoPopup = this.openHabitInfoPopup.bind(this);
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

    openHabitInfoPopup(event){
        event.stopPropagation();
        Swal.fire({
            title: `<strong class="my-sweetalert-title">${this.habitData.name}</strong>`,
            icon: "info",
            html:
            `<div class="expanded-habits-popup">
                <p><b>Notes:</b><span> ${this.habitData.notes}</span></p>
                <p><b>Forever:</b><span> ${this.habitData.forever ? 'Yes' : 'No'}</span></p>
                <p><b>Start Date:</b><span class="started-on"> ${new Date(this.habitData.start_date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</span></p>
                <p><b>End Date:</b><span class="ended-on"> ${this.habitData.end_date ? new Date(this.habitData.end_date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N.A'}</span></p>
                <p><b>Days:</b><span class="days"> ${this.habitData.days}</span></p>
                <p><b>Reminder:</b><span class="reminder"> ${this.habitData.reminder ? 'Yes' : 'No'}</span></p>
            </div>`,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: `
                Keep It Up!
            `,
            confirmButtonAriaLabel: "Thumbs up, Keep It Up!",
            cancelButtonText: `
                 Edit Habit!
            `,
            cancelButtonAriaLabel: "Edit Habit (Beta)",
            customClass: {
                confirmButton: 'my-sweetalert-confirm-button ',
                cancelButton: 'my-sweetalert-cancel-button'
            }
        });
        console.log(this.habitData);

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
    }

    createHabitDiv() {
        this.habitDiv = this.#templateDiv.cloneNode(true);
        this.habitDiv.onclick = this.openHabitInfo

        this.habitDiv.querySelector(".expand-icon").onclick = this.openHabitInfoPopup;

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