class Item {
  constructor() {
    this.id = "";
    this.name = "";
    this.description = "";
    this.location = "";
    this.dateFound = "";
    this.timeFound = "";
    this.picturePath = "";
    this.ownerName = "";
    this.ownerEmail = "";
    this.contact = "";
    this.isLost = true;
    this.notifications = []; // for match notifications
  }
}

export { Item };
