const toggleAccordion = () => {
  const acc = document.querySelectorAll(".table-layout__button");

  for (let i = 0; i < acc.length; i++) {
    const heading = acc[i];

    heading.addEventListener("click", () => {
      heading.classList.toggle("active");

      const panel = heading.nextElementSibling;
      const icon = heading.querySelector("img");
      if (panel.style.display === "flex") {
        panel.style.display = "none";
        icon.style.transform = "rotate(90deg)";
      } else {
        panel.style.display = "flex";
        icon.style.transform = "rotate(-90deg)";
      }
    });
  }
};

export default toggleAccordion;
