// @ts-check

import './style.css'

class Cell {
  constructor(x, y, w, h) {
    this.rect = createRect(x, y, w, h);
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

const screen_size = 800;
const cells_count = 80;
const cell_size = Math.round(screen_size / cells_count);
const interval_ms = 200;
let cell_chance = 0.5;

const svg = document.querySelector('#mainsvg');
svg.setAttributeNS(null, "width", screen_size.toString());
svg.setAttributeNS(null, "height", screen_size.toString());

/** @type { Cell[][] } */
const cells = new Array(cells_count).fill(0);
for (let i = 0; i < cells.length; i++) {
  cells[i] = new Array(cells_count).fill(0);
}

function setup_cells() {
  svg.childNodes.forEach( node => {
    svg.removeChild(node);
  })
  for (let x = 0; x < cells_count; x++) {
    for (let y = 0; y < cells_count; y++) {
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

const directions = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

function simulate() {
  for (let x = 0; x < cells_count; x++) {
    for (let y = 0; y < cells_count; y++) {
      let n = 0;
  
      directions.forEach(([dx, dy])=> {
        let nx = x + dx;
        let ny = y + dy;
        if (nx >= cells_count || nx < 0
          || ny >= cells_count || ny < 0) return;
  
        if (cells[nx][ny].isAlive) {
          n += 1
        }
      })
  
      if (n <= 1 || n >= 4) { // cell dies by solitude or cell dies by overpopulation
        cells[x][y].setAlive(false);
      }
  
      if (n == 3) { // Each cell with three neighbors becomes populated
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
changec_input.onchange = (e)=> {
  const value = Number(e.target.value);
  cell_chance = value;
  setChanceLabel(value);
}

function createInterval() {
  return setInterval(()=>{
    simulate();
  }, interval_ms);
}

setup_cells();
/** @type { NodeJS.Timer } */
let interval = createInterval();

/** @type { HTMLButtonElement } */
const start_btn = document.querySelector("#start");
start_btn.onclick = ()=> {
  setup_cells();
  interval = createInterval();
}

/** @type { HTMLButtonElement } */
const reset_btn = document.querySelector("#reset");
reset_btn.onclick = ()=> {
  clearInterval(interval);
  setup_cells();
  interval = createInterval();
}

/** @type { HTMLButtonElement } */
const stop_btn = document.querySelector("#stop");
stop_btn.onclick = () => {
  clearInterval(interval);
};
