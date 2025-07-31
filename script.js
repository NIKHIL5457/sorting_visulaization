let array = [];
let arraySize = 20;
const delay = 300;

function generateArray() {
  const barCountInput = document.getElementById("barCount").value;
  arraySize = barCountInput ? parseInt(barCountInput) : 20;

  array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 10);
  drawArray();
  clearSteps();
}

function resetVisualizer() {
  array = [];
  document.getElementById("array").innerHTML = "";
  document.getElementById("steps").innerHTML = "";
  document.getElementById("searchValue").value = "";
  document.getElementById("barCount").value = "";
}

function drawArray(highlightedIndices = [], sortedIndices = []) {
  const arrayContainer = document.getElementById("array");
  arrayContainer.innerHTML = "";

  array.forEach((value, i) => {
    const barWrapper = document.createElement("div");
    barWrapper.classList.add("bar-wrapper");

    const label = document.createElement("div");
    label.classList.add("bar-label");
    label.textContent = value;

    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 2}px`;

    if (highlightedIndices.includes(i)) bar.classList.add("highlight");
    if (sortedIndices.includes(i)) bar.classList.add("sorted");

    barWrapper.appendChild(label);
    barWrapper.appendChild(bar);
    arrayContainer.appendChild(barWrapper);
  });
}

function logStep(message) {
  const steps = document.getElementById("steps");
  const li = document.createElement("li");
  li.textContent = message;
  steps.appendChild(li);
}

function clearSteps() {
  document.getElementById("steps").innerHTML = "";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSort() {
  clearSteps();
  const algo = document.getElementById("sortAlgo").value;
  switch (algo) {
    case "bubble": await bubbleSort(); break;
    case "selection": await selectionSort(); break;
    case "insertion": await insertionSort(); break;
    case "merge": await mergeSort(0, array.length - 1); break;
    case "quick": await quickSort(0, array.length - 1); break;
  }
  drawArray([], Array.from({ length: array.length }, (_, i) => i));
  logStep("✅ Sorting Completed");
}

// All sorting and searching functions below (unchanged)

async function bubbleSort() {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      drawArray([j, j + 1]);
      await sleep(delay);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        logStep(`Swapped ${array[j + 1]} and ${array[j]}`);
        drawArray([j, j + 1]);
        await sleep(delay);
      }
    }
  }
}

async function selectionSort() {
  for (let i = 0; i < array.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      drawArray([minIdx, j]);
      await sleep(delay);
      if (array[j] < array[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      logStep(`Swapped ${array[minIdx]} and ${array[i]}`);
      drawArray([i, minIdx]);
      await sleep(delay);
    }
  }
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      drawArray([j, j + 1]);
      array[j + 1] = array[j];
      logStep(`Moved ${array[j]} to position ${j + 1}`);
      j--;
      await sleep(delay);
    }
    array[j + 1] = key;
    logStep(`Inserted ${key} at position ${j + 1}`);
    drawArray([j + 1]);
    await sleep(delay);
  }
}

async function mergeSort(left, right) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSort(left, mid);
  await mergeSort(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  let leftArr = array.slice(left, mid + 1);
  let rightArr = array.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    drawArray([k]);
    await sleep(delay);
    if (leftArr[i] <= rightArr[j]) {
      array[k] = leftArr[i];
      logStep(`Placed ${leftArr[i]} at index ${k}`);
      i++;
    } else {
      array[k] = rightArr[j];
      logStep(`Placed ${rightArr[j]} at index ${k}`);
      j++;
    }
    k++;
  }

  while (i < leftArr.length) {
    array[k] = leftArr[i];
    logStep(`Placed ${leftArr[i]} at index ${k}`);
    i++; k++;
    drawArray([k]);
    await sleep(delay);
  }

  while (j < rightArr.length) {
    array[k] = rightArr[j];
    logStep(`Placed ${rightArr[j]} at index ${k}`);
    j++; k++;
    drawArray([k]);
    await sleep(delay);
  }
}

async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  logStep(`Pivot = ${pivot}`);
  let i = low - 1;

  for (let j = low; j < high; j++) {
    drawArray([j, high]);
    await sleep(delay);
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      logStep(`Swapped ${array[j]} and ${array[i]}`);
      drawArray([i, j]);
      await sleep(delay);
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  logStep(`Moved pivot ${pivot} to position ${i + 1}`);
  drawArray([i + 1]);
  await sleep(delay);
  return i + 1;
}

async function binarySearch() {
  clearSteps();
  const target = parseInt(document.getElementById("searchValue").value);
  if (isNaN(target)) return alert("Enter a number to search");

  array.sort((a, b) => a - b);
  logStep("🛠️ Array auto-sorted for Binary Search");
  drawArray();

  let left = 0, right = array.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    drawArray([mid]);
    await sleep(delay);
    logStep(`Checked middle ${array[mid]}`);

    if (array[mid] === target) {
      logStep(` Found ${target} at index ${mid}`);
      drawArray([mid]);
      return;
    } else if (array[mid] < target) {
      logStep(`${target} > ${array[mid]} → move right`);
      left = mid + 1;
    } else {
      logStep(`${target} < ${array[mid]} → move left`);
      right = mid - 1;
    }
  }

  logStep(` ${target} not found`);
}

async function linearSearch() {
  clearSteps();
  const target = parseInt(document.getElementById("searchValue").value);
  if (isNaN(target)) {
    alert("Please enter a number to search.");
    return;
  }

  for (let i = 0; i < array.length; i++) {
    drawArray([i]);
    logStep(`Checked ${array[i]}`);
    await sleep(delay);

    if (array[i] === target) {
      logStep(` Found ${target} at index ${i}`);
      drawArray([i]);
      return;
    }
  }

  logStep(` ${target} not found`);
}
