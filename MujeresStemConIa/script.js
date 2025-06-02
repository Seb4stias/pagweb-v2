document.addEventListener('DOMContentLoaded', () => {

    const todosLosDatos = [];

    const navbar = document.getElementById('navbar');
    if (navbar) {
        const title = document.createElement('h1');
        title.textContent = 'Mujeres Stem';
        navbar.appendChild(title);

        const links = ['Inicio', 'Programas', 'Comunidad', 'Recursos', 'Contacto'];
        links.forEach(link => {
            const a = document.createElement('a');
            a.textContent = link;
            a.href = `#${link.toLowerCase()}`;
            navbar.appendChild(a);
        });
    }

    const botonUnirse = document.getElementById('botonUnirse');
    const formularioContenedor = document.getElementById('formularioContenedor');
    const seccionFormulario = document.getElementById('comoUnirse');

    const datosIngresadosContenedor = document.createElement('div');
    datosIngresadosContenedor.id = 'datosIngresadosContenedor';
    if (!document.getElementById('datosIngresadosContenedor')) {
        seccionFormulario.parentNode.insertBefore(datosIngresadosContenedor, seccionFormulario.nextSibling);
    }

    if (!botonUnirse || !formularioContenedor || !seccionFormulario || !datosIngresadosContenedor) {
        console.error("Error: Faltan elementos HTML necesarios para el formulario.");
        return;
    }

    function renderizarDatos() {
        datosIngresadosContenedor.innerHTML = '';

        if (todosLosDatos.length === 0) {
            datosIngresadosContenedor.style.display = 'none';
            return;
        }

        datosIngresadosContenedor.innerHTML = '<h2>Datos de Registros:</h2>';

        const displayTable = document.createElement('table');
        displayTable.classList.add('datos-ingresados-table');

        const headerRow = displayTable.insertRow();
        const headers = ['Nombre', 'RUT', 'Edad', 'Email', 'Sexo', 'Profesión'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        todosLosDatos.forEach(dataItem => {
            const row = displayTable.insertRow();
            row.insertCell().textContent = dataItem.nombre;
            row.insertCell().textContent = dataItem.rut;
            row.insertCell().textContent = dataItem.edad;
            row.insertCell().textContent = dataItem.email;
            row.insertCell().textContent = dataItem.sexo;
            row.insertCell().textContent = dataItem.profesion;
        });

        datosIngresadosContenedor.appendChild(displayTable);
        datosIngresadosContenedor.style.display = 'block';
    }

    botonUnirse.addEventListener('click', (event) => {
        event.preventDefault();

        botonUnirse.style.display = 'none';
        seccionFormulario.style.display = 'block';
        formularioContenedor.innerHTML = '';

        const table = document.createElement('table');
        const formData = [
            { label: 'Nombre:', type: 'text', id: 'nombre' },
            { label: 'RUT:', type: 'text', id: 'rut' },
            { label: 'EDAD:', type: 'number', id: 'edad' },
            { label: 'EMAIL:', type: 'email', id: 'email' },
            { label: 'SEXO:', type: 'radio_sexo' },
            { label: 'PROFESIÓN:', type: 'select', id: 'profesion', options: ['Ingeniero', 'Doctor', 'Abogado', 'Profesor'] }
        ];

        formData.forEach(item => {
            const row = table.insertRow();
            const labelCell = row.insertCell();
            labelCell.textContent = item.label;

            const inputCell = row.insertCell();

            if (item.type === 'text' || item.type === 'number' || item.type === 'email') {
                const input = document.createElement('input');
                input.type = item.type;
                input.id = item.id;
                inputCell.appendChild(input);
            } else if (item.type === 'radio_sexo') {
                const masculinoLabel = document.createElement('label');
                const masculinoRadio = document.createElement('input');
                masculinoRadio.type = 'radio';
                masculinoRadio.name = 'sexo';
                masculinoRadio.value = 'masculino';
                masculinoRadio.id = 'sexoMasculino';
                masculinoLabel.appendChild(masculinoRadio);
                masculinoLabel.appendChild(document.createTextNode(' Masculino '));
                inputCell.appendChild(masculinoLabel);

                const femeninoLabel = document.createElement('label');
                const femeninoRadio = document.createElement('input');
                femeninoRadio.type = 'radio';
                femeninoRadio.name = 'sexo';
                femeninoRadio.value = 'femenino';
                femeninoRadio.id = 'sexoFemenino';
                femeninoLabel.appendChild(femeninoRadio);
                femeninoLabel.appendChild(document.createTextNode(' Femenino'));
                inputCell.appendChild(femeninoLabel);
            } else if (item.type === 'select') {
                const select = document.createElement('select');
                select.id = item.id;
                item.options.forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.textContent = optionText;
                    select.appendChild(option);
                });
                inputCell.appendChild(select);
            }
        });

        formularioContenedor.appendChild(table);

        const enviarBoton = document.createElement('button');
        enviarBoton.textContent = 'Enviar';
        enviarBoton.id = 'enviarFormulario';
        formularioContenedor.appendChild(enviarBoton);

        enviarBoton.addEventListener('click', () => {
            const nombre = document.getElementById('nombre').value;
            const rut = document.getElementById('rut').value;
            const edad = document.getElementById('edad').value;
            const email = document.getElementById('email').value;
            const sexoSeleccionado = document.querySelector('input[name="sexo"]:checked');
            const sexo = sexoSeleccionado ? sexoSeleccionado.value : 'No especificado';
            const profesion = document.getElementById('profesion').value;

            // --- INICIO DE LA NUEVA VALIDACIÓN ---
            if (!nombre.trim() || !email.trim()) { // .trim() para quitar espacios en blanco
                alert('Por favor, ingresa tu nombre y email.');
                return;
            }

            // Validar que el email contenga "@" y termine en "gmail.com"
            if (!email.includes('@') || !email.endsWith('@gmail.com')) {
                alert('Por favor, ingresa un correo electrónico de Gmail válido (debe contener "@" y terminar en "@gmail.com").');
                return; // Detener la ejecución si la validación del email falla
            }
            // --- FIN DE LA NUEVA VALIDACIÓN ---


            const nuevosDatos = {
                nombre: nombre,
                rut: rut,
                edad: edad,
                email: email,
                sexo: sexo,
                profesion: profesion
            };

            todosLosDatos.push(nuevosDatos);

            renderizarDatos();

            alert('¡Formulario enviado! Tus datos han sido guardados.');

            formularioContenedor.innerHTML = '';
            seccionFormulario.style.display = 'none';
            botonUnirse.style.display = 'block';
        });
    });

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = event.target[0].value;
            alert(`Gracias por inscribirte con el correo: ${email}`);
        });
    }

    renderizarDatos();
});