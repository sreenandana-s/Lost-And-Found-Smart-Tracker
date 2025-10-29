// location.js

class LocationGraph {
  constructor() {
    this.adj = new Map(); // adjacency list
  }

  addEdge(a, b) {
    if (!this.adj.has(a)) this.adj.set(a, []);
    if (!this.adj.has(b)) this.adj.set(b, []);
    this.adj.get(a).push(b);
    this.adj.get(b).push(a);
  }

  displayGraph() {
    for (let [key, neighbors] of this.adj.entries()) {
      console.log(`${key}: ${neighbors.join(" ")}`);
    }
  }

  areNearby(src, dest) {
    if (!this.adj.has(src) || !this.adj.has(dest)) return false;

    const visited = new Set();
    const queue = [];
    queue.push(src);
    visited.add(src);

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === dest) return true;

      for (let neighbor of this.adj.get(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return false;
  }
}

export { LocationGraph };
