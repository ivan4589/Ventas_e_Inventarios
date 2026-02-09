// productos-script.js
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let productsData = [];
    let editingProductId = null;
    let productImageFile = null;
    let categories = [
        { id: 1, name: 'alimentos', displayName: 'Alimentos', status: 'activo' },
        { id: 2, name: 'bebidas', displayName: 'Bebidas', status: 'activo' },
        { id: 3, name: 'limpieza', displayName: 'Limpieza', status: 'activo' },
        { id: 4, name: 'medicamentos', displayName: 'Medicamentos', status: 'activo' },
        { id: 5, name: 'electronica', displayName: 'Electrónica', status: 'activo' },
        { id: 6, name: 'ropa', displayName: 'Ropa', status: 'activo' },
        { id: 7, name: 'hogar', displayName: 'Hogar', status: 'activo' },
        { id: 8, name: 'oficina', displayName: 'Oficina', status: 'activo' }
    ];
    
    // Simular datos de proveedores (normalmente vendrían de una API)
    let suppliersData = [
        { id: 1, companyName: "Suministros Médicos S.R.L.", companyId: "N°11 00185/175" },
        { id: 2, companyName: "Alimentos Bolivia S.A.", companyId: "N°7 881279/31" },
        { id: 3, companyName: "TecniPlast Distribuidora", companyId: "N°1 15452/281" },
        { id: 4, companyName: "Distribuidora La Paz", companyId: "N°5 44567/123" },
        { id: 5, companyName: "Importadora Santa Cruz", companyId: "N°8 99876/543" }
    ];
    
    // Elementos del DOM
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const categoryModal = document.getElementById('categoryModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    const productForm = document.getElementById('productForm');
    const categoryForm = document.getElementById('categoryForm');
    const productsTableBody = document.getElementById('productsTableBody');
    const searchProductInput = document.getElementById('searchProduct');
    const categoryFilter = document.getElementById('categoryFilter');
    const stockFilter = document.getElementById('stockFilter');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const productSupplierSelect = document.getElementById('productSupplier');
    const productCategorySelect = document.getElementById('productCategory');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const removeImageBtn = document.getElementById('removeImageBtn');
    const productImageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    
    // Datos iniciales de productos
    const initialProducts = [
        {
            id: 1,
            name: "Arroz Integral 1kg",
            code: "PROD-001",
            supplierId: 2,
            category: "alimentos",
            purchasePrice: 8.50,
            salePriceNormal: 12.00,
            salePriceRetail: 11.50,
            salePriceWholesale: 10.00,
            salePriceSpecial: 10.50,
            salePriceOccasional: 11.00,
            wholesaleQuantity: 10,
            currentStock: 45,
            minimumStock: 10,
            reservedQuantity: 5,
            unitMeasure: "kg",
            description: "Arroz integral de alta calidad, empaque de 1kg",
            additionalInfo: "Producto orgánico, sin conservantes",
            status: "activo",
            image: null
        },
        {
            id: 2,
            name: "Aceite Vegetal 1L",
            code: "PROD-002",
            supplierId: 2,
            category: "alimentos",
            purchasePrice: 15.00,
            salePriceNormal: 22.00,
            salePriceRetail: 21.00,
            salePriceWholesale: 18.50,
            salePriceSpecial: 19.50,
            salePriceOccasional: 20.00,
            wholesaleQuantity: 12,
            currentStock: 23,
            minimumStock: 15,
            reservedQuantity: 3,
            unitMeasure: "litro",
            description: "Aceite vegetal para cocina",
            additionalInfo: "Envasado al vacío",
            status: "activo",
            image: null
        },
        {
            id: 3,
            name: "Jabón Líquido 500ml",
            code: "PROD-003",
            supplierId: 3,
            category: "limpieza",
            purchasePrice: 6.80,
            salePriceNormal: 10.50,
            salePriceRetail: 10.00,
            salePriceWholesale: 8.50,
            salePriceSpecial: 9.00,
            salePriceOccasional: 9.50,
            wholesaleQuantity: 24,
            currentStock: 8,
            minimumStock: 20,
            reservedQuantity: 2,
            unitMeasure: "litro",
            description: "Jabón líquido para manos",
            additionalInfo: "Fragancia lavanda",
            status: "activo",
            image: null
        },
        {
            id: 4,
            name: "Paracetamol 500mg",
            code: "PROD-004",
            supplierId: 1,
            category: "medicamentos",
            purchasePrice: 0.80,
            salePriceNormal: 1.50,
            salePriceRetail: 1.40,
            salePriceWholesale: 1.10,
            salePriceSpecial: 1.20,
            salePriceOccasional: 1.30,
            wholesaleQuantity: 100,
            currentStock: 150,
            minimumStock: 50,
            reservedQuantity: 25,
            unitMeasure: "unidad",
            description: "Analgésico y antipirético",
            additionalInfo: "Caja con 10 tabletas",
            status: "activo",
            image: null
        }
    ];
    
    // Inicializar la aplicación
    init();
    
    function init() {
        // Cargar datos iniciales
        productsData = [...initialProducts];
        
        // Cargar proveedores en el select
        loadSuppliersSelect();
        
        // Cargar categorías en el select
        loadCategoriesSelect();
        
        // Cargar tabla de productos
        loadProductsTable();
        
        // Inicializar eventos
        initEventListeners();
        
        // Inicializar menú responsive
        initResponsiveMenu();
        
        // Configurar atajo de teclado
        initKeyboardShortcut();
        
        // Actualizar métricas
        updateMetrics();
    }
    
    function loadSuppliersSelect() {
        productSupplierSelect.innerHTML = '<option value="">Seleccione un proveedor</option>';
        
        suppliersData.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = `${supplier.companyName} (${supplier.companyId})`;
            productSupplierSelect.appendChild(option);
        });
    }
    
    function loadCategoriesSelect() {
        // Limpiar selects
        productCategorySelect.innerHTML = '<option value="">Seleccione una categoría</option>';
        categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
        
        // Filtrar categorías activas
        const activeCategories = categories.filter(cat => cat.status === 'activo');
        
        activeCategories.forEach(category => {
            // Para el formulario
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.displayName;
            productCategorySelect.appendChild(option);
            
            // Para el filtro
            const filterOption = document.createElement('option');
            filterOption.value = category.name;
            filterOption.textContent = category.displayName;
            categoryFilter.appendChild(filterOption);
        });
    }
    
    function initEventListeners() {
        // Botón para agregar producto
        addProductBtn.addEventListener('click', () => {
            openProductModal();
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
            if (e.target === productModal) closeAllModals();
            if (e.target === categoryModal) closeAllModals();
        });
        
        // Formulario de producto
        productForm.addEventListener('submit', handleProductSubmit);
        
        // Formulario de categoría
        categoryForm.addEventListener('submit', handleCategorySubmit);
        
        // Botón para agregar nueva categoría
        addCategoryBtn.addEventListener('click', () => {
            productModal.classList.remove('active');
            categoryModal.classList.add('active');
        });
        
        // Subida de imagen
        uploadImageBtn.addEventListener('click', () => {
            productImageInput.click();
        });
        
        productImageInput.addEventListener('change', handleImageUpload);
        
        removeImageBtn.addEventListener('click', removeImage);
        
        // Búsqueda de productos
        searchProductInput.addEventListener('input', filterProducts);
        
        // Filtros
        categoryFilter.addEventListener('change', filterProducts);
        stockFilter.addEventListener('change', filterProducts);
        
        // Actualizar precios automáticamente
        const purchasePriceInput = document.getElementById('purchasePrice');
        if (purchasePriceInput) {
            purchasePriceInput.addEventListener('input', calculateSuggestedPrices);
        }
        
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
                    if (menuText !== 'Productos') {
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
            // CTRL + P para abrir formulario de producto
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                openProductModal();
            }
            
            // ESC para cerrar modales
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });
    }
    
    function openProductModal(product = null) {
        editingProductId = product ? product.id : null;
        
        // Limpiar formulario
        productForm.reset();
        removeImage();
        
        // Actualizar título del modal
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = product ? 'Editar Producto' : 'Agregar Nuevo Producto';
        
        // Si se está editando, llenar con datos del producto
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCode').value = product.code || '';
            document.getElementById('productSupplier').value = product.supplierId;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('purchasePrice').value = product.purchasePrice;
            document.getElementById('salePriceNormal').value = product.salePriceNormal;
            document.getElementById('salePriceRetail').value = product.salePriceRetail || '';
            document.getElementById('salePriceWholesale').value = product.salePriceWholesale || '';
            document.getElementById('salePriceSpecial').value = product.salePriceSpecial || '';
            document.getElementById('salePriceOccasional').value = product.salePriceOccasional || '';
            document.getElementById('wholesaleQuantity').value = product.wholesaleQuantity || '';
            document.getElementById('currentStock').value = product.currentStock;
            document.getElementById('minimumStock').value = product.minimumStock || '';
            document.getElementById('reservedQuantity').value = product.reservedQuantity || '';
            document.getElementById('unitMeasure').value = product.unitMeasure || 'unidad';
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('additionalInfo').value = product.additionalInfo || '';
            document.getElementById('productStatus').value = product.status || 'activo';
            
            // Si hay imagen, mostrarla
            if (product.image) {
                displayImagePreview(product.image);
            }
        } else {
            // Valores por defecto para nuevo producto
            document.getElementById('productStatus').value = 'activo';
            document.getElementById('unitMeasure').value = 'unidad';
            
            // Calcular precios sugeridos
            calculateSuggestedPrices();
        }
        
        // Mostrar modal
        productModal.classList.add('active');
    }
    
    function closeAllModals() {
        productModal.classList.remove('active');
        categoryModal.classList.remove('active');
        editingProductId = null;
        productImageFile = null;
    }
    
    function calculateSuggestedPrices() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        
        if (purchasePrice > 0) {
            // Calcular precios sugeridos basados en el precio de compra
            const normalPrice = purchasePrice * 1.4; // 40% margen
            const retailPrice = purchasePrice * 1.35; // 35% margen
            const wholesalePrice = purchasePrice * 1.25; // 25% margen
            const specialPrice = purchasePrice * 1.3; // 30% margen
            const occasionalPrice = purchasePrice * 1.32; // 32% margen
            
            // Actualizar campos si están vacíos
            if (!document.getElementById('salePriceNormal').value) {
                document.getElementById('salePriceNormal').value = normalPrice.toFixed(2);
            }
            
            if (!document.getElementById('salePriceRetail').value) {
                document.getElementById('salePriceRetail').value = retailPrice.toFixed(2);
            }
            
            if (!document.getElementById('salePriceWholesale').value) {
                document.getElementById('salePriceWholesale').value = wholesalePrice.toFixed(2);
            }
            
            if (!document.getElementById('salePriceSpecial').value) {
                document.getElementById('salePriceSpecial').value = specialPrice.toFixed(2);
            }
            
            if (!document.getElementById('salePriceOccasional').value) {
                document.getElementById('salePriceOccasional').value = occasionalPrice.toFixed(2);
            }
        }
    }
    
    function handleProductSubmit(e) {
        e.preventDefault();
        
        // Validar formulario
        const productName = document.getElementById('productName').value.trim();
        const productSupplier = document.getElementById('productSupplier').value;
        const productCategory = document.getElementById('productCategory').value;
        const purchasePrice = document.getElementById('purchasePrice').value;
        const salePriceNormal = document.getElementById('salePriceNormal').value;
        const currentStock = document.getElementById('currentStock').value;
        
        if (!productName || !productSupplier || !productCategory || !purchasePrice || !salePriceNormal || !currentStock) {
            showNotification('Por favor complete todos los campos obligatorios (*).', 'error');
            return;
        }
        
        // Validar que los precios sean números válidos
        if (isNaN(parseFloat(purchasePrice)) || parseFloat(purchasePrice) < 0) {
            showNotification('El precio de compra debe ser un número válido.', 'error');
            return;
        }
        
        if (isNaN(parseFloat(salePriceNormal)) || parseFloat(salePriceNormal) < 0) {
            showNotification('El precio de venta normal debe ser un número válido.', 'error');
            return;
        }
        
        // Obtener datos del formulario
           const productData = {
        id: editingProductId || productsData.length + 1,
        name: productName,
        code: document.getElementById('productCode').value.trim(),
        supplierId: parseInt(productSupplier),
        category: productCategory,
        purchasePrice: parseFloat(purchasePrice),
        salePriceNormal: parseFloat(salePriceNormal),
        salePriceRetail: document.getElementById('salePriceRetail').value ? parseFloat(document.getElementById('salePriceRetail').value) : null,
        salePriceWholesale: document.getElementById('salePriceWholesale').value ? parseFloat(document.getElementById('salePriceWholesale').value) : null,
        salePriceSpecial: document.getElementById('salePriceSpecial').value ? parseFloat(document.getElementById('salePriceSpecial').value) : null,
        salePriceOccasional: document.getElementById('salePriceOccasional').value ? parseFloat(document.getElementById('salePriceOccasional').value) : null,
        wholesaleQuantity: document.getElementById('wholesaleQuantity').value ? parseInt(document.getElementById('wholesaleQuantity').value) : null,
        currentStock: parseInt(currentStock),
        minimumStock: document.getElementById('minimumStock').value ? parseInt(document.getElementById('minimumStock').value) : null,
        reservedQuantity: document.getElementById('reservedQuantity').value ? parseInt(document.getElementById('reservedQuantity').value) : null,
        unitMeasure: document.getElementById('unitMeasure').value,
        description: document.getElementById('productDescription').value.trim(),
        additionalInfo: document.getElementById('additionalInfo').value.trim(),
        status: document.getElementById('productStatus').value,
        image: productImageFile ? URL.createObjectURL(productImageFile) : null // Solo guardar URL temporal
    };
        
          // Guardar producto
    if (editingProductId) {
        // Actualizar producto existente
        const index = productsData.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            productsData[index] = productData;
        }
        showNotification('Producto actualizado correctamente.', 'success');
    } else {
        // Agregar nuevo producto
        productsData.push(productData);
        showNotification('Producto agregado correctamente.', 'success');
    }
    
    // Actualizar tabla
    loadProductsTable();
    
    // Cerrar modal
    closeAllModals();
    
    // Actualizar métricas
    updateMetrics();
}
    
    async function getImageData(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
    }
    
    function handleCategorySubmit(e) {
        e.preventDefault();
        
        const categoryName = document.getElementById('newCategoryName').value.trim();
        const categoryDescription = document.getElementById('newCategoryDescription').value.trim();
        const categoryStatus = document.getElementById('newCategoryStatus').value;
        
        if (!categoryName) {
            showNotification('Por favor ingrese el nombre de la categoría.', 'error');
            return;
        }
        
        // Crear ID para la nueva categoría
        const categoryId = categories.length + 1;
        const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        
        // Agregar nueva categoría
        const newCategory = {
            id: categoryId,
            name: categorySlug,
            displayName: categoryName,
            description: categoryDescription,
            status: categoryStatus
        };
        
        categories.push(newCategory);
        
        // Actualizar selects de categorías
        loadCategoriesSelect();
        
        // Seleccionar la nueva categoría en el formulario de producto
        productCategorySelect.value = categorySlug;
        
        // Cerrar modal de categoría y volver al formulario de producto
        categoryModal.classList.remove('active');
        productModal.classList.add('active');
        
        // Limpiar formulario de categoría
        categoryForm.reset();
        
        showNotification(`Categoría "${categoryName}" agregada correctamente.`, 'success');
    }
    
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.match('image.*')) {
                showNotification('Por favor seleccione un archivo de imagen válido.', 'error');
                return;
            }
            
            // Validar tamaño (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('La imagen no debe superar los 5MB.', 'error');
                return;
            }
            
            productImageFile = file;
            displayImagePreview(file);
        }
    }
    
    function displayImagePreview(fileOrData) {
        if (typeof fileOrData === 'string') {
            // Si es un string (data URL)
            imagePreview.innerHTML = `<img src="${fileOrData}" alt="Vista previa">`;
        } else {
            // Si es un archivo
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Vista previa">`;
            };
            reader.readAsDataURL(fileOrData);
        }
        
        imagePreview.classList.add('has-image');
    }
    
    function removeImage() {
        productImageFile = null;
        productImageInput.value = '';
        imagePreview.innerHTML = '<i class="fas fa-image"></i><span>Vista previa de la imagen</span>';
        imagePreview.classList.remove('has-image');
    }
    
    function loadProductsTable(filteredData = null) {
        const data = filteredData || productsData;
        productsTableBody.innerHTML = '';
        
        if (data.length === 0) {
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #7f8c8d;">
                        <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        No se encontraron productos. ¡Agrega tu primer producto!
                    </td>
                </tr>
            `;
            return;
        }
        
        data.forEach(product => {
            const row = document.createElement('tr');
            
            // Obtener información del proveedor
            const supplier = suppliersData.find(s => s.id === product.supplierId);
            const supplierName = supplier ? supplier.companyName : 'Desconocido';
            
            // Obtener información de la categoría
            const category = categories.find(c => c.name === product.category);
            const categoryName = category ? category.displayName : product.category;
            
            // Determinar estado del stock
            let stockStatus = 'normal';
            let stockStatusText = 'Normal';
            
            if (product.currentStock <= 0) {
                stockStatus = 'out';
                stockStatusText = 'Sin Stock';
            } else if (product.minimumStock && product.currentStock <= product.minimumStock) {
                stockStatus = 'critical';
                stockStatusText = 'Crítico';
            } else if (product.minimumStock && product.currentStock <= product.minimumStock * 1.5) {
                stockStatus = 'low';
                stockStatusText = 'Bajo';
            }
            
            // Determinar clase de estado
            let statusClass = '';
            let statusText = '';
            switch(product.status) {
                case 'activo':
                    statusClass = 'active';
                    statusText = 'Activo';
                    break;
                case 'inactivo':
                    statusClass = 'inactive';
                    statusText = 'Inactivo';
                    break;
                case 'descontinuado':
                    statusClass = 'discontinued';
                    statusText = 'Descontinuado';
                    break;
            }
            
            row.innerHTML = `
                <td>
                    <div class="product-info">
                        <div class="product-image">
                            ${product.image ? 
                                `<img src="${product.image}" alt="${product.name}">` : 
                                `<i class="fas fa-box"></i>`
                            }
                        </div>
                        <div class="product-details">
                            <h4>${product.name}</h4>
                            ${product.code ? `<div class="product-code">${product.code}</div>` : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="category">${categoryName}</span>
                </td>
                <td class="supplier">${supplierName}</td>
                <td class="prices">
                    <div class="price-item">
                        <span class="price-label">Compra:</span>
                        <span class="price-value">Bs. ${product.purchasePrice.toFixed(2)}</span>
                    </div>
                    <div class="price-item">
                        <span class="price-label">Venta:</span>
                        <span class="price-value highlight">Bs. ${product.salePriceNormal.toFixed(2)}</span>
                    </div>
                    ${product.salePriceWholesale ? `
                    <div class="price-item">
                        <span class="price-label">Mayorista:</span>
                        <span class="price-value">Bs. ${product.salePriceWholesale.toFixed(2)}</span>
                    </div>` : ''}
                </td>
                <td class="stock">
                    <div class="stock-value">${product.currentStock}</div>
                    <div class="stock-status ${stockStatus}">${stockStatusText}</div>
                </td>
                <td>
                    <span class="status ${statusClass}">${statusText}</span>
                </td>
                <td class="actions">
                    <button class="action-btn view-btn" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            productsTableBody.appendChild(row);
        });
        
        // Agregar eventos a los botones de acción
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = productsData.find(p => p.id === productId);
                if (product) {
                    openProductModal(product);
                }
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                viewProduct(productId);
            });
        });
    }
    
    function filterProducts() {
        const searchTerm = searchProductInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedStock = stockFilter.value;
        
        const filtered = productsData.filter(product => {
            // Filtrar por búsqueda
            const matchesSearch = searchTerm === '' || 
                product.name.toLowerCase().includes(searchTerm) ||
                (product.code && product.code.toLowerCase().includes(searchTerm)) ||
                (product.description && product.description.toLowerCase().includes(searchTerm));
            
            // Filtrar por categoría
            const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
            
            // Filtrar por estado de stock
            let matchesStock = true;
            if (selectedStock === 'bajo') {
                matchesStock = product.minimumStock && product.currentStock <= product.minimumStock * 1.5;
            } else if (selectedStock === 'sin') {
                matchesStock = product.currentStock <= 0;
            }
            
            return matchesSearch && matchesCategory && matchesStock;
        });
        
        loadProductsTable(filtered);
        
        // Actualizar resumen
        const tableSummary = document.querySelector('.table-summary');
        tableSummary.textContent = `Mostrando ${Math.min(filtered.length, 10)} de ${productsData.length} productos`;
        
        // Actualizar paginación
        const paginationInfo = document.querySelector('.pagination-info');
        paginationInfo.textContent = `Página 1 de ${Math.max(1, Math.ceil(filtered.length / 10))}`;
    }
    
    function deleteProduct(productId) {
        if (confirm('¿Está seguro que desea eliminar este producto?')) {
            productsData = productsData.filter(product => product.id !== productId);
            loadProductsTable();
            updateMetrics();
            showNotification('Producto eliminado correctamente.', 'success');
        }
    }
    
    function viewProduct(productId) {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            // Obtener información del proveedor
            const supplier = suppliersData.find(s => s.id === product.supplierId);
            const supplierName = supplier ? supplier.companyName : 'Desconocido';
            
            // Obtener información de la categoría
            const category = categories.find(c => c.name === product.category);
            const categoryName = category ? category.displayName : product.category;
            
            let detailsHtml = `
                <h3>${product.name}</h3>
                ${product.code ? `<p><strong>Código:</strong> ${product.code}</p>` : ''}
                <p><strong>Categoría:</strong> ${categoryName}</p>
                <p><strong>Proveedor:</strong> ${supplierName}</p>
                <p><strong>Precio de Compra:</strong> Bs. ${product.purchasePrice.toFixed(2)}</p>
                <p><strong>Precio de Venta Normal:</strong> Bs. ${product.salePriceNormal.toFixed(2)}</p>
            `;
            
            if (product.salePriceRetail) {
                detailsHtml += `<p><strong>Precio Minorista:</strong> Bs. ${product.salePriceRetail.toFixed(2)}</p>`;
            }
            
            if (product.salePriceWholesale) {
                detailsHtml += `<p><strong>Precio Mayorista:</strong> Bs. ${product.salePriceWholesale.toFixed(2)}</p>`;
            }
            
            if (product.salePriceSpecial) {
                detailsHtml += `<p><strong>Precio Especial:</strong> Bs. ${product.salePriceSpecial.toFixed(2)}</p>`;
            }
            
            if (product.salePriceOccasional) {
                detailsHtml += `<p><strong>Precio Ocasional:</strong> Bs. ${product.salePriceOccasional.toFixed(2)}</p>`;
            }
            
            if (product.wholesaleQuantity) {
                detailsHtml += `<p><strong>Cantidad para Mayorista:</strong> ${product.wholesaleQuantity}</p>`;
            }
            
            detailsHtml += `
                <p><strong>Stock Actual:</strong> ${product.currentStock}</p>
            `;
            
            if (product.minimumStock) {
                detailsHtml += `<p><strong>Stock Mínimo:</strong> ${product.minimumStock}</p>`;
            }
            
            if (product.reservedQuantity) {
                detailsHtml += `<p><strong>Cantidad Reservada:</strong> ${product.reservedQuantity}</p>`;
            }
            
            detailsHtml += `<p><strong>Unidad de Medida:</strong> ${product.unitMeasure || 'Unidad'}</p>`;
            
            if (product.description) {
                detailsHtml += `<p><strong>Descripción:</strong><br>${product.description}</p>`;
            }
            
            if (product.additionalInfo) {
                detailsHtml += `<p><strong>Información Adicional:</strong><br>${product.additionalInfo}</p>`;
            }
            
            let statusText = '';
            switch(product.status) {
                case 'activo': statusText = 'Activo'; break;
                case 'inactivo': statusText = 'Inactivo'; break;
                case 'descontinuado': statusText = 'Descontinuado'; break;
            }
            
            detailsHtml += `<p><strong>Estado:</strong> ${statusText}</p>`;
            
            alert(detailsHtml);
        }
    }
    
    function updateMetrics() {
        // Calcular métricas
        const totalProducts = productsData.length;
        
        let totalInventoryValue = 0;
        let lowStockCount = 0;
        let criticalStockCount = 0;
        
        productsData.forEach(product => {
            // Valor del inventario
            totalInventoryValue += product.purchasePrice * product.currentStock;
            
            // Productos con stock bajo
            if (product.minimumStock && product.currentStock <= product.minimumStock) {
                criticalStockCount++;
            } else if (product.minimumStock && product.currentStock <= product.minimumStock * 1.5) {
                lowStockCount++;
            }
        });
        
        // Categorías únicas
        const uniqueCategories = [...new Set(productsData.map(product => product.category))];
        
        // Actualizar métricas en la UI
        document.querySelector('.metric-card.primary .metric-value').textContent = totalProducts;
        document.querySelector('.metric-card.secondary .metric-value').textContent = `Bs. ${totalInventoryValue.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
        document.querySelector('.metric-card.warning .metric-value').textContent = lowStockCount + criticalStockCount;
        document.querySelector('.metric-card.warning .metric-alert').innerHTML = `${criticalStockCount} Críticos`;
        document.querySelector('.metric-card.info .metric-value').textContent = uniqueCategories.length;
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