function drawDataChangers() {
  document.querySelectorAll("[data-changer]").forEach((el) => {
    let pos = el.dataset.pos.split(",").map((e) => parseInt(e.trim()));
    el.style.gridColumn = `${pos[0]} / ${pos[1]}`;
    el.style.gridRow = `${pos[2]} / ${pos[3]}`;
  });
}
drawDataChangers();