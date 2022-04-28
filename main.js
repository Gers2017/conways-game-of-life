// @ts-check

import "./style.css";

class Cell {
  isAlive = false;
  constructor(x, y, w, h) {
    this.rect = createRect(x, y, w, h);
    this.rect.addEventListener("click", (e) => {
      this.setAlive(!this.isAlive);
    });
    this.setAlive(false);
  }
  setAlive(isAlive) {
    this.isAlive = isAlive;
    if (isAlive) {
      this.setColor("lightgreen");
    } else {
      this.setColor("crimson");
    }
  }
  setColor(color) {
    this.rect.setAttributeNS(null, "fill", color);
  }
}

function createRect(x, y, w, h) {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttributeNS(null, "x", x);
  rect.setAttributeNS(null, "y", y);
  rect.setAttributeNS(null, "width", w);
  rect.setAttributeNS(null, "height", h);
  rect.setAttributeNS(null, "fill", "white");
  rect.setAttributeNS(null, "stroke", "black");
  rect.setAttributeNS(null, "stroke-width", "0.1px");
  return rect;
}
const canvas_width = 960;
const canvas_height = 640;

const cell_size = 8;
const rows_count = Math.floor(canvas_width / cell_size);
const cols_count = Math.floor(canvas_height / cell_size);
let cell_chance = 0.33;

const rules = {
  underpopulation: 2,
  overpopulation: 4,
  revives: 3,
};

const svg = document.querySelector("#mainsvg");
svg.setAttributeNS(null, "width", canvas_width.toString());
svg.setAttributeNS(null, "height", canvas_height.toString());

/** @type { Cell[][] } */
const cells = new Array(rows_count).fill(0);
for (let i = 0; i < cells.length; i++) {
  cells[i] = new Array(cols_count).fill(0);
}

function setup_cells() {
  for (let x = 0; x < rows_count; x++) {
    for (let y = 0; y < cols_count; y++) {
      const posx = cell_size * x;
      const posy = cell_size * y;
      const cell = new Cell(posx, posy, cell_size, cell_size);
      svg.appendChild(cell.rect);

      if (Math.random() <= cell_chance) {
        cell.setAlive(true);
      }

      cells[x][y] = cell;
    }
  }
}

function restart() {
  for (let x = 0; x < rows_count; x++) {
    for (let y = 0; y < cols_count; y++) {
      const cell = cells[x][y];

      cell.setAlive(false);

      if (Math.random() <= cell_chance) {
        cell.setAlive(true);
      }
    }
  }
}

const directions = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

function simulate() {
  for (let x = 0; x < rows_count; x++) {
    for (let y = 0; y < cols_count; y++) {
      let n = 0;

      directions.forEach(([dx, dy]) => {
        let nx = x + dx;
        let ny = y + dy;
        if (nx >= rows_count || nx < 0 || ny >= cols_count || ny < 0) return;

        if (cells[nx][ny].isAlive) {
          n += 1;
        }
      });

      const { underpopulation, overpopulation, revives } = rules;

      if (n < underpopulation || n > overpopulation) {
        // cell dies by underpopulation or cell dies by overpopulation
        cells[x][y].setAlive(false);
      }

      if (n == revives) {
        // Each cell with exactly three living neighbors comes to life
        cells[x][y].setAlive(true);
      }
    }
  }
}
/** @returns { HTMLInputElement } */
function CreateRange(selector, initialValue) {
  const r = document.querySelector(selector);
  r.value = initialValue.toString();
  return r;
}
/** @returns { HTMLLabelElement } */
function CreateLabel(selector) {
  return document.querySelector(selector);
}

const changec_label = CreateLabel("#chance_label");
function setChanceLabel(value) {
  changec_label.textContent = `Cell Chance: ${value}`;
}

setChanceLabel(cell_chance);

const changec_input = CreateRange("#cell_chance", cell_chance);
changec_input.oninput = (e) => {
  const value = Number(e.target.value);
  cell_chance = value;
  setChanceLabel(value);
};

let is_active = false;

function play(t) {
  simulate();
  if (is_active) {
    window.requestAnimationFrame(play);
  }
}

setup_cells();

/** @type { HTMLButtonElement } */
const start_btn = document.querySelector("#start");
start_btn.onclick = () => {
  is_active = true;
  window.requestAnimationFrame(play);
};

/** @type { HTMLButtonElement } */
const restart_btn = document.querySelector("#restart");
restart_btn.onclick = () => {
  is_active = false;
  restart();
  is_active = true;
  window.requestAnimationFrame(play);
};

/** @type { HTMLButtonElement } */
const stop_btn = document.querySelector("#stop");
stop_btn.onclick = () => {
  is_active = false;
};
