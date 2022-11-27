const button = document.querySelector(".burger-button");
const navULs = document.querySelectorAll("nav ul");

button.addEventListener("click", () => {
  const currentState = button.getAttribute("data-state");

  if (!currentState || currentState === "closed") {
    button.setAttribute("data-state", "opened");
    button.setAttribute("aria-expanded", "true");

    navULs.forEach((navUL) => {
      navUL.classList.remove("hide");
    });
  } else {
    button.setAttribute("data-state", "closed");
    button.setAttribute("aria-expanded", "false");

    navULs.forEach((navUL) => {
      navUL.classList.add("hide");
    });
  }
});

const urlShortener = document.querySelector(".url-shortener");
const urlShortenerInput = document.querySelector("#url-input");
const urlShortenerButton = document.querySelector("#url-button");
const urlShortenerInfo = document.querySelector("#url-info");
const urlShortenerInfoButton = document.querySelector("#url-info-button");

urlShortenerInfo.innerText =
  "Enter a link you would like to shorten above. Its just that easy!";

urlShortenerInfoButton.addEventListener("click", () => {
  urlShortenerInput.focus();
});

const shortenURL = async () => {
  if (!urlShortenerInput.value) {
    urlShortenerInfo.innerText = "Please enter a link above!";
  } else {
    const shortenURLquery =
      "https://api.shrtco.de/v2/shorten?url=" + urlShortenerInput.value;
    await fetch(shortenURLquery, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(data.result.short_link);

        //create new short URL container
        const newshortURL = document.createElement("div");
        newshortURL.classList.add("short-url");

        //create new todo span
        const newLongLinkSpan = document.createElement("span");
        newLongLinkSpan.innerText = data.result.original_link;
        newLongLinkSpan.classList.add("long-link");

        //create new todo span
        const newShortLinkSpan = document.createElement("span");
        newShortLinkSpan.innerHTML = `<a target="_blank" rel="noopener noreferrer" href="${data.result.full_short_link}">${data.result.short_link}</a>`;
        newShortLinkSpan.classList.add("short-link");

        //create new cross img
        const newCopyButton = document.createElement("button");
        newCopyButton.innerText = "Copy";
        newCopyButton.setAttribute("type", "button");
        newCopyButton.setAttribute("name", "button");

        //append checkmark, span and cross to todo container
        newshortURL.append(newLongLinkSpan);
        newshortURL.append(newShortLinkSpan);
        newshortURL.append(newCopyButton);

        //append todo container to todosList
        urlShortener.append(newshortURL);
      });

    // urlShortenerInfo.innerText = res.result.short_link;

    //https://api.shrtco.de/v2/shorten?url=example.org/very/long/link.html
  }
};

urlShortenerButton.addEventListener("click", shortenURL);
