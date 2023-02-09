"use strict";

function createDialogs(selector) {
  if (!selector) {
    return console.error("Missing selector argument");
  }

  const buttonTemplate = document.createElement("button");
  buttonTemplate.classList.add("lightbox-button");
  buttonTemplate.setAttribute("aria-haspopup", "dialog");

  const dialogTemplate = document.createElement("dialog");
  dialogTemplate.classList.add("lightbox");
  dialogTemplate.innerHTML = `
    <form method="dialog">
      <button type="submit">
      <span aria-hidden>×</span>
      <span class="sr-only">Close dialog</span>
      </button>
      <span aria-hidden></span>
    </form>
  `;
  
  function createDialog(img) {
    const button = buttonTemplate.cloneNode();
    const dialog = dialogTemplate.cloneNode(true);
    const form = dialog.querySelector("form");
    const span = dialog.querySelector("form > span");
    
    span.textContent = img.getAttribute("alt");
    img.before(button);
    button.append(img);
    button.after(dialog);
    
    img.style.viewTransitionName = 'image';
    
    const moveImage = () => {
      if (!dialog.open) {
        span.before(img);
        dialog.showModal();
      } else {
        button.append(img);
        dialog.close();
      }
    }
    const toggleDialog = () => {
      // This causes weirdness
      // dialog.style.setProperty("width", img.naturalWidth + "px");
      if (document.startViewTransition) {
        document.startViewTransition(() => moveImage());
      } else moveImage();
    };

    button.addEventListener("click", () => toggleDialog());

    dialog.addEventListener("click", (event) => {
      // This bit is still a little funky
      event.preventDefault()
      if (event.target === dialog) {
        if (!document.startViewTransition) {
          toggleDialog();
          return;
        }
      }
      toggleDialog();
    });
  }

  [...document.querySelectorAll(selector)].forEach(createDialog);
}

createDialogs(".tip-content img");
