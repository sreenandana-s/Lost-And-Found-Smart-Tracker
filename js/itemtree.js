// itemtree.js
import { Item } from "../item.js";

class ItemTreeNode {
  constructor(item) {
    this.data = item;
    this.left = null;
    this.right = null;
  }
}

class ItemTree {
  constructor() {
    this.root = null;
  }

  insertRec(node, item) {
    if (!node) return new ItemTreeNode(item);

    if (item.name < node.data.name) {
      node.left = this.insertRec(node.left, item);
    } else {
      node.right = this.insertRec(node.right, item);
    }
    return node;
  }

  insert(item) {
    this.root = this.insertRec(this.root, item);
  }

  searchRec(node, name) {
    if (!node) return null;
    if (node.data.name === name) return node;

    if (name < node.data.name) {
      return this.searchRec(node.left, name);
    } else {
      return this.searchRec(node.right, name);
    }
  }

  searchByName(name) {
    return this.searchRec(this.root, name);
  }

  inorderRec(node) {
    if (!node) return;
    this.inorderRec(node.left);
    console.log(
      `[${node.data.id}] ${node.data.isLost ? "Lost" : "Found"} : ${
        node.data.name
      } | Loc: ${node.data.location} | Contact: ${
        node.data.contact
      } | Date: ${node.data.dateFound} ${node.data.timeFound}`
    );
    this.inorderRec(node.right);
  }

  inorderDisplay() {
    if (!this.root) {
      console.log("No items in tree.");
      return;
    }
    this.inorderRec(this.root);
  }

  freeRec(node) {
    if (!node) return;
    this.freeRec(node.left);
    this.freeRec(node.right);
    // In JS, garbage collection handles deletion automatically
  }

  clear() {
    this.freeRec(this.root);
    this.root = null;
  }
}

export { ItemTree, ItemTreeNode };
