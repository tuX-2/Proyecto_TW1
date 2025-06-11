// Datos de productos
        const productos = [
            {
                id: 1,
                nombre: "Comida del día",
                precio: 85,
                descripcion: "Platillo del día que incluye bebida y postre. Una opción completa y nutritiva.",
                categoria: "menu",
                agotado: false
            },
            {
                id: 2,
                nombre: "Huevos Rancheros",
                precio: 75,
                descripcion: "Huevos estrellados con salsa ranchera, acompañados de tortillas y frijoles.",
                categoria: "platillo",
                agotado: false
            },
            {
                id: 3,
                nombre: "Torta de Jamón",
                precio: 45,
                descripcion: "Torta clásica de jamón con queso, lechuga, tomate y aguacate.",
                categoria: "platillo",
                agotado: true
            },
            {
                id: 4,
                nombre: "Café Americano",
                precio: 25,
                descripcion: "Café negro de grano selecto, servido caliente.",
                categoria: "bebida",
                agotado: false
            },
            {
                id: 5,
                nombre: "Cappuccino",
                precio: 35,
                descripcion: "Café espresso con leche espumada y canela.",
                categoria: "bebida",
                agotado: false
            },
            {
                id: 6,
                nombre: "Enchiladas Verdes",
                precio: 65,
                descripcion: "Enchiladas bañadas en salsa verde con queso fresco y crema.",
                categoria: "platillo",
                agotado: false
            }
        ];

        // Referencias a elementos DOM
        const productsGrid = document.getElementById('products-grid');
        const inputBuscar = document.getElementById('buscar-producto-admin');
        const categoriesNav = document.getElementById('categories-nav');
        const currentTimeElement = document.getElementById('current-time');

        // Variables de filtrado
        let filtroActual = '';
        let busquedaActual = '';

        // Event listeners
        inputBuscar.addEventListener('input', (e) => {
            busquedaActual = e.target.value.toLowerCase();
            renderizarProductos();
        });

        // Event delegation para categorías
        categoriesNav.addEventListener('click', (e) => {
            const chip = e.target.closest('.category-chip');
            if (chip) {
                // Remover clase active de todos los chips
                document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
                // Agregar clase active al chip clickeado
                chip.classList.add('active');
                // Actualizar filtro
                filtroActual = chip.dataset.category;
                renderizarProductos();
            }
        });

        // Función para obtener el nombre de la categoría
        function obtenerNombreCategoria(categoria) {
            const nombres = {
                'menu': 'Menú del día',
                'platillo': 'Platillo',
                'bebida': 'Bebida'
            };
            return nombres[categoria] || categoria;
        }

        // Función para renderizar productos
        function renderizarProductos() {
            const productosFiltrados = productos.filter(producto => {
                const coincideTexto = producto.nombre.toLowerCase().includes(busquedaActual) ||
                    producto.descripcion.toLowerCase().includes(busquedaActual);
                const coincideCategoria = !filtroActual || producto.categoria === filtroActual;
                return coincideTexto && coincideCategoria;
            });

            productsGrid.innerHTML = productosFiltrados.map(producto => `
                <div class="product-card">
                    <div class="product-header">
                        <div>
                            <div class="product-name">${producto.nombre}</div>
                            <div class="product-category">${obtenerNombreCategoria(producto.categoria)}</div>
                        </div>
                        <div class="product-price">$${producto.precio}</div>
                    </div>
                    
                    <div class="product-description">${producto.descripcion}</div>
                    
                    <div class="product-status ${producto.agotado ? 'status-sold-out' : 'status-available'}">
                        ${producto.agotado ? '❌ Agotado' : '✅ Disponible'}
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn btn-success" onclick="editarProducto(${producto.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `).join('');

            // Mostrar mensaje si no hay productos
            if (productosFiltrados.length === 0) {
                productsGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #718096;">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                        <h3>No se encontraron productos</h3>
                        <p>Intenta con otros términos de búsqueda o cambia la categoría.</p>
                    </div>
                `;
            }
        }

        // Funciones para manejar productos
        function editarProducto(id) {
            const producto = productos.find(p => p.id === id);
            if (producto) {
                alert(`Editar producto: ${producto.nombre}\n\nEsta funcionalidad se implementará próximamente.`);
            }
        }

        function eliminarProducto(id) {
            const producto = productos.find(p => p.id === id);
            if (producto && confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)) {
                const index = productos.findIndex(p => p.id === id);
                productos.splice(index, 1);
                renderizarProductos();
            }
        }

        // Función para agregar producto
        document.getElementById('btn-agregar-producto').addEventListener('click', () => {
            alert('Funcionalidad de agregar producto se implementará próximamente.');
        });

        // Función para actualizar la hora
        function actualizarHora() {
            const ahora = new Date();
            const hora = ahora.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit'
            });
            currentTimeElement.textContent = `${hora}`;
        }

        // Inicialización
        actualizarHora();
        setInterval(actualizarHora, 60000);
        renderizarProductos();