
function controladorDeProceso(e=false) {
  if(!e){
  document.querySelector("#innerContainer")?.remove();
  document.querySelector(".ventana")?.remove();
  document.querySelector(".aside")?.remove();
  document.getElementById("nombre-g").classList.add("hidden");
  generateBigDona(global.config_for_big_dona);
  }else{
    deleteWindow();
  }
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
  aside.innerHTML = `↩`;
  document.body.appendChild(aside);
  let boxZise = (Number.isInteger(Math.sqrt(data.length)))?Math.sqrt(data.length):Math.ceil(Math.sqrt(data.length));
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
    let innerTempP = document.createElement("p");
    innerTempP.innerText = `${el["OFICINA-DEPENDENCIA RELACIONADA"]}`;
    block.appendChild(innerTempP);
    block.appendChild(innerP);
    innerTempP.classList.add("dependencia");
   
    block.innerHTML += `<div class="seccion">
        ${el.REVISTA  ? '<a target="_blank" href="' + el.REVISTA + '"> <button type="button"> <img src="https://static.thenounproject.com/png/62080-200.png"/> Previsualizar </button></a>'  : ""}
        ${el.PDF  ? '<a target="_blank" href="' + el.PDF + '"> <button type="button"> <img src="https://static.thenounproject.com/png/29074-200.png"/> Descargar </button></a>'  : ""}
    </div>`; 
    innerContainer.appendChild(block);
  });
  document.body.appendChild(innerContainer);
  drawDataChangers();
}

function mod(n, m) {
  return ((n % m) + m) % m;
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
      const startAngle =  mod((i * angleStep) - (angleStep/2), 2 * Math.PI);
      const endAngle = mod((i + 1) * angleStep - (angleStep/2), 2 * Math.PI) ;
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
   
let arcRadius = (currentRadius + config.thickness/2);
const arcLength =  arcRadius * angleStep;
const pxPerChar = Math.log2(config.innerRadius-arcRadius)**0.07 *10;  
const textLength = section.label.length * arcLength**(1/2);
if (textLength <= arcLength) {
    const textPath = document.createElementNS(svgNS, "textPath");
    textPath.setAttribute("href", `#${textPathId}`);
    textPath.setAttribute("startOffset", "50%");
    textPath.setAttribute("font-weight", "bold");
    textPath.setAttribute("text-anchor", "middle");
    textPath.textContent = section.label.toUpperCase() ;
    textElement.appendChild(textPath);
} 
else {
  arcRadius = (currentRadius + config.thickness/3);
    const words = section.label.split(" ");
    let line1 = "";
    let line2 = "";
    for (let w of words) {
        if ((line1 + " " + w).trim().length * pxPerChar < arcLength) {
            line1 += " " + w;
        } else {
            line2 += " " + w;
        }
    }
    line1 = line1.trim();
    line2 = line2.trim();
    const radiusOuter = arcRadius + Math.log10(config.thickness)**3.5;
    const radiusInner = arcRadius - Math.log10(config.thickness)**3.5;
    const idOuter = `${textPathId}-L1`;
    const idInner = `${textPathId}-L2`;
    const arc1 = document.createElementNS(svgNS, "path");
    arc1.setAttribute("id", idOuter);
    arc1.setAttribute(
        "d",
        `M ${centerX + radiusOuter * Math.cos(startAngle)} ${centerY + radiusOuter * Math.sin(startAngle)}
         A ${radiusOuter} ${radiusOuter} 0 ${largeArc} 1
         ${centerX + radiusOuter * Math.cos(endAngle)} ${centerY + radiusOuter * Math.sin(endAngle)}`
    );
    defs.appendChild(arc1);
    const arc2 = document.createElementNS(svgNS, "path");
    arc2.setAttribute("id", idInner);
    arc2.setAttribute(
        "d",
        `M ${centerX + radiusInner * Math.cos(startAngle)} ${centerY + radiusInner * Math.sin(startAngle)}
         A ${radiusInner} ${radiusInner} 0 ${largeArc} 1
         ${centerX + radiusInner * Math.cos(endAngle)} ${centerY + radiusInner * Math.sin(endAngle)}`
    );
    defs.appendChild(arc2);
    const tp1 = document.createElementNS(svgNS, "textPath");
    tp1.setAttribute("href", `#${idOuter}`);
    tp1.setAttribute("startOffset", "50%");
    tp1.setAttribute("font-weight", "bold");
    tp1.setAttribute("text-anchor", "middle");
    tp1.textContent = line1.toUpperCase();
    const tp2 = document.createElementNS(svgNS, "textPath");
    tp2.setAttribute("href", `#${idInner}`);
    tp2.setAttribute("startOffset", "50%");
    tp2.setAttribute("font-weight", "bold");
    tp2.setAttribute("text-anchor", "middle");
    tp2.textContent = line2.toUpperCase();
    textElement.appendChild(tp1);
    textElement.appendChild(tp2);
}
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
