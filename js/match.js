// match.js
import { UserManager } from "../user.js";
import { ItemList } from "../item.js";

class MatchManager {
  // Build prefix array for KMP
  static buildPrefix(p) {
    const n = p.length;
    const pi = Array(n).fill(0);
    for (let i = 1; i < n; i++) {
      let j = pi[i - 1];
      while (j > 0 && p[i] !== p[j]) j = pi[j - 1];
      if (p[i] === p[j]) j++;
      pi[i] = j;
    }
    return pi;
  }

  // KMP search
  static kmpSearch(t, p) {
    if (!p) return true;
    const pi = MatchManager.buildPrefix(p);
    let j = 0;
    for (let i = 0; i < t.length; i++) {
      while (j > 0 && t[i] !== p[j]) j = pi[j - 1];
      if (t[i] === p[j]) j++;
      if (j === p.length) return true;
    }
    return false;
  }

  // Common substring length (DP)
  static commonSubstringLength(a, b) {
    if (!a || !b) return 0;
    const n = a.length,
      m = b.length;
    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
    let best = 0;
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          if (dp[i][j] > best) best = dp[i][j];
        } else {
          dp[i][j] = 0;
        }
      }
    }
    return best;
  }

  static sendNotification(userManager, email, message) {
    const user = userManager.getUserByEmail(email);
    if (user) {
      user.notifications.push(message);
    }
  }

  // Find matches for lost items in found items
  findMatches(lostItems, foundItems, userManager) {
    let lostPtr = lostItems.getHead();
    while (lostPtr) {
      const pq = [];
      let foundPtr = foundItems.getHead();
      while (foundPtr) {
        const matched =
          MatchManager.kmpSearch(foundPtr.name, lostPtr.name) ||
          MatchManager.kmpSearch(lostPtr.name, foundPtr.name);
        if (matched) {
          let score = MatchManager.commonSubstringLength(
            lostPtr.name,
            foundPtr.name
          );
          if (lostPtr.location && lostPtr.location === foundPtr.location)
            score += 5;
          pq.push({ score, id: foundPtr.id });
        }
        foundPtr = foundPtr.next;
      }

      // Sort descending by score and send top 3 notifications
      pq.sort((a, b) => b.score - a.score);
      for (let i = 0; i < Math.min(3, pq.length); i++) {
        const message = `Possible match for your lost item '${lostPtr.name}'. Found Item ID: ${pq[i].id}. Check Browse Found Items for details.`;
        MatchManager.sendNotification(userManager, lostPtr.ownerEmail, message);
      }

      lostPtr = lostPtr.next;
    }
  }

  confirmReceivedItem(receiverEmail, itemID, lostItems, foundItems, userManager) {
    const lostItem = lostItems.findItemById(itemID);
    const foundItem = foundItems.findItemById(itemID);

    if (lostItem && foundItem) {
      lostItems.removeItemByID(itemID);
      foundItems.removeItemByID(itemID);
      MatchManager.sendNotification(
        userManager,
        receiverEmail,
        `Item with ID ${itemID} has been confirmed received.`
      );
      console.log("Item confirmed received and removed from lists.");
    } else {
      console.log("Item not found in lost or found lists.");
    }
  }
}

export { MatchManager };
