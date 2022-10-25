// import axios from "axios";
const form = document.querySelector("form");
const button = document.querySelector(".add-book");
const tableBody = document.querySelector(".table-body");
const error = document.querySelector(".error");
const coinPriceEl = document.querySelector("#coin-price");
const coinButton = document.querySelector(".get-price");
const firstBookEl = document.querySelector("#first-book");

const addBook = function (title, author, pages) {
  pages = parseInt(pages);
  if (!pages || isNaN(pages)) {
    pages = 0;
    error.innerText = "Please put a number in the page field";
    return;
  }
  const book = {
    title: title,
    author: author,
    pages: pages,
  };

  return book;
};

const myBooks = [];

button.addEventListener("click", function (e) {
  e.preventDefault();

  const inputs = form.elements;
  console.log({ inputs });
  const titleValue = inputs["title"].value;
  const authorValue = inputs["author"].value;
  const pagesValue = inputs["pages"].value;

  console.log({ titleValue, authorValue, pagesValue });
  if (titleValue.length === 0 || authorValue.length === 0 || pagesValue.length === 0) {
    error.innerText = "Please fill all fields.";
    return;
  }

  // Create new book object
  const book = addBook(titleValue, authorValue, pagesValue);
  // add to 'myBooks' array
  myBooks.push(book);
  // Render to DOM
  addToTable();

  // Clear form
  clearForm();
});

const addToTable = function () {
  const tr = document.createElement("tr");
  // The first book a user adds, we need to add 5 additional pages,
  // so when it's sent for printing we can add advertisements or credit pages
  // all other books added after will not have these extra pages
  const firstBook = myBooks.length > 0 ? myBooks[0] : false;
  if (firstBook) {
    let firstBookAdminOnly = firstBook;
    // firstBookAdminOnly.pages = firstBookAdminOnly.pages + 5;
    firstBookAdminOnly.pages = parseInt(firstBookAdminOnly.pages);

    // Normally this would be sent via API to the backend, but for now we just display on the page
    // for this example.  In the situation where there was an API, sending multiple times (each time book is added) would not be an issue
    firstBookEl.innerHTML = firstBookAdminOnly.pages;
  }

  //of not in
  for (let { title, author, pages } of myBooks) {
    pages = parseInt(pages);
    const rowContents = `<td>${title}</td><td>${author}</td><td>${pages}</td>`;
    tr.innerHTML = rowContents;
    tableBody.append(tr);
  }
};

coinButton.addEventListener("click", async function (e) {
  await getCoinPrice();
});

const getCoinPrice = async function () {
  const price = await (await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")).json();
  console.log({ price });
  if (!price || (typeof price == "object" && Object.keys(price).length < 1)) {
    return (coinPriceEl.innerText = "Price Can't be retrieved at the moment. Try again later.");
  }
  const usd_amount = price?.bitcoin?.usd;
  if (!usd_amount) {
    return (coinPriceEl.innerText = "Price Can't be retrieved at the moment. Try again later.");
  }
  const currency_format = `$${usd_amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  coinPriceEl.innerHTML = currency_format;
};

const clearForm = function () {
  form.reset();
  error.innerText = "";
};
