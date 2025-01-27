// Import LitElement and html from the lit library
import {LitElement, html} from 'lit';

// Import the products data
import { products } from '../../data/products';

// Define the ProductElement class that extends LitElement
export class ProductElement extends LitElement {
  // Define static properties for the class
  static properties = {
    products: {type: Array},
    selectedProduct: {type: Object},
    quantity: {type: Number},
  };

  // Constructor for the class
  constructor() {
    super();
    this.products = products;
    this.selectedProduct = null;
    this.quantity = 1;
  }

  // Method to handle product selection change
  handleProductChange(event) {
    const selectedCode = event.target.value;
    this.selectedProduct = this.products.find(product => product.code === selectedCode) || null;
  }

  // Method to handle quantity change
  handlequantityChange(event) {
    this.quantity = parseFloat(event.target.value) || 1;
  }

  // Method to add a product to the cart
  addProduct() {
    if (this.selectedProduct && this.quantity > 0) {
      const { code, name, costPerUnit } = this.selectedProduct;
      const subtotal = costPerUnit * this.quantity;

      // Dispatch a custom event with the added product details
      this.dispatchEvent(new CustomEvent('product-agregado', {
        detail: { code, name, costPerUnit, quantity: this.quantity, subtotal },
        bubbles: true,
        composed: true,
      }));

      // Optional: Clear the quantity after adding
      this.quantity = 1;
      this.requestUpdate();
    } else {
      alert('Por favor, seleccione un product y una cantidad válida.');
    }
  }

  // Render method for the component
  render() {
    return html /*html*/`
      <style>
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
      </style>
      <div class="container mt-4">
        <div class="card">
          <div class="card-body">
            <form>
              <!-- Select de products -->
              <div class="mb-3">
                <label for="name" class="form-label">Nombre Producto</label>
                <select class="form-select" id="name" @change="${this.handleProductChange}">
                  <option value="" selected disabled>Seleccione un product</option>
                  ${this.products.map(product => html`
                    <option value="${product.code}">${product.name}</option>
                  `)}
                </select>
              </div>

              <!-- Código del product -->
              <div class="mb-3">
                <label for="productCode" class="form-label">Código Product</label>
                <input type="text" id="productCode" class="form-control" .value="${this.selectedProduct?.code || ''}"
                  placeholder="Código del product" readonly />
              </div>

              <!-- Valor por unidad y quantity -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="costPerUnit" class="form-label">Valor Unidad</label>
                  <input type="text" id="costPerUnit" class="form-control"
                    .value="${this.selectedProduct ? `$${this.selectedProduct.costPerUnit}` : ''}" placeholder="Valor por unidad"
                    readonly />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="quantity" class="form-label">quantity</label>
                  <input type="number" id="quantity" class="form-control" .value="${this.quantity}" placeholder="Cantidad"
                    min="1" @input="${this.handlequantityChange}" />
                </div>
              </div>

              <!-- Botón para agregar -->
              <button type="button" id="btnAgregar" class="btn btn-success col-12 btn-lg" @click="${this.addProduct}">
                +
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}

// Define the custom element 'product-element'
customElements.define('product-element', ProductElement);