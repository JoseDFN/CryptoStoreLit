import {LitElement, html} from 'lit';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { products } from '../../data/products';
export class ProductElement extends LitElement {
    static properties={
        products:{type:Array},
        selectedProduct:{type:Object},
        quantity:{type:Number},
    };

    constructor(){
        super();
        this.products = products;
        this.selectedProduct = null;
        this.quantity = 1;
    }

    handleProductChange(event) {
        const selectedCode = event.target.value;
        this.selectedProduct = this.products.find(product => product.code === selectedCode) || null;
      }
    
      handlequantityChange(event) {
        this.quantity = parseFloat(event.target.value) || 1;
      }
    
      addProduct() {
        if (this.selectedProduct && this.quantity > 0) {
          const { code, name, costPerUnit } = this.selectedProduct;
          const subtotal = costPerUnit * this.quantity;
    
          // Emitir un evento personalizado con los datos del product agregado
          this.dispatchEvent(new CustomEvent('product-agregado', {
            detail: { code, name, costPerUnit, quantity: this.quantity, subtotal },
            bubbles: true,
            composed: true,
          }));
    
          // Opcional: Limpiar la quantity después de agregar
          this.quantity = 1;
          this.requestUpdate();
        } else {
          alert('Por favor, seleccione un product y una quantity válida.');
        }
      }    

    render(){
        return html /*html*/`
    <style>
      @import url('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
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

customElements.define('product-element', ProductElement);