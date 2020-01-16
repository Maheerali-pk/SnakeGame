const qs = str => document.querySelector(str);
const qsa = str => document.querySelectorAll(str);

HTMLElement.prototype.qs = function(str) {
   return this.querySelector(str);
};
HTMLElement.prototype.qsa = function(str) {
   return this.querySelectorAll(str);
};

//To create an element
const ce = ({ tag, style, children, ...rest }) => {
   const element = document.createElement(tag);
   if (rest) {
      for (let k in rest) {
         element[k] = rest[k];
      }
   }
   if (children) {
      for (let child of children) {
         element.appendChild(ce(child));
      }
   }
   return element;
};

HTMLElement.prototype.hide = function() {
   this.classList.add("hidden");
};
HTMLElement.prototype.show = function() {
   this.classList.remove("hidden");
};

function clone(object) {
   return JSON.parse(JSON.stringify(object));
}

const getRandomPoint = (minX, maxX, minY, maxY) => [
   getRandomVal(minX, maxX),
   getRandomVal(minY, maxY)
];

const getRandomVal = (min, max) =>
   Math.floor(Math.random() * (max - min)) + min;

Array.prototype.last = function() {
   this[this.length - 1];
};

Array.prototype.isEqualTo = function(arr) {
   return this.every((x, i) => x === arr[i]);
};
