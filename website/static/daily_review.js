export class DailyHabit {
    constructor(habitId) {
        this.habitId = habitId;

        this.markAsComplete = this.markAsComplete.bind(this);
    }

    displayHabit() {
        // Load habit name
        fetch(`/get_habit_by_id?habit_id=${this.habitId}`)
        .then(response =>{
            if (!response.ok) {throw new Error(`Error:${response.json().error} \n Status: ${response.status}`)}
            return response.json();})
        .then(data => {
            let habitName = data['name'];
            const pendingList = document.getElementById('pending-list');
            const newHabit = document.createElement('li');
            newHabit.innerHTML = `<label>
                                    <input type="checkbox" class="habit-checkbox">
                                    <span class="habit-name">${habitName}</span>
                                </label>`
            newHabit.querySelector(".habit-checkbox").addEventListener("change", this.markAsComplete)
            pendingList.appendChild(newHabit);
        })

    }

    displayCompletedHabit(habitName, note) {
        const completedList = document.getElementById('completed-list');
        const newHabit = document.createElement('li');
        newHabit.innerHTML = `<span class="habit-name">${habitName}</span><br><small>${note || ''}</small>`;
        completedList.appendChild(newHabit);
        if (completedList.children.length > 0) {
            document.getElementById('completed-habits').classList.remove('hidden');
            }
    };

    markAsComplete(event) {
        const checkBox = event.target;
        if (checkBox.checked) {
            // Load habit name
            fetch(`/get_habit_by_id?habit_id=${this.habitId}`)
            .then(response =>{
                // if (!response.ok) {throw new Error(`Error:${response.json().error} \n Status: ${response.status}`)}
                return response.json();
            })
            .then(data => {
                let habitName = data['name'];
                // Prompt note with sweetalert here
                const note = prompt(`Add a note for "${habitName}" (optional):`);
                
                // Post request to register completed habit
                fetch("/mark_habit_complete", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        'habit_id': this.habitId,
                        'date': new Date().toISOString(),
                        'completion_notes': note,
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log(`Completion registered successfully: ${this.habitId}-${habitName}`);
                })

                this.displayCompletedHabit(habitName, note);
                checkBox.closest('li').remove();

                
            });
        }
    }
}