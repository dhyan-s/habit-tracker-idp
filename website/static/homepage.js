function toggleHabitDetails() {
    var detailsDiv = document.getElementsByClassName("habit-details")[0];
    if (detailsDiv.classList.contains("hidden")) {
        detailsDiv.classList.remove("hidden");
        detailsDiv.classList.add("open");
    } else {
        detailsDiv.classList.add("hidden");
        detailsDiv.classList.remove("open");
    }
}

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

function openHabitInfo(event) {
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

export function displayHabit(habitData) {
    const originalDiv = document.getElementsByClassName("card")[0];
    const clonedDiv = originalDiv.cloneNode(true);
    const contentDiv = document.getElementById("content");
    clonedDiv.onclick = openHabitInfo
    clonedDiv.style.display = "block";

    clonedDiv.querySelector(".habit-title").textContent = habitData.name;
    clonedDiv.querySelector(".habit-notes").textContent = habitData.notes;

    contentDiv.appendChild(clonedDiv);
}