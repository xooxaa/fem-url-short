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
