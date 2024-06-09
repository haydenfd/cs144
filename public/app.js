import Card from "./card.js";
import Mover from "./mover.js";

export function saveGameState() {
  const columns = document.querySelectorAll('.column');
  const boardState = []

  columns.forEach(column => {
    const columnId = column.id;
    const cards = column.querySelectorAll('.card:not(.template)');
    cards.forEach(card => {
      boardState.push({
        'title': card.querySelector('.title').textContent,
        'description': card.querySelector('.description').textContent,
        'color': card.style.backgroundColor,
        'columnId': columnId,
    })
    })
  })

  localStorage.setItem('gameState', JSON.stringify(boardState));
}

export default class App {
  constructor() {
    this.mover = new Mover();
    this.form = document.querySelector("#addCard");
    this.loadGameState = this.loadGameState.bind(this);
    document.addEventListener('DOMContentLoaded', this.loadGameState);
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      let title = this.form.querySelector("#cardTitle").value;
      let color = this.form.querySelector("#cardColor").value;
      this.addCard("todo", title, color, true);
      this.form.reset();
    });

    document.addEventListener('DOMContentLoaded', () => {
      const themeToggleBtn = document.getElementById('themeToggle');
      const themeIcon = document.getElementById('themeIcon');
  
      const lightModeIcon = 'icons/light_mode.svg';
      const darkModeIcon = 'icons/dark_mode.svg';
  
      const setTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeIcon.src = lightModeIcon;
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.src = darkModeIcon;
        }
      };
  
      const currentTheme = localStorage.getItem('theme');
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
 
      if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme)) {
          setTheme(true);
      } else {
          setTheme(false);
      }
  
      themeToggleBtn.addEventListener('click', () => {
          const isDark = document.body.classList.toggle('dark-mode');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
          // console.log(`Changed mode to ${isDark ? 'dark' : 'light'}`)
          themeIcon.src = isDark ? lightModeIcon : darkModeIcon;
      });


    });


  }

  loadGameState() {
    let state = JSON.parse(localStorage.getItem('gameState'));
    if (state) {
        state.forEach(cardState => {
            this.addCard(cardState.columnId, cardState.title, cardState.color, cardState.description);
        });
    }
}

  addCard(col, title, color, description) {
    this.mover.stopMoving();
    const newCard = new Card(title, color, description);
    // console.log(`Added a new card`);
    newCard.addToCol(document.querySelector(`#${col}`), this.mover);
    return newCard;
  }

}
