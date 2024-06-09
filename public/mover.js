import { saveGameState } from "./app.js";
const MOVE_HERE_TEXT = "— Move here —";

export default class Mover {
  constructor() {
    self.isActiveCard = false;
  }

  startMoving(card) {
    this.stopMoving();
    const moveCardEvent = (event) => {
      const targetElement = event.target.previousSibling;
      card.classList.remove("moving");
      targetElement.insertAdjacentElement("afterend", card);
      this.stopMoving();
      saveGameState();
    };

    if (self.isActiveCard) {
      return;
    }
    card.classList.add("moving");
    const templateCards = document.querySelectorAll(".columnTitle:not(.template), .card:not(.template)");
    for (const card of templateCards) {
      const newButton = document.createElement("button");
      newButton.innerText = MOVE_HERE_TEXT;
      newButton.classList.add("moveHere");
      newButton.addEventListener("click", moveCardEvent);
      card.insertAdjacentElement("afterend", newButton);
    }
    self.isActiveCard = true;
  }

  stopMoving() {
    const activeCards = document.querySelectorAll(".moving");
    for (const activeCard of activeCards) {
      activeCard.classList.remove("moving");
    }    
    const potentialMoves = document.querySelectorAll(".moveHere");
    for (const potentialMove of potentialMoves) {
      potentialMove.remove();
    }
    self.isActiveCard = false;
  }
}
