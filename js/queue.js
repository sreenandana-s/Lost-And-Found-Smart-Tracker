// queue.js

class NotificationNode {
  constructor(msg) {
    this.msg = msg;
    this.next = null;
  }
}

class NotificationQueue {
  constructor() {
    this.front = null;
    this.rear = null;
    this.sz = 0;
  }

  push(msg) {
    const node = new NotificationNode(msg);
    if (!this.rear) {
      this.front = this.rear = node;
    } else {
      this.rear.next = node;
      this.rear = node;
    }
    this.sz++;
  }

  pop() {
    if (!this.front) return "";
    const out = this.front.msg;
    this.front = this.front.next;
    if (!this.front) this.rear = null;
    this.sz--;
    return out;
  }

  frontMsg() {
    return this.front ? this.front.msg : "";
  }

  display() {
    while (!this.isEmpty()) {
      console.log("- " + this.pop());
    }
  }

  isEmpty() {
    return this.sz === 0;
  }

  size() {
    return this.sz;
  }
}

export { NotificationNode, NotificationQueue };
