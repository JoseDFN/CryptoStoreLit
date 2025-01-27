// Import LitElement, html, and css from lit
import { LitElement, html, css } from 'lit';

// Define the SummaryElement class that extends LitElement
export class SummaryElement extends LitElement {
  // Define static properties for the class
  static properties = {
    products: { type: Array },
    total: { type: Number },
  };

  // Constructor for the class
  constructor() {
    super();
    this.products = [];
    this.total = 0;
  }

  // Method to handle the connectedCallback lifecycle event
  connectedCallback() {
    super.connectedCallback();

    // Listen for the 'product-agregado' event
    document.addEventListener('product-agregado', (event) => {
      const { code, name, costPerUnit, quantity, subtotal } = event.detail;
      const existingProduct = this.products.find((p) => p.codigo === code);

      if (existingProduct) {
        // Update the quantity and subtotal if the product already exists
        existingProduct.cantidad += quantity;
        existingProduct.subtotal = existingProduct.cantidad * existingProduct.vUnidad;
      } else {
        // Add a new product if it doesn't exist
        this.products = [
          ...this.products,
          { codigo: code, nombre: name, vUnidad: costPerUnit, cantidad: quantity, subtotal },
        ];
      }

      this.updateTotal();
    });
  }

  // Method to update the total and dispatch the 'resumen-actualizado' event
  updateTotal() {
    // Calculate the subtotal
    const subtotal = this.products.reduce((sum, product) => sum + product.subtotal, 0);

    // Calculate the IVA
    const iva = subtotal * 0.19; // Assuming an IVA of 19%

    // Calculate the total
    const total = subtotal + iva;

    // Update the total and dispatch the event
    this.total = total;

    this.dispatchEvent(
      new CustomEvent('resumen-actualizado', {
        detail: { subtotal, iva, total },
        bubbles: true,
        composed: true,
      })
    );
  }

  // Method to remove a product from the list and update the total
  removeProduct(codigo) {
    this.products = this.products.filter((product) => product.codigo !== codigo);
    this.updateTotal();
  }

  // Render method for the component
  render() {
    return html`
      <style>
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
      </style>
      <div class="container mt-4">
        <h4 class="mb-3">Productos Agregados</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>V/Unidad</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${this.products.map(
              (product) => html`
                <tr id="producto-${product.codigo}">
                  <td>${product.codigo}</td>
                  <td>${product.nombre}</td>
                  <td>${product.vUnidad.toFixed(2)}</td>
                  <td class="cantidad">${product.cantidad}</td>
                  <td class="subtotal">${product.subtotal.toFixed(2)}</td>
                  <td>
                    <button type="button" class="btn btn-danger btn-sm" @click=${() => this.removeProduct(product.codigo)}>
                      X
                    </button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}

// Define the custom element 'summary-element'
customElements.define('summary-element', SummaryElement);