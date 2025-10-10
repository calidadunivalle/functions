function controladorDeProceso() {
  document.querySelector("#innerContainer")?.remove();
  document.querySelector(".ventana")?.remove();
  document.querySelector(".aside")?.remove();
  document.getElementById("nombre-g").classList.add("hidden");
  generateBigDona(global.config_for_big_dona);
}
let global = {};
function deleteWindow() {
  document.querySelector(".ventana").remove();
  document.getElementById("nombre-g").classList.add("hidden");
  drawBox(global.config_for_draw_box);
}
function setGoblal(name, value) {
  global[name] = value;
}
function getSize(expected) {
  let distanceAvaliable =
    window.innerWidth < window.innerHeight
      ? window.innerWidth
      : window.innerHeight;
  if (expected == "distanceAvaliable") return distanceAvaliable * 0.95;
  if (expected == "innerRadius") return (distanceAvaliable * 0.95) / 5;
  return 0;
}
function drawBox(data) {
document.querySelectorAll("#macroproceso-g,#proceso-g,#nombre-g").forEach(el => el.classList.remove("hidden"));
  document.getElementById("macroproceso-g").innerText =
    data[0]["MACROPROCESO"];
  document.getElementById("macroproceso-g").classList.remove("hidden");
  document.getElementById("proceso-g").innerText = data[0]["PROCESO"];
  document.getElementById("proceso-g").classList.remove("hidden");
  document.getElementById("nombre-g").classList.add("hidden");

  let aside = document.createElement("span");
  aside.setAttribute("class", "aside");
  aside.setAttribute("onclick", "controladorDeProceso()");
  aside.innerHTML = `&times;`;
  document.body.appendChild(aside);
  let boxZise = (Number.isInteger(Math.sqrt(data.length)))?Math.sqrt(data.length):Math.ceil(Math.sqrt(data.length));
//   console.log({boxZise});
  innerContainer = document.createElement("div");
  innerContainer.setAttribute("class","container");
  innerContainer.style.gridTemplateColumns =  `repeat(${boxZise}, 1fr)`;
  innerContainer.style.gridTemplateRows =  `repeat(${boxZise}, 1fr)`;

  innerContainer.setAttribute("data-pos","4, 31, 5, 30");
  innerContainer.setAttribute("data-changer", "");
  innerContainer.setAttribute("id", "innerContainer");

  data.forEach((el) => {
    let block = document.createElement("div");
    block.setAttribute("class", "block c");
    
    let innerP = document.createElement("p");
    innerP.innerText = `${el["NOMBRE GUÍA"].toLowerCase()}`;
    block.appendChild(innerP);
    innerContainer.appendChild(block);

    innerP.addEventListener("click", () => {
      innerContainer?.remove();
      document.getElementById("nombre-g").innerText = el["NOMBRE GUÍA"];
      document.getElementById("nombre-g").classList.remove("hidden");
      document.querySelector(".aside")?.remove();

      let ventana = 
      `<div class="ventana"> <span class="aside" onclick="deleteWindow()">×</span> <div class="seccion">
      ${el.RUTA  ? '<a target="_blank" href="' + el.RUTA + '"> <img src="https://static.thenounproject.com/png/27822-200.png"/> <button type="button"> Ruta metodológica </button></a>'  : ""}
      ${el.REVISTA  ? '<a target="_blank" href="' + el.REVISTA + '"> <img src="https://static.thenounproject.com/png/62080-200.png"/> <button type="button"> Previsualizar guía </button></a>'  : ""}
      ${el.PDF  ? '<a target="_blank" href="' + el.PDF + '"> <img src="https://static.thenounproject.com/png/29074-200.png"/> <button type="button"> Descargar guía </button></a>'  : ""}
      </div>`;
      document.body.innerHTML += ventana;
    });
  });
  document.body.appendChild(innerContainer);
  drawDataChangers();
}
function generateBigDona(config) {
document.querySelectorAll("#macroproceso-g,#proceso-g,#nombre-g").forEach(el => el.classList.add("hidden"));

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", config.width);
  svg.setAttribute("height", config.height);
  const defs = document.createElementNS(svgNS, "defs");
  svg.appendChild(defs);
  const centerX = config.width / 2;
  const centerY = config.height / 2;
  let currentRadius = config.innerRadius / 2;
  config.levels.forEach((level, levelIndex) => {
    const angleStep = (2 * Math.PI) / level.sectionsNumber;
    const outerRadius = currentRadius + config.thickness;
    level.sectionsInfo.forEach((section, i) => {
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;
      const midAngle = (startAngle + endAngle) / 2;
      const path = document.createElementNS(svgNS, "path");
      const largeArc = angleStep > Math.PI ? 1 : 0;
      const x1 = centerX + currentRadius * Math.cos(startAngle);
      const y1 = centerY + currentRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(startAngle);
      const y2 = centerY + outerRadius * Math.sin(startAngle);
      const x3 = centerX + outerRadius * Math.cos(endAngle);
      const y3 = centerY + outerRadius * Math.sin(endAngle);
      const x4 = centerX + currentRadius * Math.cos(endAngle);
      const y4 = centerY + currentRadius * Math.sin(endAngle);
      const d = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}        L ${x4} ${y4} A ${currentRadius} ${currentRadius} 0 ${largeArc} 0 ${x1} ${y1} Z`;
      path.setAttribute("d", d);
      path.setAttribute("fill", `${section.color}`);
      path.setAttribute("stroke", "#fff");
      path.setAttribute("stroke-width", "5");
      const textPathId = `textPath-${levelIndex}-${i}`;
      const textArc = document.createElementNS(svgNS, "path");
      textArc.setAttribute("id", textPathId);
      textArc.setAttribute(
        "d",
        `M ${
          centerX +
          (currentRadius + config.thickness / 3) * Math.cos(startAngle)
        } ${
          centerY +
          (currentRadius + config.thickness / 3) * Math.sin(startAngle)
        } A ${currentRadius + config.thickness / 3} ${
          currentRadius + config.thickness / 3
        } 0 ${largeArc} 1 ${
          centerX + (currentRadius + config.thickness / 3) * Math.cos(endAngle)
        } ${
          centerY + (currentRadius + config.thickness / 3) * Math.sin(endAngle)
        }`
      );
      defs.appendChild(textArc);
      const textElement = document.createElementNS(svgNS, "text");
      if (section.title) {
        textElement.setAttribute("special", section.label);
      }
      const textPath = document.createElementNS(svgNS, "textPath");
      textPath.setAttribute("href", `#${textPathId}`);
      textPath.setAttribute("startOffset", "50%");
      textPath.setAttribute("font-weight", "bold");
      textPath.setAttribute("text-anchor", "middle");
      textPath.textContent = section.label.toUpperCase();
      textElement.appendChild(textPath);
      const group = document.createElementNS(svgNS, "g");
      if (section.title) {
        group.setAttribute("special", section.label);
      }
      group.appendChild(path);
      group.appendChild(textElement);
      if (!section.title) {
        group.addEventListener("mouseover", () =>
          path.setAttribute("fill", "#222")
        );
        group.addEventListener("mouseout", () =>
          path.setAttribute("fill", `${section.color}`)
        );
        group.addEventListener("click", () => {
          if (section.title == true) return false;
          csvToObjectLocal("info.csv", section.label).then((d) => {
            document.querySelector("svg").remove();
            drawBox(d);
            setGoblal("config_for_draw_box", d);
          });
        });
      }
      svg.appendChild(group);
    });
    currentRadius = outerRadius;
  });
  document.body.appendChild(svg);
}
async function csvToObjectLocal(url, filter) {
  const response = await fetch(url);
  const text = await response.text();
  const rows = text.trim().split("\n");
  const headers = rows[0].split(",");
  const data = rows.slice(1).map((row) => {
    const values = row.split(",");
    return headers.reduce((obj, header, index) => {
      let val = Object.hasOwn(values, index) ? values[index].trim() : "";
      obj[header.trim()] = val;
      return obj;
    }, {});
  });
  let tempData = [];
  data.forEach((e, i) => {
    if (e.PROCESO != "" && e.VISIBILIDAD == "TRUE" && e.PROCESO == filter) {
      tempData.push(e);
    }
  });
//   console.log({tempData});
  
  return tempData;
}
async function csvToObject(url) {
  const response = await fetch(url);
  let csv = await response.text();
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map((e) => e.trim());
  let indexOfVisivilidad = headers.indexOf("VISIBILIDAD");
  const data = lines.slice(1);
  let listadoMacro = {};
  data.forEach((line) => {
    const values = line.split(",");
    if (values[indexOfVisivilidad] == "TRUE") {
      let row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index] ? values[index].trim() : "";
      });
      const macroproceso = row["MACROPROCESO"];
      const proceso = row["PROCESO"];
      if (macroproceso){
        if (!listadoMacro[macroproceso]) {
          listadoMacro[macroproceso] = {
            titulo: macroproceso,
            procesos: new Set(),
          };
        }
        if (proceso) {
          listadoMacro[macroproceso].procesos.add(proceso);
        }
      }
    }
  });
  Object.keys(listadoMacro).forEach((key) => {
    listadoMacro[key].procesos = Array.from(listadoMacro[key].procesos);
  });
// console.log({listadoMacro});
  return listadoMacro;
}
csvToObject("info.csv").then((data) => {
  let levels = [];
  Object.values(data).forEach((e) => {
    let tempObj = {};
    tempObj.sectionsNumber = e.procesos.length + 1;
    tempObj.titulo = e.titulo;
    levels.push(tempObj);
  });

  levels.forEach((e) => {
    let innerInfo = data[e.titulo].procesos.map((e) => {
      return { label: e, title: false };
    });
    let text = "";
    if (e.titulo == "ESTRATÉGICO") text = "ESTRATÉGICOS";
    if (e.titulo == "MISIONAL") text = "MISIONALES";
    if (e.titulo == "SOPORTE") text = "SOPORTE";
    if (e.titulo == "CONTROL Y EVALUACIÓN") text = "CONTROL Y EVALUACIÓN";
    innerInfo.push({ label: text, title: true });

    e.sectionsInfo = innerInfo;
  });

  function setColor(b, p) {
    if (b) {
      if (p == "ESTRATÉGICO") return "#ffe4c5";
      if (p == "MISIONAL") return "#ffb6b9";
      if (p == "SOPORTE") return "#e4ffc0";
      if (p == "CONTROL Y EVALUACIÓN") return "#c3fffb";
    } else {
      if (p == "ESTRATÉGICO") return "var(--color-macro-estratégico)";
      if (p == "MISIONAL") return "var(--color-macro-misional)";
      if (p == "SOPORTE") return "var(--color-macro-soporte)";
      if (p == "CONTROL Y EVALUACIÓN")
        return "var(--color-macro-control-y-evaluacion)";
    }
  }

  levels.forEach((e, i) => {
    e.sectionsInfo.forEach((ee, ii) => {
      levels[i].sectionsInfo[ii].color = setColor(ee.title, e.titulo);
    });
    e.sectionsInfo.sort((a, b) => (b.title === true) - (a.title === true));
  });
const orden = ["SOPORTE", "MISIONAL", "ESTRATÉGICO", "CONTROL Y EVALUACIÓN"];
levels.sort((a, b) => orden.indexOf(a.titulo) - orden.indexOf(b.titulo)).reverse();

  let c = { levels };
  let indice = 0.45;
  let size = getSize("distanceAvaliable");
  c.innerRadius = size * indice;
  c.width = size;
  c.height = size;
  c.thickness = ((size - c.innerRadius) / c.levels.length) * 0.5;

  generateBigDona(c);
  setGoblal("config_for_big_dona", c);
});
