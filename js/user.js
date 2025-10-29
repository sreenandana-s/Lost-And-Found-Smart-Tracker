export class UserManager {
    constructor() {
        try {
            this.users = JSON.parse(localStorage.getItem("users")) || [];
        } catch {
            this.users = [];
        }
    }

    save() {
        localStorage.setItem("users", JSON.stringify(this.users));
    }

    addUser(name, email, password, contact = "") {
        if (this.users.find(u => u.email === email)) return false;
        const newUser = { name, email, password, contact, notifications: [] };
        this.users.push(newUser);
        this.save();
        return true;
    }

    login(email, password) {
        return this.users.find(u => u.email === email && u.password === password) || null;
    }
}
