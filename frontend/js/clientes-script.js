// clientes-script.js
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let map, marker;
    let clientsData = [];
    let editingClientId = null;
    
    // Elementos del DOM
    const addClientBtn = document.getElementById('addClientBtn');
    const clientModal = document.getElementById('clientModal');
    const locationModal = document.getElementById('locationModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    const clientForm = document.getElementById('clientForm');
    const locationForm = document.getElementById('locationForm');
    const clientsTableBody = document.getElementById('clientsTableBody');
    const searchClientInput = document.getElementById('searchClient');
    const cityFilter = document.getElementById('cityFilter');
    const addLocationBtn = document.getElementById('addLocationBtn');
    const locateMeBtn = document.getElementById('locateMeBtn');
    const searchAddressBtn = document.getElementById('searchAddressBtn');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const clientLocationSelect = document.getElementById('clientLocation');
    const newLocationDepartment = document.getElementById('newLocationDepartment');
    
    // Datos iniciales de clientes
    const initialClients = [
    {
        id: 1,
        name: "Juan Perez",
        alias: "Juancito",
        location: "La Paz",
        phone: "70123456",
        purchases: "1.500,00 Bs.",
        address: "Calle Murillo #123, Zona Central",
        latitude: "-16.5000",
        longitude: "-68.1500",
        type: "minorista", // Nuevo campo
        additionalInfo: "Cliente frecuente, paga siempre al contado"
    },
    {
        id: 2,
        name: "María García",
        alias: "Mari",
        location: "Santa Cruz",
        phone: "77889000",
        purchases: "4.250,50 Bs.",
        address: "Av. San Martín #456, Barrio Equipetrol",
        latitude: "-17.7833",
        longitude: "-63.1833",
        type: "mayorista", // Nuevo campo
        additionalInfo: "Prefiere productos orgánicos"
    },
    {
        id: 3,
        name: "Carlos Rojas",
        alias: "Carlitos",
        location: "Cochabamba",
        phone: "69544332",
        purchases: "850,00 Bs.",
        address: "Calle España #789, Zona Norte",
        latitude: "-17.3895",
        longitude: "-66.1568",
        type: "corporativo", // Nuevo campo
        additionalInfo: ""
    },
    {
        id: 4,
        name: "Ana Beltran",
        alias: "Anita",
        location: "Tarija",
        phone: "71122334",
        purchases: "0,00 Bs.",
        address: "Av. Las Américas #101, Centro",
        latitude: "-21.5355",
        longitude: "-64.7296",
        type: "ocasional", // Nuevo campo
        additionalInfo: "Cliente nuevo, aún no ha realizado compras"
    }
];
    
    // Inicializar la aplicación
    init();
    
    function init() {
        // Cargar datos iniciales
        clientsData = [...initialClients];
        
        // Inicializar mapa
        initMap();
        
        // Cargar tabla de clientes
        loadClientsTable();
        
        // Inicializar eventos
        initEventListeners();
        
        // Inicializar menú responsive
        initResponsiveMenu();
        
        // Configurar atajo de teclado
        initKeyboardShortcut();
    }
    
    function initMap() {
        // Inicializar mapa centrado en Bolivia
        map = L.map('map').setView([-16.5000, -68.1500], 13);
        
        // Añadir capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Añadir marcador inicial
        marker = L.marker([-16.5000, -68.1500], {
            draggable: true
        }).addTo(map);
        
        // Actualizar coordenadas al mover el marcador
        marker.on('dragend', function(e) {
            const position = marker.getLatLng();
            latitudeInput.value = position.lat.toFixed(4);
            longitudeInput.value = position.lng.toFixed(4);
        });
        
        // Actualizar marcador al hacer clic en el mapa
        map.on('click', function(e) {
            marker.setLatLng(e.latlng);
            latitudeInput.value = e.latlng.lat.toFixed(4);
            longitudeInput.value = e.latlng.lng.toFixed(4);
        });
    }
    
    function initEventListeners() {
        // Botón para agregar cliente
        addClientBtn.addEventListener('click', () => {
            openClientModal();
        });
        
        // Cerrar modales
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        cancelBtns.forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === clientModal) closeAllModals();
            if (e.target === locationModal) closeAllModals();
        });
        
        // Formulario de cliente
        clientForm.addEventListener('submit', handleClientSubmit);
        
        // Formulario de localidad
        locationForm.addEventListener('submit', handleLocationSubmit);
        
        // Botón para agregar nueva localidad
        addLocationBtn.addEventListener('click', () => {
            clientModal.classList.remove('active');
            locationModal.classList.add('active');
        });
        
        // Botón de ubicación automática
        locateMeBtn.addEventListener('click', locateUser);
        
        // Botón de búsqueda de dirección
        searchAddressBtn.addEventListener('click', searchAddress);
        
        // Búsqueda de clientes
        searchClientInput.addEventListener('input', filterClients);
        
        // Filtro por ciudad
        cityFilter.addEventListener('change', filterClients);
        
        // Botón de cerrar sesión
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('¿Está seguro que desea cerrar sesión?')) {
                    window.location.href = 'index.html';
                }
            });
        }
        
        // Navegación del menú
        const menuItems = document.querySelectorAll('.menu-item a');
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#') {
                    e.preventDefault();
                    const menuText = this.querySelector('span').textContent;
                    if (menuText !== 'Clientes') {
                        showNotification(`Navegando a: ${menuText}. Esta funcionalidad se implementaría completamente en una versión avanzada.`, 'info');
                    }
                }
            });
        });
    }
    
    function initResponsiveMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.querySelector('.sidebar');
        
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar menú al hacer clic fuera en móviles
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    function initKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // CTRL + N para abrir formulario de cliente
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                openClientModal();
            }
            
            // ESC para cerrar modales
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });
    }
    
    function openClientModal(client = null) {
    editingClientId = client ? client.id : null;
    
    // Limpiar formulario
    clientForm.reset();
    
    // Actualizar título del modal
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = client ? 'Editar Cliente' : 'Agregar Nuevo Cliente';
    
    // Si se está editando, llenar con datos del cliente
    if (client) {
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientAlias').value = client.alias;
        document.getElementById('clientLocation').value = client.location;
        document.getElementById('clientType').value = client.type || ''; // Nuevo campo
        document.getElementById('clientPhone').value = client.phone;
        document.getElementById('clientAddress').value = client.address;
        document.getElementById('latitude').value = client.latitude;
        document.getElementById('longitude').value = client.longitude;
        document.getElementById('additionalInfo').value = client.additionalInfo;
        
        // Actualizar marcador en el mapa
        if (client.latitude && client.longitude) {
            const latLng = [parseFloat(client.latitude), parseFloat(client.longitude)];
            marker.setLatLng(latLng);
            map.setView(latLng, 13);
        }
    } else {
        // Valores por defecto para nuevo cliente
        document.getElementById('latitude').value = '-16.5000';
        document.getElementById('longitude').value = '-68.1500';
        document.getElementById('clientType').value = 'minorista'; // Valor por defecto
        
        // Centrar mapa en ubicación por defecto
        marker.setLatLng([-16.5000, -68.1500]);
        map.setView([-16.5000, -68.1500], 13);
    }
    
    // Mostrar modal
    clientModal.classList.add('active');
}
    
    function closeAllModals() {
        clientModal.classList.remove('active');
        locationModal.classList.remove('active');
        editingClientId = null;
    }
    
    function handleClientSubmit(e) {
    e.preventDefault();
    
    // Validar formulario (agregar validación para tipo de cliente)
    const name = document.getElementById('clientName').value.trim();
    const location = document.getElementById('clientLocation').value;
    const phone = document.getElementById('clientPhone').value.trim();
    const clientType = document.getElementById('clientType').value; // Nuevo campo
    
    if (!name || !location || !phone || !clientType) {
        showNotification('Por favor complete todos los campos obligatorios (*).', 'error');
        return;
    }
        
        // Obtener datos del formulario
        const clientData = {
        id: editingClientId || clientsData.length + 1,
        name: name,
        alias: document.getElementById('clientAlias').value.trim(),
        location: location,
        type: clientType, // Nuevo campo
        phone: phone,
        address: document.getElementById('clientAddress').value.trim(),
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value,
        additionalInfo: document.getElementById('additionalInfo').value.trim(),
        purchases: editingClientId ? 
            clientsData.find(c => c.id === editingClientId)?.purchases || "0,00 Bs." : 
            "0,00 Bs."
    };
        
        // Guardar cliente
        if (editingClientId) {
            // Actualizar cliente existente
            const index = clientsData.findIndex(c => c.id === editingClientId);
            if (index !== -1) {
                clientsData[index] = clientData;
            }
            showNotification('Cliente actualizado correctamente.', 'success');
        } else {
            // Agregar nuevo cliente
            clientsData.push(clientData);
            showNotification('Cliente agregado correctamente.', 'success');
        }
        
        // Actualizar tabla
        loadClientsTable();
        
        // Cerrar modal
        closeAllModals();
        
        // Actualizar métricas
        updateMetrics();
    }
    
    function handleLocationSubmit(e) {
        e.preventDefault();
        
        const locationName = document.getElementById('newLocationName').value.trim();
        const department = document.getElementById('newLocationDepartment').value;
        
        if (!locationName) {
            showNotification('Por favor ingrese el nombre de la localidad.', 'error');
            return;
        }
        
        // Agregar nueva opción al select de localidades
        const option = document.createElement('option');
        option.value = locationName;
        option.textContent = locationName + (department ? ` (${department})` : '');
        clientLocationSelect.appendChild(option);
        
        // Seleccionar la nueva localidad
        clientLocationSelect.value = locationName;
        
        // También agregar al filtro de ciudades si no existe
        const cityFilterSelect = document.getElementById('cityFilter');
        const existingOption = Array.from(cityFilterSelect.options).find(
            opt => opt.value === locationName
        );
        
        if (!existingOption) {
            const filterOption = document.createElement('option');
            filterOption.value = locationName;
            filterOption.textContent = locationName;
            cityFilterSelect.appendChild(filterOption);
        }
        
        // Cerrar modal de localidad y volver al formulario de cliente
        locationModal.classList.remove('active');
        clientModal.classList.add('active');
        
        // Limpiar formulario de localidad
        locationForm.reset();
        
        showNotification(`Localidad "${locationName}" agregada correctamente.`, 'success');
    }
    
    function loadClientsTable(filteredData = null) {
        const data = filteredData || clientsData;
        clientsTableBody.innerHTML = '';
        
        if (data.length === 0) {
            clientsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: #7f8c8d;">
                        <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        No se encontraron clientes. ¡Agrega tu primer cliente!
                    </td>
                </tr>
            `;
            return;
        }
        
        data.forEach(client => {
        const row = document.createElement('tr');
        
        // Mapear tipo de cliente a texto legible
        let typeText = '';
        let typeClass = '';
        switch(client.type) {
            case 'minorista':
                typeText = 'Minorista';
                typeClass = 'minorista';
                break;
            case 'mayorista':
                typeText = 'Mayorista';
                typeClass = 'mayorista';
                break;
            case 'corporativo':
                typeText = 'Corporativo';
                typeClass = 'corporativo';
                break;
            case 'especial':
                typeText = 'Especial';
                typeClass = 'especial';
                break;
            case 'ocasional':
                typeText = 'Ocasional';
                typeClass = 'ocasional';
                break;
            default:
                typeText = client.type || 'No especificado';
                typeClass = 'ocasional';
        }
        
        row.innerHTML = `
            <td>${client.name}</td>
            <td class="alias">${client.alias || '-'}</td>
            <td class="location">
                <i class="fas fa-map-marker-alt"></i> ${client.location}
            </td>
            <td>
                <span class="client-type ${typeClass}">${typeText}</span>
            </td>
            <td class="phone">${client.phone}</td>
            <td class="purchases">${client.purchases}</td>
            <td class="actions">
                <button class="action-btn edit-btn" data-id="${client.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="action-btn delete-btn" data-id="${client.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        
        clientsTableBody.appendChild(row);
        });
        
        // Agregar eventos a los botones de acción
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const clientId = parseInt(this.getAttribute('data-id'));
                const client = clientsData.find(c => c.id === clientId);
                if (client) {
                    openClientModal(client);
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const clientId = parseInt(this.getAttribute('data-id'));
                deleteClient(clientId);
            });
        });
    }
    
    function filterClients() {
    const searchTerm = searchClientInput.value.toLowerCase();
    const selectedCity = cityFilter.value;
    const selectedType = typeFilter.value; // Nuevo filtro
    
    const filtered = clientsData.filter(client => {
        const matchesSearch = searchTerm === '' || 
            client.name.toLowerCase().includes(searchTerm) ||
            (client.alias && client.alias.toLowerCase().includes(searchTerm)) ||
            client.phone.includes(searchTerm);
        
        const matchesCity = selectedCity === '' || client.location === selectedCity;
        const matchesType = selectedType === '' || client.type === selectedType; // Nuevo filtro
        
        return matchesSearch && matchesCity && matchesType;
    });
    
    loadClientsTable(filtered);
    
    // Actualizar resumen
    const tableSummary = document.querySelector('.table-summary');
    tableSummary.textContent = `Mostrando ${filtered.length} de ${clientsData.length} clientes`;
}
    
    function deleteClient(clientId) {
        if (confirm('¿Está seguro que desea eliminar este cliente?')) {
            clientsData = clientsData.filter(client => client.id !== clientId);
            loadClientsTable();
            updateMetrics();
            showNotification('Cliente eliminado correctamente.', 'success');
        }
    }
    
    function updateMetrics() {
        // Actualizar métricas basadas en los datos actuales
        const totalClients = document.querySelector('.metric-card.primary .metric-value');
        totalClients.textContent = clientsData.length.toLocaleString();
        
        // Actualizar ventas totales (simulado)
        let totalPurchases = 0;
        clientsData.forEach(client => {
            const purchases = parseFloat(client.purchases.replace('Bs.', '').replace(',', '').trim());
            totalPurchases += purchases;
        });
        
        const totalSales = document.querySelector('.metric-card.secondary .metric-value');
        totalSales.textContent = `${totalPurchases.toLocaleString('es-BO', {minimumFractionDigits: 2})} Bs.`;
        
        // Actualizar localidades únicas
        const uniqueLocations = [...new Set(clientsData.map(client => client.location))];
        const locationsMetric = document.querySelector('.metric-card.info .metric-value');
        locationsMetric.textContent = `${uniqueLocations.length} Ciudades`;
    }
    
    function locateUser() {
        if (!navigator.geolocation) {
            showNotification('La geolocalización no es compatible con su navegador.', 'error');
            return;
        }
        
        showNotification('Obteniendo su ubicación...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Actualizar marcador y coordenadas
                marker.setLatLng([lat, lng]);
                map.setView([lat, lng], 15);
                latitudeInput.value = lat.toFixed(4);
                longitudeInput.value = lng.toFixed(4);
                
                showNotification('Ubicación obtenida correctamente.', 'success');
            },
            (error) => {
                let errorMessage = 'No se pudo obtener la ubicación.';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permiso de ubicación denegado.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Información de ubicación no disponible.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'La solicitud de ubicación ha expirado.';
                        break;
                }
                
                showNotification(errorMessage, 'error');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }
    
    function searchAddress() {
        const address = document.getElementById('clientAddress').value;
        
        if (!address) {
            showNotification('Por favor ingrese una dirección para buscar.', 'error');
            return;
        }
        
        showNotification(`Buscando "${address}"...`, 'info');
        
        // En una implementación real, aquí se usaría un servicio de geocodificación
        // Por ahora, simulamos la búsqueda con coordenadas aleatorias cercanas a Bolivia
        
        setTimeout(() => {
            // Coordenadas simuladas para la búsqueda
            const boliviaLat = -16.5000 + (Math.random() - 0.5) * 0.5;
            const boliviaLng = -68.1500 + (Math.random() - 0.5) * 0.5;
            
            // Actualizar marcador y coordenadas
            marker.setLatLng([boliviaLat, boliviaLng]);
            map.setView([boliviaLat, boliviaLng], 15);
            latitudeInput.value = boliviaLat.toFixed(4);
            longitudeInput.value = boliviaLng.toFixed(4);
            
            showNotification(`Dirección "${address}" encontrada aproximadamente.`, 'success');
        }, 1500);
    }
    
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#27ae60';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
        } else {
            notification.style.backgroundColor = '#3498db';
        }
        
        document.body.appendChild(notification);
        
        // Auto-eliminar después de 4 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
        
        // Añadir animaciones CSS si no existen
        if (!document.querySelector('#notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
});