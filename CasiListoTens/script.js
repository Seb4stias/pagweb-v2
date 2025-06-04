document.addEventListener('DOMContentLoaded', () => {

    // Array global para almacenar todos los datos de los formularios
    // Comentario: Uso de un arreglo global para persistir los datos de registro.
    const todosLosDatos = [];

    /**
     * @function setupNavbar
     * @description Configura la barra de navegación dinámicamente.
     * Inserta un título y enlaces de navegación al elemento con id 'main-header'.
     * Los enlaces se corresponden con los IDs de las secciones principales.
     */
    function setupNavbar() {
        const header = document.getElementById('main-header');
        if (!header) {
            console.error("Error: Elemento 'main-header' no encontrado para la barra de navegación.");
            return;
        }

        // Ya tienes la estructura nav en el HTML, no es necesario recrearla
        // solo asegúrate que los links apunten bien.
        // Si quisieras que el JS creara la barra de navegacion, esta sería la lógica:
        /*
        const nav = document.createElement('nav');
        nav.innerHTML = `
            <a href="#inicio" class="logo">Mujeres Stem</a>
            <ul class="nav-links">
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#quienes-somos">Quiénes Somos</a></li>
                <li><a href="#nuestros-programas">Nuestros Programas</a></li>
                <li><a href="#contacto">Contacto</a></li>
                <li><a href="#galeria">Galería*</a></li>
            </ul>
        `;
        header.appendChild(nav);
        */

        // Si ya tienes la estructura en HTML, puedes hacer esto para que JS gestione los clics o resaltados.
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                // Previene el comportamiento por defecto del ancla para un scroll suave
                event.preventDefault();
                const targetId = event.target.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * @function generarFormulario
     * @description Genera dinámicamente un formulario de registro en el DOM.
     * Incluye campos para nombre, RUT, edad, email, sexo, profesión, fecha de registro y términos.
     * Implementa manejo de errores visual en los campos.
     */
    function generarFormulario() {
        const formularioContenedor = document.getElementById('formularioContenedor');
        if (!formularioContenedor) {
            console.error("Error: Elemento 'formularioContenedor' no encontrado.");
            return;
        }

        // Limpia el contenido anterior del contenedor del formulario
        formularioContenedor.innerHTML = '';

        // Creación del elemento <form> para una mejor semántica y manejo de submit
        const form = document.createElement('form');
        form.id = 'registroForm';
        form.innerHTML = `
            <table>
                <tr>
                    <td><label for="nombre">Nombre:</label></td>
                    <td>
                        <input type="text" id="nombre" name="nombre" placeholder="Tu nombre completo">
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
                        <input type="email" id="email" name="email" placeholder="tu_email@gmail.com">
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
                    <td><label for="profesion">Profesión:</label></td>
                    <td>
                        <select id="profesion" name="profesion">
                            <option value="">Selecciona una opción</option>
                            <option value="Ingeniero">Ingeniero/a</option>
                            <option value="Doctor">Doctor/a</option>
                            <option value="Abogado">Abogado/a</option>
                            <option value="Profesor">Profesor/a</option>
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
                            <input type="checkbox" id="terminos" name="terminos"> Acepto los <a href="#" target="_blank">términos y condiciones</a>
                        </label>
                        <span class="error-message" id="errorTerminos"></span>
                    </td>
                </tr>
            </table>
            <button type="submit" id="enviarFormulario">Enviar Registro</button>
        `;
        formularioContenedor.appendChild(form);

        // Establece la fecha actual automáticamente
        const fechaRegistroInput = document.getElementById('fechaRegistro');
        if (fechaRegistroInput) {
            fechaRegistroInput.value = new Date().toISOString().slice(0, 10);
        }

        // Asigna el evento de submit al formulario
        form.addEventListener('submit', manejarEnvioFormulario);
    }

    /**
     * @function validarFormulario
     * @description Valida los campos del formulario de registro.
     * Muestra mensajes de error debajo de cada campo si la validación falla.
     * @returns {boolean} True si todos los campos son válidos, False de lo contrario.
     */
    function validarFormulario() {
        let isValid = true;

        // Función auxiliar para mostrar/ocultar mensajes de error
        const mostrarError = (id, message) => {
            const errorElement = document.getElementById(id);
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = message ? 'block' : 'none';
            }
        };

        // 1. Validar Nombre
        const nombreInput = document.getElementById('nombre');
        if (!nombreInput.value.trim()) {
            mostrarError('errorNombre', 'El nombre es obligatorio.');
            isValid = false;
        } else {
            mostrarError('errorNombre', '');
        }

        // 2. Validar RUT (Validación básica: no vacío y al menos 7 caracteres)
        const rutInput = document.getElementById('rut');
        if (!rutInput.value.trim() || rutInput.value.trim().length < 7) {
            mostrarError('errorRut', 'El RUT es obligatorio y debe tener al menos 7 caracteres.');
            isValid = false;
        } else {
            // Validación de formato de RUT simple (ej: 12.345.678-9)
            const rutPattern = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
            if (!rutPattern.test(rutInput.value.trim())) {
                mostrarError('errorRut', 'Formato de RUT inválido (ej: 12.345.678-9)');
                isValid = false;
            } else {
                mostrarError('errorRut', '');
            }
        }

        // 3. Validar Edad (mayor de 18)
        const edadInput = document.getElementById('edad');
        const edad = parseInt(edadInput.value);
        if (isNaN(edad) || edad < 18 || edad > 99) {
            mostrarError('errorEdad', 'Debes ser mayor de 18 y menor de 100 años.');
            isValid = false;
        } else {
            mostrarError('errorEdad', '');
        }

        // 4. Validar Email (contiene @ y termina en @gmail.com)
        const emailInput = document.getElementById('email');
        if (!emailInput.value.trim().includes('@') || !emailInput.value.trim().endsWith('@gmail.com')) {
            mostrarError('errorEmail', 'Debe ser un correo de Gmail válido (ej: tu_email@gmail.com).');
            isValid = false;
        } else {
            mostrarError('errorEmail', '');
        }

        // 5. Validar Sexo (radio button seleccionado)
        const sexoSeleccionado = document.querySelector('input[name="sexo"]:checked');
        if (!sexoSeleccionado) {
            mostrarError('errorSexo', 'Debes seleccionar tu sexo.');
            isValid = false;
        } else {
            mostrarError('errorSexo', '');
        }

        // 6. Validar Profesión (select no vacío)
        const profesionSelect = document.getElementById('profesion');
        if (!profesionSelect.value) {
            mostrarError('errorProfesion', 'Debes seleccionar una profesión.');
            isValid = false;
        } else {
            mostrarError('errorProfesion', '');
        }

        // 7. Validar Términos y Condiciones (checkbox marcado)
        const terminosCheckbox = document.getElementById('terminos');
        if (!terminosCheckbox.checked) {
            mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones.');
            isValid = false;
        } else {
            mostrarError('errorTerminos', '');
        }

        return isValid;
    }

    /**
     * @function manejarEnvioFormulario
     * @description Maneja el evento de envío del formulario.
     * Valida los datos, si son válidos los guarda en el arreglo `todosLosDatos` (objeto).
     * Luego, renderiza los datos en una tabla y oculta el formulario.
     * @param {Event} event - El objeto de evento del submit.
     */
    function manejarEnvioFormulario(event) {
        event.preventDefault(); // Evita el envío tradicional del formulario

        if (!validarFormulario()) {
            alert('Por favor, corrige los errores en el formulario antes de enviar.');
            return; // Detiene la ejecución si la validación falla
        }

        // Recopilación de datos del formulario (creando un objeto)
        const nuevosDatos = {
            nombre: document.getElementById('nombre').value,
            rut: document.getElementById('rut').value,
            edad: parseInt(document.getElementById('edad').value),
            email: document.getElementById('email').value,
            sexo: document.querySelector('input[name="sexo"]:checked').value,
            profesion: document.getElementById('profesion').value,
            fechaRegistro: document.getElementById('fechaRegistro').value
        };

        // Uso de un arreglo para almacenar los objetos de datos
        todosLosDatos.push(nuevosDatos);

        // Renderiza los datos actualizados en la tabla
        renderizarDatos();

        alert('¡Formulario enviado! Tus datos han sido guardados.');

        // Oculta el formulario y muestra el botón de unirse
        document.getElementById('formularioContenedor').innerHTML = '';
        document.getElementById('contacto').style.display = 'block'; // Asegúrate que la sección de contacto siga visible
        document.getElementById('botonUnirse').style.display = 'block';
    }

    /**
     * @function renderizarDatos
     * @description Renderiza los datos de `todosLosDatos` en una tabla HTML.
     * Si no hay datos, la tabla se oculta.
     * @returns {void}
     */
    function renderizarDatos() {
        const datosIngresadosSection = document.getElementById('datosIngresadosSection');
        if (!datosIngresadosSection) {
            console.error("Error: Elemento 'datosIngresadosSection' no encontrado.");
            return;
        }

        datosIngresadosSection.innerHTML = ''; // Limpia el contenido anterior

        if (todosLosDatos.length === 0) {
            datosIngresadosSection.style.display = 'none'; // Oculta la sección si no hay datos
            return;
        }

        datosIngresadosSection.style.display = 'block'; // Asegura que la sección esté visible

        const h2 = document.createElement('h2');
        h2.textContent = 'Registros de Miembros:';
        datosIngresadosSection.appendChild(h2);

        const displayTable = document.createElement('table');
        displayTable.classList.add('datos-ingresados-table');

        // Crea el encabezado de la tabla
        const headerRow = displayTable.insertRow();
        const headers = ['Nombre', 'RUT', 'Edad', 'Email', 'Sexo', 'Profesión', 'Fecha Registro'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        // Itera sobre el arreglo de objetos y crea las filas de la tabla
        todosLosDatos.forEach(dataItem => {
            const row = displayTable.insertRow();
            row.insertCell().textContent = dataItem.nombre;
            row.insertCell().textContent = dataItem.rut;
            row.insertCell().textContent = dataItem.edad;
            row.insertCell().textContent = dataItem.email;
            row.insertCell().textContent = dataItem.sexo;
            row.insertCell().textContent = dataItem.profesion;
            row.insertCell().textContent = dataItem.fechaRegistro;
        });

        datosIngresadosSection.appendChild(displayTable);
    }

    // --- Inicialización ---
    // Comentario: Se ejecuta la configuración de la barra de navegación al cargar el DOM.
    setupNavbar();

    // Event listener para el botón "Únete a nosotros"
    // Comentario: Al hacer clic en el botón, se oculta el botón y se genera el formulario de registro.
    const botonUnirse = document.getElementById('botonUnirse');
    if (botonUnirse) {
        botonUnirse.addEventListener('click', (event) => {
            event.preventDefault(); // Evita el salto instantáneo
            botonUnirse.style.display = 'none';
            // Scroll suave hacia la sección de contacto donde estará el formulario
            const contactSection = document.getElementById('contacto');
            if(contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            generarFormulario();
        });
    } else {
        console.error("Error: Botón 'botonUnirse' no encontrado.");
    }

    // Renderiza los datos existentes (si los hubiera) al cargar la página
    // Comentario: Asegura que la tabla de datos se muestre si ya hay registros previos.
    renderizarDatos();
});