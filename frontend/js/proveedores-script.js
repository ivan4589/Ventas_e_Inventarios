// proveedores-script.js
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let suppliersData = [];
    let editingSupplierId = null;
    
    // Elementos del DOM
    const addSupplierBtn = document.getElementById('addSupplierBtn');
    const supplierModal = document.getElementById('supplierModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    const supplierForm = document.getElementById('supplierForm');
    const suppliersTableBody = document.getElementById('suppliersTableBody');
    const searchSupplierInput = document.getElementById('searchSupplier');
    const statusFilter = document.getElementById('statusFilter');
    
    // Datos iniciales de proveedores
    const initialSuppliers = [
        {
            id: 1,
            companyName: "Suministros Médicos S.R.L.",
            companyId: "N°11 00185/175",
            responsiblePerson: "Carlos Manuel Guerrero Viera",
            phone: "71234567",
            email: "contacto@suministrosmedicos.bo",
            address: "Av. Arce #1234, La Paz",
            status: "activo",
            nit: "123456789",
            website: "https://www.suministrosmedicos.bo",
            paymentTerms: "30dias",
            additionalInfo: "Suministro de equipos médicos y medicamentos",
            internalNotes: "Proveedor confiable, entrega puntual"
        },
        {
            id: 2,
            companyName: "Alimentos Bolivia S.A.",
            companyId: "N°7 881279/31",
            responsiblePerson: "Lucia Vargas Dionisio",
            phone: "65432109",
            email: "ventas@alimentosbolivia.bo",
            address: "Calle Junín #567, Santa Cruz",
            status: "activo",
            nit: "987654321",
            website: "",
            paymentTerms: "15dias",
            additionalInfo: "Distribuidor de alimentos a nivel nacional",
            internalNotes: "Excelente relación calidad-precio"
        },
        {
            id: 3,
            companyName: "TecniPlast Distribuidora",
            companyId: "N°1 15452/281",
            responsiblePerson: "Roberto Corvalán Iriarte",
            phone: "78545012",
            email: "r.corvalan@tecniplast.com",
            address: "Av. Blanco Galindo #890, Cochabamba",
            status: "pendiente",
            nit: "456789123",
            website: "https://www.tecniplast.com",
            paymentTerms: "contado",
            additionalInfo: "Materiales plásticos para la industria",
            internalNotes: "Documentación pendiente de verificación"
        }
    ];
    
    // Inicializar la aplicación
    init();
    
    function init() {
        // Cargar datos iniciales
        suppliersData = [...initialSuppliers];
        
        // Cargar tabla de proveedores
        loadSuppliersTable();
        
        // Inicializar eventos
        initEventListeners();
        
        // Inicializar menú responsive
        initResponsiveMenu();
        
        // Configurar atajo de teclado
        initKeyboardShortcut();
    }
    
    function initEventListeners() {
        // Botón para agregar proveedor
        addSupplierBtn.addEventListener('click', () => {
            openSupplierModal();
        });
        
        // Cerrar modales
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        cancelBtns.forEach(btn => {
            btn.addEventListener('click', closeModal);
        });
        
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === supplierModal) closeModal();
        });
        
        // Formulario de proveedor
        supplierForm.addEventListener('submit', handleSupplierSubmit);
        
        // Búsqueda de proveedores
        searchSupplierInput.addEventListener('input', filterSuppliers);
        
        // Filtro por estado
        statusFilter.addEventListener('change', filterSuppliers);
        
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
                    if (menuText !== 'Proveedores') {
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
            // CTRL + P para abrir formulario de proveedor
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                openSupplierModal();
            }
            
            // ESC para cerrar modal
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    function openSupplierModal(supplier = null) {
        editingSupplierId = supplier ? supplier.id : null;
        
        // Limpiar formulario
        supplierForm.reset();
        
        // Actualizar título del modal
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = supplier ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor';
        
        // Si se está editando, llenar con datos del proveedor
        if (supplier) {
            document.getElementById('companyName').value = supplier.companyName;
            document.getElementById('responsiblePerson').value = supplier.responsablePerson || supplier.responsiblePerson;
            document.getElementById('phoneNumber').value = supplier.phone;
            document.getElementById('nitNumber').value = supplier.nit || '';
            document.getElementById('email').value = supplier.email || '';
            document.getElementById('website').value = supplier.website || '';
            document.getElementById('address').value = supplier.address || '';
            document.getElementById('additionalInfo').value = supplier.additionalInfo || '';
            document.getElementById('paymentTerms').value = supplier.paymentTerms || '';
            document.getElementById('supplierStatus').value = supplier.status;
            document.getElementById('internalNotes').value = supplier.internalNotes || '';
        }
        
        // Mostrar modal
        supplierModal.classList.add('active');
    }
    
    function closeModal() {
        supplierModal.classList.remove('active');
        editingSupplierId = null;
    }
    
    function handleSupplierSubmit(e) {
        e.preventDefault();
        
        // Validar formulario
        const companyName = document.getElementById('companyName').value.trim();
        const responsiblePerson = document.getElementById('responsiblePerson').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        
        if (!companyName || !responsiblePerson || !phoneNumber) {
            showNotification('Por favor complete todos los campos obligatorios (*).', 'error');
            return;
        }
        
        // Validar email si se ingresó
        const email = document.getElementById('email').value.trim();
        if (email && !isValidEmail(email)) {
            showNotification('Por favor ingrese un correo electrónico válido.', 'error');
            return;
        }
        
        // Validar NIT si se ingresó
        const nitNumber = document.getElementById('nitNumber').value.trim();
        if (nitNumber && !isValidNIT(nitNumber)) {
            showNotification('Por favor ingrese un NIT válido (solo números).', 'error');
            return;
        }
        
        // Obtener datos del formulario
        const supplierData = {
            id: editingSupplierId || suppliersData.length + 1,
            companyName: companyName,
            responsiblePerson: responsiblePerson,
            phone: phoneNumber,
            email: email,
            nit: nitNumber,
            website: document.getElementById('website').value.trim(),
            address: document.getElementById('address').value.trim(),
            additionalInfo: document.getElementById('additionalInfo').value.trim(),
            paymentTerms: document.getElementById('paymentTerms').value,
            status: document.getElementById('supplierStatus').value,
            internalNotes: document.getElementById('internalNotes').value.trim(),
            // Generar un ID de empresa simulado
            companyId: `N°${Math.floor(Math.random() * 20) + 1} ${Math.floor(Math.random() * 900000) + 10000}/${Math.floor(Math.random() * 900) + 100}`
        };
        
        // Guardar proveedor
        if (editingSupplierId) {
            // Actualizar proveedor existente
            const index = suppliersData.findIndex(s => s.id === editingSupplierId);
            if (index !== -1) {
                suppliersData[index] = supplierData;
            }
            showNotification('Proveedor actualizado correctamente.', 'success');
        } else {
            // Agregar nuevo proveedor
            suppliersData.push(supplierData);
            showNotification('Proveedor agregado correctamente.', 'success');
        }
        
        // Actualizar tabla
        loadSuppliersTable();
        
        // Cerrar modal
        closeModal();
    }
    
    function loadSuppliersTable(filteredData = null) {
        const data = filteredData || suppliersData;
        suppliersTableBody.innerHTML = '';
        
        if (data.length === 0) {
            suppliersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px; color: #7f8c8d;">
                        <i class="fas fa-truck" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        No se encontraron proveedores. ¡Agrega tu primer proveedor!
                    </td>
                </tr>
            `;
            return;
        }
        
        data.forEach(supplier => {
            const row = document.createElement('tr');
            
            // Determinar clase de estado
            let statusClass = '';
            let statusText = '';
            switch(supplier.status) {
                case 'activo':
                    statusClass = 'active';
                    statusText = 'Activo';
                    break;
                case 'inactivo':
                    statusClass = 'inactive';
                    statusText = 'Inactivo';
                    break;
                case 'pendiente':
                    statusClass = 'pending';
                    statusText = 'Pendiente';
                    break;
            }
            
            row.innerHTML = `
                <td class="company">
                    ${supplier.companyName}
                    ${supplier.companyId ? `<span class="company-id">${supplier.companyId}</span>` : ''}
                </td>
                <td class="responsible">${supplier.responsiblePerson}</td>
                <td class="contact-info">
                    <div class="contact-item phone">
                        <i class="fas fa-phone"></i> ${supplier.phone}
                    </div>
                    ${supplier.email ? `
                    <div class="contact-item email">
                        <i class="fas fa-envelope"></i> ${supplier.email}
                    </div>` : ''}
                </td>
                <td>
                    <span class="status ${statusClass}">${statusText}</span>
                </td>
                <td class="actions">
                    <button class="action-btn view-btn" data-id="${supplier.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${supplier.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${supplier.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            suppliersTableBody.appendChild(row);
        });
        
        // Agregar eventos a los botones de acción
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = parseInt(this.getAttribute('data-id'));
                const supplier = suppliersData.find(s => s.id === supplierId);
                if (supplier) {
                    openSupplierModal(supplier);
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = parseInt(this.getAttribute('data-id'));
                deleteSupplier(supplierId);
            });
        });
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = parseInt(this.getAttribute('data-id'));
                viewSupplier(supplierId);
            });
        });
    }
    
    function filterSuppliers() {
        const searchTerm = searchSupplierInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;
        
        const filtered = suppliersData.filter(supplier => {
            const matchesSearch = searchTerm === '' || 
                supplier.companyName.toLowerCase().includes(searchTerm) ||
                supplier.responsiblePerson.toLowerCase().includes(searchTerm) ||
                supplier.phone.includes(searchTerm) ||
                (supplier.email && supplier.email.toLowerCase().includes(searchTerm));
            
            const matchesStatus = selectedStatus === '' || supplier.status === selectedStatus;
            
            return matchesSearch && matchesStatus;
        });
        
        loadSuppliersTable(filtered);
        
        // Actualizar resumen
        const tableSummary = document.querySelector('.table-summary');
        tableSummary.textContent = `Mostrando ${filtered.length} de ${suppliersData.length} proveedores`;
        
        // Actualizar paginación
        const paginationInfo = document.querySelector('.pagination-info');
        paginationInfo.textContent = `Página 1 de ${Math.max(1, Math.ceil(filtered.length / 10))}`;
    }
    
    function deleteSupplier(supplierId) {
        if (confirm('¿Está seguro que desea eliminar este proveedor?')) {
            suppliersData = suppliersData.filter(supplier => supplier.id !== supplierId);
            loadSuppliersTable();
            showNotification('Proveedor eliminado correctamente.', 'success');
        }
    }
    
    function viewSupplier(supplierId) {
        const supplier = suppliersData.find(s => s.id === supplierId);
        if (supplier) {
            let detailsHtml = `
                <h3>${supplier.companyName}</h3>
                <p><strong>ID Empresa:</strong> ${supplier.companyId || 'No especificado'}</p>
                <p><strong>Responsable:</strong> ${supplier.responsiblePerson}</p>
                <p><strong>Teléfono:</strong> ${supplier.phone}</p>
            `;
            
            if (supplier.email) {
                detailsHtml += `<p><strong>Email:</strong> ${supplier.email}</p>`;
            }
            
            if (supplier.nit) {
                detailsHtml += `<p><strong>NIT:</strong> ${supplier.nit}</p>`;
            }
            
            if (supplier.website) {
                detailsHtml += `<p><strong>Sitio Web:</strong> ${supplier.website}</p>`;
            }
            
            if (supplier.address) {
                detailsHtml += `<p><strong>Dirección:</strong> ${supplier.address}</p>`;
            }
            
            if (supplier.additionalInfo) {
                detailsHtml += `<p><strong>Información Adicional:</strong><br>${supplier.additionalInfo}</p>`;
            }
            
            let statusText = '';
            switch(supplier.status) {
                case 'activo': statusText = 'Activo'; break;
                case 'inactivo': statusText = 'Inactivo'; break;
                case 'pendiente': statusText = 'Pendiente'; break;
            }
            
            detailsHtml += `<p><strong>Estado:</strong> ${statusText}</p>`;
            
            if (supplier.internalNotes) {
                detailsHtml += `<p><strong>Notas Internas:</strong><br>${supplier.internalNotes}</p>`;
            }
            
            alert(detailsHtml);
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidNIT(nit) {
        // Validación simple: solo números
        const nitRegex = /^[0-9]+$/;
        return nitRegex.test(nit);
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