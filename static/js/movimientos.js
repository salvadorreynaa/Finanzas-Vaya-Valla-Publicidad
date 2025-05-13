let movimientosEliminados = [];
let ultimaEliminacion = null;

function cargarMovimientos() {
  const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
  const tbody = document.getElementById("lista-movimientos");
  const mesSeleccionado = document.getElementById("filtroMes").value;
  const añoSeleccionado = document.getElementById("filtroAño").value;

  tbody.innerHTML = "";
  let ingresos = 0;
  let egresos = 0;

  movimientos.forEach((mov, index) => {
    // Convertimos el monto a número de forma segura
    const monto = parseFloat(mov.monto);

    // Si el monto no es un número válido, lo ignoramos
    if (isNaN(monto)) return;

    if (
      (mesSeleccionado === "Todos" || mov.mes === mesSeleccionado) &&
      (añoSeleccionado === "Todos" || mov.año === añoSeleccionado)
    ) {
      const fila = document.createElement("tr");
      fila.id = `movimiento-${index}`; // Agregamos un id único para cada fila

      fila.innerHTML = `
        <td>${mov.tipo}</td>
        <td>${mov.descripcion}</td>
        <td>${mov.cliente}</td>
        <td>${mov.fecha}</td>
        <td>${mov.mes}</td>
        <td>${mov.año}</td>
        <td>${monto.toFixed(2)}</td>
        <td>
          <button class="boton-estado ${mov.estado === "Pagado" || mov.estado === "Cobrado" ? "verde" : ""}" onclick="cambiarEstado(${index})">${mov.estado}</button>
        </td>
        <td>
          <button class="boton-eliminar" onclick="eliminarMovimiento(${index})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);

      if (mov.tipo === "ingreso") ingresos += monto;
      if (mov.tipo === "egreso") egresos += monto;
    }
  });

  const disponible = ingresos - egresos;
  document.getElementById("total-ingresos").textContent = `S/ ${ingresos.toFixed(2)}`;
  document.getElementById("total-egresos").textContent = `S/ ${egresos.toFixed(2)}`;
  document.getElementById("dinero-disponible").textContent = `S/ ${disponible.toFixed(2)}`;
  actualizarResumenCobros(); // ¡Ahora sí se actualiza el resumen!

}

function cambiarEstado(index) {
  let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
  const actual = movimientos[index].estado;
  let siguiente = actual;

  if (movimientos[index].tipo === "ingreso") {
    const estadosIngreso = ["Pendiente", "Cobrado"];
    siguiente = estadosIngreso[(estadosIngreso.indexOf(actual) + 1) % estadosIngreso.length];
  } else if (movimientos[index].tipo === "egreso") {
    const estadosEgreso = ["Pendiente", "Pagado"];
    siguiente = estadosEgreso[(estadosEgreso.indexOf(actual) + 1) % estadosEgreso.length];
  }

  movimientos[index].estado = siguiente;
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
  cargarMovimientos();
}

function eliminarMovimiento(index) {
  let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
  
  // Mostrar un mensaje de confirmación antes de eliminar
  const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta transacción?");
  
  if (confirmacion) {
    // Guardamos el movimiento eliminado para poder deshacerlo
    const movEliminado = movimientos.splice(index, 1)[0];
    movimientosEliminados.push(movEliminado);
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
    cargarMovimientos();

    // Muestra el botón "Deshacer" después de la eliminación
    mostrarBotonDeshacer();
  }
}


function mostrarBotonDeshacer() {
  const botonDeshacer = document.getElementById("fila-deshacer");
  botonDeshacer.style.display = "table-row"; // Muestra el botón deshacer
}

function deshacerEliminacion() {
  if (movimientosEliminados.length > 0) {
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    const movRestaurado = movimientosEliminados.pop();
    movimientos.push(movRestaurado); // Restauramos el último movimiento eliminado
    localStorage.setItem("movimientos", JSON.stringify(movimientos));
    cargarMovimientos();
  }
}

function actualizarResumenCobros() {
  let totalCobrado = 0;
  let totalPorCobrar = 0;

  const filas = document.querySelectorAll('#lista-movimientos tr');

  filas.forEach(fila => {
    const tipo = fila.querySelector('td:nth-child(1)').textContent.trim();  // ingreso o egreso
    const estado = fila.querySelector('td:nth-child(8)').textContent.trim(); // Cobrado, Pendiente
    const monto = parseFloat(fila.querySelector('td:nth-child(7)').textContent.trim());

    // Solo tomamos en cuenta los INGRESOS
    if (tipo === "ingreso") {
      if (estado === "Cobrado") {
        totalCobrado += monto;
      } else if (estado === "Pendiente") {
        totalPorCobrar += monto;
      }
    }
  });

  document.getElementById('dinero-cobrado').textContent = `S/ ${totalCobrado.toFixed(2)}`;
  document.getElementById('dinero-por-cobrar').textContent = `S/ ${totalPorCobrar.toFixed(2)}`;
}



document.getElementById("filtroMes").addEventListener("change", cargarMovimientos);
document.getElementById("filtroAño").addEventListener("change", cargarMovimientos);
window.addEventListener("load", cargarMovimientos);
