// console.log("JavaScript Activado");

const sectionListElements = [];

window.onload = function() {
  setSectionMenu();
};

async function setSectionMenu() {
  const dimension = document.getElementsByTagName("dimension")[0];

  const subsectionList = document.getElementsByTagName("aside")[0].getElementsByClassName("subsection-toc");
  if (subsectionList.length <= 0) return

  const header = document.getElementsByClassName("chapter-headers")[0].getElementsByTagName("h1")[0].textContent;

  for (let s of subsectionList) {
    const subsectionsParent = s.getAttribute("chapter-parent");

    if (subsectionsParent === header) {
      const listElements = s.children;
      
      for (let l of listElements) {
        const li = document.createElement("li");
        li.appendChild(l.cloneNode(true));
        sectionListElements.push(li);
        dimension.appendChild(li);
      }
    }
  }

  for (let i = subsectionList.length - 1; i >= 0; i --) { subsectionList[i].remove() };
}

document.addEventListener("scroll", () => {
  let visibleh1 = Array.from(document.querySelector('article').getElementsByTagName('h1')).find(isElementInViewport);

  if (visibleh1) {
    for (let l of sectionListElements) {
      if (l.textContent === visibleh1.textContent) {
        l.classList.add("current-section");
      } else {
        l.classList.remove("current-section");
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
