import { system } from "./main.js";

if (!system.currentUser) {
    alert("Please login first!");
    window.location.href = "login.html";
}

// Welcome message
document.getElementById('welcome-msg').innerText = `Welcome, ${system.currentUser.name}!`;

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    system.logout();
    alert("Logged out successfully!");
    window.location.href = "login.html";
});

// Show Notifications
document.getElementById('notif-btn').addEventListener('click', () => {
    const notes = system.getNotifications();
    if (notes.length === 0) alert("No notifications.");
    else alert(notes.join("\n"));
});

// Find Matches
document.getElementById('match-btn').addEventListener('click', () => {
    let matchesFound = false;

    system.lostItems.forEach(lostItem => {
        if (!lostItem.notifications) lostItem.notifications = [];
        system.foundItems.forEach(foundItem => {
            if (
                lostItem.description.toLowerCase() === foundItem.description.toLowerCase() &&
                lostItem.location.toLowerCase() === foundItem.location.toLowerCase()
            ) {
                const msg = `Possible match for your lost item '${lostItem.description}'. Found Item ID: ${foundItem.id}.`;
                if (!lostItem.notifications.includes(msg)) {
                    lostItem.notifications.push(msg);
                    matchesFound = true;
                }
            }
        });
    });

    system.saveState();
    if (matchesFound) alert("Matches found and notifications sent!");
    else alert("No matches found.");
});

// Confirm Received Item
document.getElementById('confirm-btn').addEventListener('click', () => {
    const itemId = prompt("Enter Item ID to confirm received:");
    if (!itemId) return;
    const lostIndex = system.lostItems.findIndex(i => i.id === itemId);
    const foundIndex = system.foundItems.findIndex(i => i.id === itemId);

    if (lostIndex === -1 && foundIndex === -1) {
        alert("Item ID not found!");
        return;
    }

    system.lostItems = system.lostItems.filter(i => i.id !== itemId);
    system.foundItems = system.foundItems.filter(i => i.id !== itemId);
    system.saveState();
    alert("Item confirmed received and removed from lists.");
});
