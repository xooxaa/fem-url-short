const button = document.querySelector(".burger-button");
const navULs = document.querySelectorAll("nav ul");
const urlShortener = document.querySelector(".url-shortener");
const urlShortenerInput = document.querySelector("#url-input");
const urlShortenerButton = document.querySelector("#url-button");
const urlShortenerInfo = document.querySelector("#url-info");

//***********************************************************************************************
//*************************************************************************** Burger Menu Toggle
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

//***********************************************************************************************
//******************************************************************************** Local Storage
function updateLocalStorage() {
  let links = [];

  for (let link of urlShortener.children) {
    console.log(link.children[0].classList[0]);
    if (link.children[0].classList[0] === "long-link") {
      links.push({
        long_link: link.children[0].innerText,
        full_short_link: link.children[1].href,
        short_link: link.children[1].innerText,
      });
    }
  }
  localStorage.setItem("links", JSON.stringify(links));
}

function readFromLocalStorage() {
  let links = [];

  links = JSON.parse(localStorage.getItem("links"));
  if (links) {
    for (let link of links) {
      const newshortURL = document.createElement("div");
      newshortURL.classList.add("short-url");

      const newLongLinkSpan = document.createElement("span");
      newLongLinkSpan.innerText = link.long_link;
      newLongLinkSpan.classList.add("long-link");

      const newShortLinkSpan = document.createElement("span");
      newShortLinkSpan.innerHTML = `<a target="_blank" rel="noopener noreferrer" href="${link.full_short_link}">${link.short_link}</a>`;
      newShortLinkSpan.classList.add("short-link");

      const newCopyButton = document.createElement("button");
      newCopyButton.innerText = "Copy";
      newCopyButton.setAttribute("type", "button");

      const newRemoveButton = document.createElement("button");
      newRemoveButton.innerText = "Remove";
      newRemoveButton.setAttribute("type", "button");
      newRemoveButton.classList.add("remove");

      newshortURL.append(newLongLinkSpan);
      newshortURL.append(newShortLinkSpan);
      newshortURL.append(newCopyButton);
      newshortURL.append(newRemoveButton);

      urlShortener.append(newshortURL);
    }
  }
}

readFromLocalStorage();

//***********************************************************************************************
//******************************************************************************* URL Shortening

urlShortenerInfo.innerText = "";

const shortenURL = async () => {
  urlShortenerInfo.innerText = "";
  if (!urlShortenerInput.value) {
    urlShortenerInfo.innerText = "Please add a link!";
    urlShortenerInput.style.outline = "2px solid hsl(0, 87%, 67%)";
  } else {
    const shortenURLquery =
      "https://api.shrtco.de/v2/shorten?url=" + urlShortenerInput.value;
    urlShortenerInput.value = "";

    await fetch(shortenURLquery, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          console.log(data.result.short_link);

          const newshortURL = document.createElement("div");
          newshortURL.classList.add("short-url");

          const newLongLinkSpan = document.createElement("span");
          newLongLinkSpan.innerText = data.result.original_link;
          newLongLinkSpan.classList.add("long-link");

          const newShortLinkSpan = document.createElement("span");
          newShortLinkSpan.innerHTML = `<a target="_blank" rel="noopener noreferrer" href="${data.result.full_short_link}">${data.result.short_link}</a>`;
          newShortLinkSpan.classList.add("short-link");

          const newCopyButton = document.createElement("button");
          newCopyButton.innerText = "Copy";
          newCopyButton.setAttribute("type", "button");

          const newRemoveButton = document.createElement("button");
          newRemoveButton.innerText = "Remove";
          newRemoveButton.setAttribute("type", "button");
          newRemoveButton.classList.add("remove");

          newshortURL.append(newLongLinkSpan);
          newshortURL.append(newShortLinkSpan);
          newshortURL.append(newCopyButton);
          newshortURL.append(newRemoveButton);

          urlShortener.append(newshortURL);

          updateLocalStorage();
        } else {
          urlShortenerInput.style.outline = "2px solid hsl(0, 87%, 67%)";
          if (data.error_code === 2) {
            urlShortenerInfo.innerText =
              "Invalid URL submitted: Pleas check your input.";
          }
          if (data.error_code === 10) {
            urlShortenerInfo.innerText =
              "The url you entered is not allowed: Please enter a different URL";
          }
        }
      });
  }
};

urlShortenerButton.addEventListener("click", shortenURL);

urlShortenerInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    shortenURL();
  }
});

urlShortenerInput.addEventListener("input", () => {
  urlShortenerInfo.innerText = "";
  urlShortenerInput.style.outline = "none";
});

urlShortener.addEventListener("click", (e) => {
  console.log(e.target.innerText);
  if (e.target.innerText == "Copy") {
    for (let child of urlShortener.children) {
      if (child.children[2].innerText == "Copied!") {
        child.children[2].classList.remove("copied");
        child.children[2].innerText = "Copy";
      }
    }

    navigator.clipboard.writeText(e.target.previousSibling.innerText);
    e.target.classList.add("copied");
    e.target.innerText = "Copied!";
    setTimeout(function () {
      e.target.classList.remove("copied");
      e.target.innerText = "Copy";
    }, 2000);
  }
  if (e.target.innerText == "Remove") {
    e.target.parentElement.remove();
    updateLocalStorage();
  }
});
