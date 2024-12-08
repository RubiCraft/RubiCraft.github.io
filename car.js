// Clase para manejar el carrito de compras
class Cart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.loadFromLocalStorage();
        this.attachEventListeners();
        this.updateCartDisplay();
    }

    

    // Agregar un artículo al carrito

    attachEventListeners() {
        // Evento para agregar al carrito
        document.querySelectorAll('.add-to-cart, .cta_tarjeta-rest a').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const item = {
                    id: button.getAttribute('data-id'),
                    name: button.getAttribute('data-name'),
                    price: parseFloat(button.getAttribute('data-price'))
                };
                this.addItem(item);
            });
        });
    
        // Resto del código sigue igual...
    }
    addItem(item) {
        // Verifica si el artículo ya está en el carrito
        const existingItem = this.items.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...item,
                quantity: 1
            });
        }

        this.calculateTotal();
        this.saveToLocalStorage();
        this.updateCartDisplay();
    }

    // Eliminar un artículo del carrito
    removeItem(id) {
        // Encuentra el índice del primer elemento con el ID correspondiente
        const index = this.items.findIndex(item => item.id === id);
        
        if (index !== -1) {
            // Si la cantidad es mayor que 1, solo reduce la cantidad
            if (this.items[index].quantity > 1) {
                this.items[index].quantity -= 1;
            } else {
                // Si la cantidad es 1, elimina completamente el elemento
                this.items.splice(index, 1);
            }
            
            this.calculateTotal();
            this.saveToLocalStorage();
            this.updateCartDisplay();
        }
    }

    // Calcular el total del carrito
    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Guardar el carrito en localStorage
    saveToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
        localStorage.setItem('cartTotal', this.total);
    }

    // Cargar el carrito desde localStorage
    //loadFromLocalStorage() {
        //const savedItems = localStorage.getItem('cartItems');
        //const savedTotal = localStorage.getItem('cartTotal');
        
        //if (savedItems) {
         //   this.items = JSON.parse(savedItems);
         //   this.total = parseFloat(savedTotal) || 0;
        //}
    //}//
    loadFromLocalStorage() {
        // Limpiar el localStorage al cargar la página
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartTotal');
        
        // Reiniciar items y total
        this.items = [];
        this.total = 0;
    }

    // Actualizar la visualización del carrito
    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        
        // Limpiar contenido anterior
        cartItemsContainer.innerHTML = '';
        
        // Agregar cada artículo al carrito
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                ${item.name} - $${item.price} x ${item.quantity} 
                <button class="remove-item" data-id="${item.id}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    
        // Mostrar total
        cartTotalElement.textContent = `Total: $${this.total.toFixed(2)}`;
    }

    // Adjuntar event listeners
    attachEventListeners() {
        // Evento para agregar al carrito
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const item = {
                    id: button.getAttribute('data-id'),
                    name: button.getAttribute('data-name'),
                    price: parseFloat(button.getAttribute('data-price'))
                };
                this.addItem(item);
            });
        });

        // Evento para eliminar del carrito (delegación de eventos)
        document.getElementById('cart-items').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                const id = e.target.getAttribute('data-id');
                this.removeItem(id);
            }
        });
    }

    // Generar ticket de compra
    generarTicket() {
// Validar si hay items en el carrito
if (this.items.length === 0) {
    // Mostrar mensaje de error si no hay productos
    alert("Error: No se ha agregado ningún producto al carrito.");
    return; // Detener la generación del ticket
}

        // Calcular subtotal
    const subtotal = this.total;
    
    // Calcular IVA (16%)
    const iva = subtotal * 0.16;
    
    // Calcular total con IVA
    const totalConIva = subtotal + iva;  let ticket = "Restaurante Think & Eat\n";
    ticket += "--- TICKET DE COMPRA ---\n";
    ticket += "------------------------\n";
    
    // Detalles de los items
    this.items.forEach(item => {
        ticket += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    ticket += `------------------------\n`;
    ticket += `Subtotal: $${subtotal.toFixed(2)}\n`;
    ticket += `IVA (16%): $${iva.toFixed(2)}\n`;
    ticket += `TOTAL: $${totalConIva.toFixed(2)}\n`;
    ticket += "¡Gracias!";
    
    // Podrías mostrar esto en un modal o imprimirlo
    alert(ticket);

    }
}

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const cart = new Cart();

    // Añadir botón de generar ticket
    const generarTicketBtn = document.getElementById('generar-ticket');
    if (generarTicketBtn) {
        generarTicketBtn.addEventListener('click', () => {
            cart.generarTicket();
        });
    }
});