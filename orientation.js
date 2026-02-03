const orientation = document.getElementById("orientation");
const orientationBtn = document.getElementById("orientationEnter");

// show orientation when auth succeeds
window.showOrientation = () => {
  const app = document.getElementById("app");

  app.classList.add("soft-hidden");
  orientation.classList.remove("hidden");
};

// temporary action for now
orientationBtn.addEventListener("click", () => {
  orientation.classList.add("fade-out");

  setTimeout(() => {
    orientation.classList.add("soft-hidden");
    // future dashboard will appear here
  }, 800);
});
