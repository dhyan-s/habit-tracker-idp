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



// Daily Check-in functionality
document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            const habitName = this.nextElementSibling.textContent;
            const note = prompt(`Add a note for "${habitName}" (optional):`);
            const completedList = document.getElementById('completed-list');
            const newHabit = document.createElement('li');
            newHabit.innerHTML = `<span class="habit-name">${habitName}</span><br><small>${note ? note : ''}</small>`;
            completedList.appendChild(newHabit);

            this.closest('li').remove();

            if (completedList.children.length > 0) {
                document.getElementById('completed-habits').classList.remove('hidden');
            }
        }
    });
});
