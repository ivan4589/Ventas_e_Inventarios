// dashboard-script.js
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar gráfico de ventas semanales
    initializeSalesChart();
    
    // Inicializar eventos de interacción
    initializeEventListeners();
    
    // Simular datos en tiempo real
    initializeRealTimeUpdates();
    
    // Inicializar menú responsive
    initializeResponsiveMenu();
});

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // Datos de ejemplo para ventas semanales
    const salesData = {
        labels: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'],
        datasets: [{
            label: 'Ventas (Bs.)',
            data: [950, 1250, 1100, 1400, 1800, 2200, 1250],
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            borderColor: '#3498db',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3498db',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8
        }]
    };
    
    // Opciones del gráfico
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                },
                callbacks: {
                    label: function(context) {
                        return `Bs. ${context.parsed.y.toLocaleString('es-BO')}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#7f8c8d',
                    font: {
                        size: 13,
                        weight: '600'
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: '#7f8c8d',
                    font: {
                        size: 13
                    },
                    callback: function(value) {
                        return 'Bs. ' + value.toLocaleString('es-BO');
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };
    
    // Crear el gráfico
    const salesChart = new Chart(ctx, {
        type: 'line',
        data: salesData,
        options: options
    });
    
    // Guardar referencia al gráfico para actualizaciones futuras
    window.salesChart = salesChart;
}

function initializeEventListeners() {
    // Botón "Ver todo" en la tabla de ventas
    const viewAllBtn = document.querySelector('.view-all-btn');
    viewAllBtn.addEventListener('click', function() {
        showNotification('Mostrando todas las ventas... Esta funcionalidad se implementaría en una versión completa del sistema.', 'info');
    });
    
    // Botones de acción en las alertas de inventario
    const alertActions = document.querySelectorAll('.alert-action');
    alertActions.forEach(button => {
        button.addEventListener('click', function() {
            const alertCard = this.closest('.alert-card');
            const productName = alertCard.querySelector('h4').textContent;
            
            if (this.textContent === 'Reabastecer') {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ordenando...';
                this.disabled = true;
                
                // Simular orden de reabastecimiento
                setTimeout(() => {
                    showNotification(`Orden de reabastecimiento para "${productName}" ha sido enviada.`, 'success');
                    this.innerHTML = 'Ordenada';
                    this.style.backgroundColor = '#27ae60';
                    
                    // Actualizar la tarjeta de alerta
                    alertCard.classList.remove('critical');
                    alertCard.classList.add('info');
                    alertCard.style.borderLeftColor = '#3498db';
                }, 1500);
            } else if (this.textContent === 'Revisar') {
                showNotification(`Producto "${productName}" marcado para revisión.`, 'info');
                this.innerHTML = 'Revisando...';
                this.style.backgroundColor = '#f39c12';
            }
        });
    });
    
    // Selector de fecha en el header
    const dateSelector = document.querySelector('.date-selector');
    dateSelector.addEventListener('click', function() {
        showNotification('Selector de fecha abierto. Esta funcionalidad se implementaría completamente en una versión avanzada.', 'info');
    });
    
    // Menú de usuario
    const userMenu = document.querySelector('.user-menu');
    userMenu.addEventListener('click', function() {
        showNotification('Menú de usuario abierto. Esta funcionalidad se implementaría completamente en una versión avanzada.', 'info');
    });
    
    // Campana de notificaciones
    const notificationBell = document.querySelector('.notification-bell');
    notificationBell.addEventListener('click', function() {
        showNotification('Mostrando notificaciones. Esta funcionalidad se implementaría completamente en una versión avanzada.', 'info');
    });
    
    // Botón de cerrar sesión
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        if (confirm('¿Está seguro que desea cerrar sesión?')) {
            showNotification('Cerrando sesión... Redirigiendo a la página de inicio.', 'info');
            // En una implementación real, aquí se redirigiría al login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });
    
    // Navegación del menú lateral
    const menuItems = document.querySelectorAll('.menu-item a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Evitar navegación real (en demo)
            e.preventDefault();
            
            // Remover clase active de todos los elementos
            menuItems.forEach(i => i.parentElement.classList.remove('active'));
            
            // Agregar clase active al elemento clickeado
            this.parentElement.classList.add('active');
            
            // Mostrar notificación de navegación
            const menuText = this.querySelector('span').textContent;
            if (menuText !== 'Dashboard') {
                showNotification(`Navegando a: ${menuText}. Esta funcionalidad se implementaría completamente en una versión avanzada.`, 'info');
            }
        });
    });
}

function initializeResponsiveMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        
        // Cambiar ícono
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

function initializeRealTimeUpdates() {
    // Simular actualizaciones en tiempo real de las métricas
    setInterval(() => {
        // Actualizar transacciones (simulación)
        const transactionsValue = document.querySelector('.metric-card.secondary .metric-value');
        const currentTransactions = parseInt(transactionsValue.textContent);
        const randomIncrement = Math.floor(Math.random() * 3); // 0, 1 o 2
        const newTransactions = currentTransactions + randomIncrement;
        transactionsValue.textContent = newTransactions;
        
        // Actualizar porcentaje de transacciones
        const transactionChange = document.querySelector('.metric-card.secondary .metric-change');
        const increasePercentage = ((randomIncrement / currentTransactions) * 100).toFixed(1);
        if (randomIncrement > 0) {
            transactionChange.innerHTML = `<i class="fas fa-arrow-up"></i> +${increasePercentage}% hoy`;
        }
        
        // Simular nueva venta ocasionalmente
        if (Math.random() < 0.3) { // 30% de probabilidad
            simulateNewSale();
        }
        
        // Actualizar notificaciones aleatoriamente
        if (Math.random() < 0.2) { // 20% de probabilidad
            updateNotificationCount();
        }
    }, 10000); // Actualizar cada 10 segundos
    
    // Actualizar hora de última actualización en el footer
    updateLastUpdateTime();
    setInterval(updateLastUpdateTime, 60000); // Actualizar cada minuto
}

function simulateNewSale() {
    // Actualizar ventas del día
    const dailySalesValue = document.querySelector('.metric-card.primary .metric-value');
    const currentSalesText = dailySalesValue.textContent;
    const currentSales = parseFloat(currentSalesText.replace('Bs. ', '').replace(',', ''));
    const randomSale = Math.floor(Math.random() * 200) + 50; // Venta entre 50 y 250 Bs.
    const newSales = currentSales + randomSale;
    
    // Formatear con separadores de miles
    dailySalesValue.textContent = `Bs. ${newSales.toLocaleString('es-BO', {minimumFractionDigits: 2})}`;
    
    // Actualizar porcentaje vs ayer (simulado)
    const salesChange = document.querySelector('.metric-card.primary .metric-change');
    const randomIncrease = (Math.random() * 10 + 1).toFixed(1); // Entre 1% y 11%
    salesChange.innerHTML = `<i class="fas fa-arrow-up"></i> +${randomIncrease}% vs. ayer`;
    
    // Agregar nueva fila a la tabla de ventas
    addNewSaleToTable(randomSale);
    
    // Actualizar gráfico
    updateSalesChart(randomSale);
}

function addNewSaleToTable(saleAmount) {
    const tableBody = document.querySelector('.sales-table tbody');
    
    // IDs de venta simulados
    const saleIds = ['RV-8241', 'RV-8242', 'RV-8243', 'RV-8244'];
    const clients = ['Luis Fernandez', 'Pedro Castillo', 'Sofia Rios', 'Miguel Torres'];
    const times = ['Hace 2 min', 'Hace 5 min', 'Hace 8 min', 'Hace 10 min'];
    
    const randomId = saleIds[Math.floor(Math.random() * saleIds.length)];
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    
    // Crear nueva fila
    const newRow = document.createElement('tr');
    
    // Determinar si la venta está completada o pendiente
    const isCompleted = Math.random() > 0.3; // 70% completada
    const statusClass = isCompleted ? 'completed' : 'pending';
    const statusText = isCompleted ? 'COM' : 'FIN';
    
    newRow.innerHTML = `
        <td class="sale-id">${randomId}</td>
        <td class="client">${randomClient}</td>
        <td class="date">${randomTime}</td>
        <td class="amount">${saleAmount.toLocaleString('es-BO', {minimumFractionDigits: 2})}</td>
        <td class="status ${statusClass}">${statusText}</td>
    `;
    
    // Agregar animación a la nueva fila
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateY(-10px)';
    
    // Insertar al principio de la tabla
    tableBody.insertBefore(newRow, tableBody.firstChild);
    
    // Animar la entrada
    setTimeout(() => {
        newRow.style.transition = 'opacity 0.5s, transform 0.5s';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
    }, 10);
    
    // Limitar a 8 filas máximo
    if (tableBody.children.length > 8) {
        tableBody.removeChild(tableBody.lastChild);
    }
}

function updateSalesChart(newSaleAmount) {
    // Simular actualización del gráfico
    if (window.salesChart) {
        const lastIndex = window.salesChart.data.datasets[0].data.length - 1;
        const currentValue = window.salesChart.data.datasets[0].data[lastIndex];
        window.salesChart.data.datasets[0].data[lastIndex] = currentValue + newSaleAmount / 100;
        window.salesChart.update('none'); // 'none' para actualización sin animación
    }
}

function updateNotificationCount() {
    const notificationCount = document.querySelector('.notification-count');
    let currentCount = parseInt(notificationCount.textContent);
    
    // Aleatoriamente aumentar o mantener
    if (Math.random() < 0.6) { // 60% de probabilidad de nueva notificación
        currentCount += 1;
        notificationCount.textContent = currentCount;
        
        // Animación de la campana
        const notificationBell = document.querySelector('.notification-bell i');
        notificationBell.style.transform = 'scale(1.2)';
        setTimeout(() => {
            notificationBell.style.transform = 'scale(1)';
        }, 300);
    }
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-BO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
    
    const footerUpdate = document.querySelector('.footer-update');
    footerUpdate.textContent = `Última actualización: Hoy, ${timeString}`;
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
        z-index: 10000;
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