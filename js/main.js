// main.js
import { UserManager } from "./user.js";
import { Item } from "./item.js";

class LostAndFoundSystem {
    constructor() {
        try { this.userManager = new UserManager(); } catch { this.userManager = new UserManager(); }
        try { this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null; } catch { this.currentUser = null; }
        try { this.lostItems = JSON.parse(localStorage.getItem('lostItems')) || []; } catch { this.lostItems = []; }
        try { this.foundItems = JSON.parse(localStorage.getItem('foundItems')) || []; } catch { this.foundItems = []; }

        this.idCounter = Math.max(
            ...[...this.lostItems, ...this.foundItems].map(i => parseInt(i.id.slice(1)) || 0),
            0
        );
    }

    saveState() {
        localStorage.setItem('users', JSON.stringify(this.userManager.users));
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('lostItems', JSON.stringify(this.lostItems));
        localStorage.setItem('foundItems', JSON.stringify(this.foundItems));
    }

    registerUser(name, email, password, confirmPassword, contact) {
        if (password !== confirmPassword) return false;
        const added = this.userManager.addUser(name, email, password, contact);
        if (!added) return false;
        this.saveState();
        return true;
    }

    login(email, password) {
        const user = this.userManager.login(email, password);
        if (!user) return false;
        this.currentUser = user;
        this.saveState();
        return true;
    }

    logout() {
        this.currentUser = null;
        this.saveState();
    }

    generateID() {
        this.idCounter++;
        return "I" + this.idCounter;
    }

    addLostItem(item) {
        item.id = this.generateID();
        item.isLost = true;
        item.notifications = [];
        this.lostItems.push(item);
        this.saveState();
    }

    addFoundItem(item) {
        item.id = this.generateID();
        item.isLost = false;
        item.notifications = [];
        this.foundItems.push(item);
        this.saveState();
    }

    // Match detection
    processMatches() {
        this.lostItems.forEach(lostItem => {
            this.foundItems.forEach(foundItem => {
                if (
                    lostItem.description.toLowerCase() === foundItem.description.toLowerCase() &&
                    lostItem.location.toLowerCase() === foundItem.location.toLowerCase()
                ) {
                    const msg = `Possible match for your lost item '${lostItem.description}'. Found Item ID: ${foundItem.id}.`;
                    if (!lostItem.notifications.includes(msg)) lostItem.notifications.push(msg);
                    // Track which found item matches this lost item
                    lostItem.matchedFoundId = foundItem.id;
                }
            });
        });
        this.saveState();
    }

    getNotifications() {
        if (!this.currentUser) return [];
        return this.lostItems
            .filter(item => item.ownerEmail === this.currentUser.email)
            .flatMap(item => item.notifications || []);
    }

    confirmReceivedItem(foundId) {
        // Remove found item
        this.foundItems = this.foundItems.filter(f => f.id !== foundId);

        // Remove corresponding lost item(s)
        this.lostItems = this.lostItems.filter(l => l.matchedFoundId !== foundId);

        // Clean notifications
        this.lostItems.forEach(l => {
            if (l.notifications) {
                l.notifications = l.notifications.filter(msg => !msg.includes(foundId));
            }
        });

        this.saveState();
    }
}

export const system = window.system || (window.system = new LostAndFoundSystem());
