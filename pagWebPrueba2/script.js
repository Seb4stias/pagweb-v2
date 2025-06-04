document.addEventListener('DOMContentLoaded', () => {

    // Arreglo global para almacenar todos los datos de los usuarios registrados.
    // Este arreglo simula una base de datos temporal en el cliente.
    const todosLosDatos = [];

    /**
     * @function setupNavbar
     * @description Configura los event listeners para los enlaces de la barra de navegación.
     * Permite un scroll suave a las secciones correspondientes del sitio.
     */
    function setupNavbar() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                // Evita el comportamiento predeterminado del enlace (salto instantáneo)
                event.preventDefault();
                const targetId = event.target.getAttribute('href'); // Obtiene el ID de la sección (#inicio, #contacto, etc.)
                const targetSection = document.querySelector(targetId); // Selecciona el elemento de la sección
                if (targetSection) {
                    // Realiza un scroll suave hasta la sección de destino
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * @function generarFormulario
     * @description Crea dinámicamente el formulario de registro en el DOM.
     * Incluye los campos requeridos: texto, numérico, email, listbox, checkbox y fecha automática.
     * También añade los elementos para mostrar mensajes de error.
     */
    function generarFormulario() {
        const formularioContenedor = document.getElementById('formularioContenedor');
        if (!formularioContenedor) {
            console.error("Error: Elemento 'formularioContenedor' no encontrado para generar el formulario.");
            return;
        }

        // Limpia cualquier contenido previo dentro del contenedor del formulario
        formularioContenedor.innerHTML = '';

        // Crea el elemento <form> para una semántica HTML correcta y facilita el manejo del submit
        const form = document.createElement('form');
        form.id = 'registroForm'; // Asigna un ID al formulario para un acceso fácil

        // Define la estructura de los campos del formulario, incluyendo IDs y tipos para la validación
        form.innerHTML = `
            <table>
                <tr>
                    <td><label for="nombre">Nombre Completo:</label></td>
                    <td>
                        <input type="text" id="nombre" name="nombre" placeholder="Ej: Juan Pérez">
                        <span class="error-message" id="errorNombre"></span>
                    </td>
                </tr>
                <tr>
                    <td><label for="rut">RUT:</label></td>
                    <td>
                        <input type="text" id="rut" name="rut" placeholder="Ej: 12.345.678-9">
                        <span class="error-message" id="errorRut"></span>
                    </td>
                </tr>
                <tr>
                    <td><label for="edad">Edad:</label></td>
                    <td>
                        <input type="number" id="edad" name="edad" min="18" max="99" placeholder="Mayor de 18">
                        <span class="error-message" id="errorEdad"></span>
                    </td>
                </tr>
                <tr>
                    <td><label for="email">Email:</label></td>
                    <td>
                        <input type="email" id="email" name="email" placeholder="tu.correo@gmail.com">
                        <span class="error-message" id="errorEmail"></span>
                    </td>
                </tr>
                <tr>
                    <td><label>Sexo:</label></td>
                    <td>
                        <label><input type="radio" name="sexo" value="masculino"> Masculino</label>
                        <label><input type="radio" name="sexo" value="femenino"> Femenino</label>
                        <label><input type="radio" name="sexo" value="otro"> Otro</label>
                        <span class="error-message" id="errorSexo"></span>
                    </td>
                </tr>
                <tr>
                    <td><label for="profesion">Profesión/Área de Interés:</label></td>
                    <td>
                        <select id="profesion" name="profesion">
                            <option value="">-- Selecciona una opción --</option>
                            <option value="Ingeniería">Ingeniería</option>
                            <option value="Ciencia">Ciencia</option>
                            <option value="Tecnología">Tecnología (Desarrollo/IT)</option>
                            <option value="Matemáticas">Matemáticas/Estadística</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Otros">Otros</option>
                        </select>
                        <span class="error-message" id="errorProfesion"></span>
                    </td>
                </tr>
                <tr>
                    <td><label for="fechaRegistro">Fecha de Registro:</label></td>
                    <td>
                        <input type="date" id="fechaRegistro" name="fechaRegistro" readonly>
                        <span class="error-message" id="errorFechaRegistro"></span>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <label>
                            <input type="checkbox" id="terminos" name="terminos"> Acepto los <a href="#" target="_blank">términos y condiciones</a> de uso.
                        </label>
                        <span class="error-message" id="errorTerminos"></span>
                    </td>
                </tr>
            </table>
            <button type="submit" id="enviarFormulario">Enviar Registro</button>
        `;
        formularioContenedor.appendChild(form); // Añade el formulario al contenedor

        // Establece la fecha actual automáticamente en el campo de fecha.
        // La fecha se obtiene en formato ISO y se recorta para 'YYYY-MM-DD'.
        const fechaRegistroInput = document.getElementById('fechaRegistro');
        if (fechaRegistroInput) {
            fechaRegistroInput.value = new Date().toISOString().slice(0, 10);
        }

        // Añade un event listener al formulario para manejar su envío.
        form.addEventListener('submit', manejarEnvioFormulario);
    }

    /**
     * @function validarFormulario
     * @description Realiza la validación de todos los campos del formulario.
     * Muestra mensajes de error específicos debajo de cada campo si la validación falla.
     * @returns {boolean} Retorna true si todos los campos son válidos, false en caso contrario.
     */
    function validarFormulario() {
        let isValid = true; // Bandera para controlar la validez general del formulario

        // Función auxiliar para mostrar u ocultar mensajes de error.
        const mostrarError = (id, message) => {
            const errorElement = document.getElementById(id);
            if (errorElement) {
                errorElement.textContent = message; // Asigna el texto del mensaje de error
                errorElement.style.display = message ? 'block' : 'none'; // Muestra u oculta el mensaje
            }
        };

        // 1. Validar Nombre: No debe estar vacío.
        const nombreInput = document.getElementById('nombre');
        if (!nombreInput.value.trim()) { // .trim() elimina espacios en blanco al inicio/final
            mostrarError('errorNombre', 'El nombre es obligatorio.');
            isValid = false;
        } else {
            mostrarError('errorNombre', ''); // Limpia el error si es válido
        }

        // 2. Validar RUT: No debe estar vacío y debe seguir un formato básico (ej: 12.345.678-9).
        const rutInput = document.getElementById('rut');
        // Expresión regular para un RUT chileno básico (sin validar dígito verificador matemáticamente)
        const rutPattern = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
        if (!rutInput.value.trim() || !rutPattern.test(rutInput.value.trim())) {
            mostrarError('errorRut', 'Formato de RUT inválido (ej: 12.345.678-9).');
            isValid = false;
        } else {
            mostrarError('errorRut', '');
        }

        // 3. Validar Edad: Debe ser un número entre 18 y 99.
        const edadInput = document.getElementById('edad');
        const edad = parseInt(edadInput.value); // Convierte el valor a número entero
        if (isNaN(edad) || edad < 18 || edad > 99) {
            mostrarError('errorEdad', 'Debes tener entre 18 y 99 años.');
            isValid = false;
        } else {
            mostrarError('errorEdad', '');
        }

        // 4. Validar Email: Debe contener '@' y terminar en '@gmail.com'.
        const emailInput = document.getElementById('email');
        if (!emailInput.value.trim().includes('@') || !emailInput.value.trim().endsWith('@gmail.com')) {
            mostrarError('errorEmail', 'Debe ser un correo de Gmail válido (ej: tu.correo@gmail.com).');
            isValid = false;
        } else {
            mostrarError('errorEmail', '');
        }

        // 5. Validar Sexo: Un radio button debe estar seleccionado.
        const sexoSeleccionado = document.querySelector('input[name="sexo"]:checked');
        if (!sexoSeleccionado) {
            mostrarError('errorSexo', 'Debes seleccionar una opción de sexo.');
            isValid = false;
        } else {
            mostrarError('errorSexo', '');
        }

        // 6. Validar Profesión: Se debe seleccionar una opción diferente a la predeterminada.
        const profesionSelect = document.getElementById('profesion');
        if (!profesionSelect.value) { // Si el valor es vacío, no se ha seleccionado una opción válida
            mostrarError('errorProfesion', 'Debes seleccionar tu profesión/área de interés.');
            isValid = false;
        } else {
            mostrarError('errorProfesion', '');
        }

        // 7. Validar Términos y Condiciones: El checkbox debe estar marcado.
        const terminosCheckbox = document.getElementById('terminos');
        if (!terminosCheckbox.checked) {
            mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones para registrarte.');
            isValid = false;
        } else {
            mostrarError('errorTerminos', '');
        }

        return isValid; // Retorna el estado final de la validación
    }

    /**
     * @function manejarEnvioFormulario
     * @description Callback que se ejecuta cuando el formulario es enviado.
     * Primero valida el formulario, luego recopila los datos y los almacena en el arreglo global.
     * Finalmente, actualiza la tabla de datos y resetea la interfaz del formulario.
     * @param {Event} event - El objeto de evento del 'submit'.
     */
    function manejarEnvioFormulario(event) {
        event.preventDefault(); // Evita que la página se recargue al enviar el formulario

        // Llama a la función de validación. Si no es válido, detiene el proceso.
        if (!validarFormulario()) {
            alert('Por favor, corrige los errores marcados en el formulario.');
            return;
        }

        // Recopila los datos de los campos del formulario y los guarda en un objeto.
        // Este objeto es un ejemplo de "uso de objetos con Javascript".
        const nuevosDatos = {
            nombre: document.getElementById('nombre').value.trim(),
            rut: document.getElementById('rut').value.trim(),
            edad: parseInt(document.getElementById('edad').value),
            email: document.getElementById('email').value.trim(),
            sexo: document.querySelector('input[name="sexo"]:checked').value,
            profesion: document.getElementById('profesion').value,
            fechaRegistro: document.getElementById('fechaRegistro').value // Fecha ya está automática
        };

        // Añade el nuevo objeto de datos al arreglo global.
        // Este es un ejemplo de "uso de arreglos con Javascript".
        todosLosDatos.push(nuevosDatos);

        // Llama a la función para renderizar (mostrar) los datos actualizados en la tabla.
        renderizarDatos();

        alert('¡Registro exitoso! Tus datos han sido guardados.');

        // Oculta el formulario después del envío exitoso y vuelve a mostrar el botón "Únete a nosotros".
        const formularioContenedor = document.getElementById('formularioContenedor');
        if (formularioContenedor) {
            formularioContenedor.innerHTML = ''; // Limpia el formulario
        }
        const botonUnirse = document.getElementById('botonUnirse');
        if (botonUnirse) {
            botonUnirse.style.display = 'inline-block'; // Muestra el botón para que el usuario pueda volver a registrarse
        }
        // Opcional: desplazar hacia arriba a la sección de inicio o a la tabla de datos
        // document.getElementById('datosIngresadosSection').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * @function renderizarDatos
     * @description Genera y muestra una tabla HTML con los datos de todos los registros en `todosLosDatos`.
     * Esta función modifica el DOM para presentar la información.
     */
    function renderizarDatos() {
        const datosIngresadosSection = document.getElementById('datosIngresadosSection');
        if (!datosIngresadosSection) {
            console.error("Error: Elemento 'datosIngresadosSection' no encontrado para mostrar los datos.");
            return;
        }

        // Limpia el contenido anterior de la sección para evitar duplicados al re-renderizar
        datosIngresadosSection.innerHTML = '';

        // Si no hay datos registrados, oculta la sección y termina la función
        if (todosLosDatos.length === 0) {
            datosIngresadosSection.style.display = 'none';
            return;
        }

        // Si hay datos, asegura que la sección sea visible
        datosIngresadosSection.style.display = 'block';

     
        const h2 = document.createElement('h2');
        h2.textContent = 'Registros de Miembros Actuales:';
        datosIngresadosSection.appendChild(h2);

        const displayTable = document.createElement('table');
        displayTable.classList.add('datos-ingresados-table');

     
        const headerRow = displayTable.insertRow();
        const headers = ['Nombre', 'RUT', 'Edad', 'Email', 'Sexo', 'Profesión', 'Fecha Registro'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        // Itera sobre el arreglo `todosLosDatos` y crea una fila (<tr>)
        // por cada objeto de datos, insertando sus propiedades en celdas (<td>).
        todosLosDatos.forEach(dataItem => {
            const row = displayTable.insertRow(); // Crea una nueva fila
            row.insertCell().textContent = dataItem.nombre;
            row.insertCell().textContent = dataItem.rut;
            row.insertCell().textContent = dataItem.edad;
            row.insertCell().textContent = dataItem.email;
            row.insertCell().textContent = dataItem.sexo;
            row.insertCell().textContent = dataItem.profesion;
            row.insertCell().textContent = dataItem.fechaRegistro;
        });

        // Añade la tabla completa al contenedor de datos ingresados.
        datosIngresadosSection.appendChild(displayTable);
    }

    // --- Lógica de Inicialización de la Aplicación ---

    // Ejecuta la configuración de la barra de navegación al cargar el DOM.
    setupNavbar();

    // Obtiene el botón "Únete a nosotros" y el contenedor del formulario.
    const botonUnirse = document.getElementById('botonUnirse');

    
    // Cuando se hace clic, oculta el botón y genera el formulario.
    if (botonUnirse) {
        botonUnirse.addEventListener('click', (event) => {
            event.preventDefault(); 
            botonUnirse.style.display = 'none'; // Oculta el botón
            generarFormulario(); // lllamar para crear y mostrar 
            // Opcional: desplazar la vista hacia la sección del formulario
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        });
    } else {
        console.error("Error: El botón 'Únete a nosotros' (botonUnirse) no fue encontrado.");
    }

    // Llama a renderizarDatos() al inicio para mostrar cualquier dato previamente registrado
    // cambiar por base de datos, para guardar todo (hacer cambios)
    renderizarDatos();
});