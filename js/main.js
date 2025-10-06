const alphabetSection = document.getElementById("alphabetSection");
const inputSection = document.getElementById("inputSection");
const sideMenu = document.getElementById("sideMenu");
const result = document.getElementById("result");
const pValue = document.getElementById("pValue");
const qValue = document.getElementById("qValue");
const nValue = document.getElementById("nValue");
const phiValue = document.getElementById("phiValue");
const dValue = document.getElementById("dValue");
const eValue = document.getElementById("eValue");

const publicKey = document.getElementById("publicKey");
const privateKey = document.getElementById("privateKey");

const encryptInput = document.getElementById("encryptInput");
const encryptResult = document.getElementById("encryptResult");
const encryptButton = document.getElementById("encryptButton");
const encryptIteration = document.getElementById("encryptIteration");

const dencryptInput = document.getElementById("dencryptInput");
const dencryptResult = document.getElementById("dencryptResult");
const dencryptButton = document.getElementById("dencryptButton");
const dencryptIteration = document.getElementById("dencryptIteration");

let primeArray = [];
let gcdArray = [];

const rusAlpha =
  "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя ";

function loadLetter(container) {
  container.innerHTML = "";

  for (let i = 0; i < rusAlpha.length; i++) {
    const pair = document.createElement("div");
    pair.classList.add("pair");

    const letterPrime = document.createElement("div");
    letterPrime.classList.add("letter");
    letterPrime.innerHTML = rusAlpha[i];

    const letterResult = document.createElement("div");
    letterResult.classList.add("letter");
    letterResult.innerHTML = i + 1;

    pair.appendChild(letterPrime);
    pair.appendChild(letterResult);
    container.appendChild(pair);
  }
}

loadLetter(alphabetSection);

function updateActiveMenu() {
  const sections = document.querySelectorAll("h2");
  const links = sideMenu.querySelectorAll(".item-menu");

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top < window.innerHeight) {
      links.forEach((link) => link.classList.remove("active"));
      links[index].classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveMenu);

function isPrimeArray() {
  let result = [];
  for (let i = 0; i < 100; i++) {
    if (isPrime(i)) {
      result.push(i);
    }
  }
  return result;
}

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function isGcdArray(phi) {
  let result = [];

  for (let d = phi - 1; d > 1; d--) {
    if (gcd(d, phi) === 1) {
      result.push(d);
    }
  }
  return result;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function modInverse(d, phi) {
  if (gcd(d, phi) !== 1) {
    return null;
  }

  for (let e = 1; e < phi; e++) {
    if ((d * e) % phi === 1) {
      return e;
    }
  }
  return null;
}

function sumMod(section, a, x, n, char) {
  createCryptTable(section, ["k", `a<sub>k</sub>`, "i", "s", "p"], char);
  const tables = section.querySelectorAll("table");

  let p = 1;
  let i = x;

  let k = 0;

  while (i > 0) {
    const s = i % 2;

    if (s === 1) {
      p = (p * a) % n;
    }
    createHeaderCryptTable(tables[tables.length - 1], [k + 1, a, i, s, p]);
    a = (a * a) % n;
    i = Math.floor((i - s) / 2);
    k++;
  }

  return p;
}

function encryptOperation(str, e, n) {
  let result = [];
  for (const char of str) {
    const index = rusAlpha.indexOf(char);
    if (index !== -1) {
      result.push(sumMod(encryptIteration, index + 1, e, n, char));
    } else {
      result.push(char);
    }
  }
  return result;
}

function dencryptOperation(str, d, n) {
  let temp = [];
  for (const char of str) {
    if (!isNaN(parseInt(char))) {
      temp.push(sumMod(dencryptIteration, Number(char), d, n, char));
    } else {
      temp.push(char);
    }
  }

  let result = "";
  for (const i of temp) {
    if (typeof i === "number" && i > 0 && i <= rusAlpha.length) {
      result += rusAlpha[i - 1];
    } else {
      result += i;
    }
  }
  return result;
}

function createHeaderCryptTable(table, elements) {
  const tr = document.createElement("tr");
  elements.forEach((el) => {
    const td = document.createElement("td");
    td.innerHTML = el;
    tr.appendChild(td);
  });
  table.appendChild(tr);
}

function createCryptTable(section, elements, letter) {
  const table = document.createElement("table");
  const thLetter = document.createElement("th");
  thLetter.innerHTML = `${letter}`;
  thLetter.setAttribute("colspan", `${elements.length}`);
  const tr = document.createElement("tr");
  elements.forEach((el) => {
    const th = document.createElement("th");
    th.innerHTML = el;
    tr.appendChild(th);
  });
  table.appendChild(thLetter);
  table.appendChild(tr);
  section.appendChild(table);
}

primeArray = isPrimeArray();

primeArray.forEach((prime) => {
  const option = document.createElement("option");
  option.value = prime;
  option.textContent = prime;
  pValue.appendChild(option);
});

primeArray.forEach((prime) => {
  const option = document.createElement("option");
  option.value = prime;
  option.textContent = prime;
  qValue.appendChild(option);
});

pValue.value = primeArray[0];
qValue.value = primeArray[1];

function pEquelQ() {
  const step = inputSection.querySelectorAll(".step");
  const warning = step[0].querySelector(".warning");

  warning.textContent = "";

  if (pValue.value === qValue.value) {
    warning.textContent = "p и q не должны быть равны";
    return false;
  }

  return true;
}

function alphabetSize() {
  const step = inputSection.querySelectorAll(".step");
  const warning = step[1].querySelector(".warning");

  warning.textContent = "";

  if (nValue.value < rusAlpha.length) {
    warning.textContent = "n должно быть больше размера алфавита";
    return false;
  }

  return true;
}

function getValueN() {
  return pValue.value * qValue.value;
}

function getValuePhi() {
  return (pValue.value - 1) * (qValue.value - 1);
}

function getValueD() {
  dValue.innerHTML = "";
  gcdArray.forEach((element) => {
    const option = document.createElement("option");
    option.value = element;
    option.innerText = element;
    dValue.appendChild(option);
  });
}

function solveFirst() {
  if (!pEquelQ()) return;
  nValue.value = getValueN();
  phiValue.value = getValuePhi();
  if (!alphabetSize()) return;
  gcdArray = isGcdArray(phiValue.value);
  getValueD();

  solveSecond();
}

function solveSecond() {
  if (!pEquelQ()) return;

  eValue.value = modInverse(dValue.value, phiValue.value);
  publicKey.value = `{${eValue.value}; ${nValue.value}}`;
  privateKey.value = `{${dValue.value}; ${nValue.value}}`;
}

pValue.addEventListener("change", (e) => {
  solveFirst();
});

qValue.addEventListener("change", (e) => {
  solveFirst();
});

dValue.addEventListener("change", (e) => {
  solveSecond();
});

encryptButton.addEventListener("click", (e) => {
  if (!pEquelQ()) return;
  if (encryptInput.value.trim() === "") return;
  encryptIteration.innerHTML = "";
  encryptResult.value = encryptOperation(
    encryptInput.value.trim(),
    eValue.value,
    nValue.value
  );
});

dencryptButton.addEventListener("click", (e) => {
  if (!pEquelQ()) return;
  if (dencryptInput.value.trim() === "") return;
  dencryptIteration.innerHTML = "";
  dencryptResult.value = dencryptOperation(
    dencryptInput.value.trim().split(","),
    dValue.value,
    nValue.value
  );
});

solveFirst();
