document.addEventListener("DOMContentLoaded", function () {
  // Initialize FAQ accordion functionality
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");

    header.addEventListener("click", () => {
      // Toggle active class on clicked item
      const isActive = item.classList.contains("active");

      // Close all accordion items
      accordionItems.forEach((accItem) => {
        accItem.classList.remove("active");
      });

      // If the clicked item wasn't active, make it active
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
});
