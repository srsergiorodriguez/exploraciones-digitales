console.log("this only runs in the HTML build!");

const sectionListElements = [];

window.onload = function() {
  setSectionMenu();
};


async function setSectionMenu() {
  const dimension = document.getElementsByTagName("dimension")[0];

  const list = document.getElementsByTagName("aside")[0].getElementsByClassName("subcontent")[0].children;

  const header = document.getElementsByClassName("chapter-headers")[0].getElementsByTagName("h1")[0].textContent;

  const anchors = [];

  for (let l of list) {
    const dimensionLinkName = l.querySelector("a").textContent;
    if (dimensionLinkName === header) {
      const dimensionList = l.querySelector("ul").getElementsByTagName("a");

      for (let dl of dimensionList) {
        const anchor = "#" + dl.getAttribute("href").split("#")[1];
        const key = dl.textContent;
        anchors.push({key, anchor});

        if (dimension !== undefined) {
          const li = document.createElement("li");
          li.appendChild(dl.cloneNode(true));
          sectionListElements.push(li);
          dimension.appendChild(li);
        }

      }
      
    }

    const subcontents = l.getElementsByClassName('subcontent');

    for (let s of subcontents) {
      s.remove();
    }
  }  

  
  
}

document.addEventListener("scroll", () => {
  let visibleh1 = Array.from(document.querySelector('article').getElementsByTagName('h1')).find(isElementInViewport);

  if (visibleh1) {
    for (let l of sectionListElements) {
      if (l.querySelector("a").textContent === visibleh1.textContent) {
        l.classList.add("current-section");

        // const a = l.querySelector("a");
        // a.classList.add("current-section");
      }
    }
  }

});

function isElementInViewport(el) {
  let rect = el.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

async function delay(time) {
  return new Promise((r) => {
    setTimeout(() => {
      r(true)
    }, time)
  })
}
