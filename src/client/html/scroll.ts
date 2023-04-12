export function scrollToElement(id: string) {
  const targetElement = document.getElementById(id);
  if (targetElement) {
    (targetElement as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
}

export function scrollToTopOfPage() {
  const divElement = document.getElementById("page-container");
  if (divElement) {
    divElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

export function scrollToBottomOfPage() {
  const divElement = document.getElementById("page-container");
  if (divElement) {
    divElement.scrollTo({
      top: divElement.scrollHeight,
      behavior: "smooth",
    });
  }
}
