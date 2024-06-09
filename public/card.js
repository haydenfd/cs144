import { computeHexLuminance, 
  isValidRGBFormat, 
  rgbToHex } from "./utils.js";
import { saveGameState } from "./app.js";

let dragged = null;

const columns = document.querySelectorAll('.column');

columns.forEach(col => {
  col.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(col, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      if (col.querySelector('.card') !== null) {
        col.insertBefore(draggable, afterElement);
      } 
      else {
        col.appendChild(draggable);
      }
      // col.appendChild(draggable);
    } else {
      col.insertBefore(draggable, afterElement);
    }
  });

  col.addEventListener("dragenter", (e) => {
    e.preventDefault();
    col.classList.add("drop-zone");
  });

  col.addEventListener("dragleave", (e) => {
    e.preventDefault();
    col.classList.remove("drop-zone");
  });

  col.addEventListener("drop", (e) => {
    e.preventDefault();
    col.classList.remove("drop-zone");
    const afterElement = getDragAfterElement(col, e.clientY);
    if (afterElement == null) {
      col.appendChild(dragged);
    } else {
      col.insertBefore(dragged, afterElement);
    }
    dragged.classList.remove('dragging');
    saveGameState();
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
const NO_DESCRIPTION_TEXT = "(No description)";

export default class Card {
  constructor(title, color, description) {
    let templateCard = document.querySelector(".template");
    this.card = templateCard.cloneNode(true);
    this.card.querySelector(".title").textContent = title;
    const _color = isValidRGBFormat(color) ? rgbToHex(color) : color;
    this.card.style.backgroundColor = _color;
    this.card.classList.remove("template");

    this.card.setDescription = this.setDescription.bind(this);
    const desc = description.length > 0 ? description : NO_DESCRIPTION_TEXT;
    this.card.setDescription(desc);
    this.textArea = this.card.querySelector(".editDescription");

    this.luminance = computeHexLuminance(_color);

    this.editButton = this.card.querySelector(".edit");
    this.editCard = this.editCard.bind(this);
    this.editButton.addEventListener("click", this.editCard);

    this.moveButton = this.card.querySelector(".startMove");

    this.deleteButton = this.card.querySelector(".delete");
    this.deleteButton.addEventListener("click", () => {
      this.deleteCard();
    });

    if (this.luminance === "dark") {
      this.card.style.color = "white";

      const icons = this.card.querySelectorAll('img');

      icons.forEach(icon => {
        const name = icon.src.split('/').pop().split('.')[0];
        icon.src = `icons/${name}_light.svg`;
      });
    }
    this.card.addEventListener("dragstart", (event) => {
      dragged = event.target;
      dragged.classList.add('dragging');
      dragged.style.opacity = '0.5';
      // let state = JSON.parse(localStorage.getItem('gameState'));
      // if (state) {
      //   state.forEach(cardState => {
      //     if (cardState.title === title && rgbToHex(cardState.color) === _color) {
      //       parentId = cardState.columnId;
      //     }
      //   });
      // }
    });

    this.card.addEventListener("dragend", () => {
      dragged.classList.remove('dragging');
      this.card.style.opacity = '1';
      dragged.style.border = '2px solid black';
      dragged = null;
      saveGameState();
    });

 document.addEventListener("click", (event) => {
      if (event.target !== this.card) {
        this.card.style.border = 'none';
      }
    });    

    document.addEventListener("dragstart", (event) => {
      if (event.target !== this.card) {
        this.card.style.border = 'none';
      }
    });  
}


  editCard() {
    this.textArea.value = this.description;
    let description = this.card.querySelector(".description");
    description.classList.add("hidden");
    this.textArea.classList.remove("hidden");
    if (this.luminance === "dark") {
      this.textArea.style.color = "white";
    }
    this.textArea.select();
    this.textArea.focus();
    this.textArea.addEventListener("blur", () => {
      this.textArea.classList.add("hidden");
      this.setDescription(this.textArea.value);
      description.classList.remove("hidden");
    });
    
  }

  deleteCard() {
    this.card.remove();
    saveGameState();

  }

  addToCol(colElem, mover) {
    colElem.append(this.card);
    this.mover = mover;
    this.moveButton.addEventListener("click", () => {
      this.mover.startMoving(this.card);
    });
    saveGameState()
  }

  setDescription(text) {
    this.description = text;
    this.card.querySelector(".description").textContent = text;
    saveGameState();
  }
}
