import { LitElement, html, css } from 'lit';

export class SummaryElement extends LitElement {

  static properties = {
    products: { type: Array },
    total: { type: Number },
  };

  constructor() {
    super();
    this.products = [];
    this.total = 0;
  }

  connectedCallback() {
    super.connectedCallback();

    // Escuchar el evento 'producto-agregado'
    document.addEventListener('product-agregado', (event) => {
        const { code, name, costPerUnit, quantity, subtotal } = event.detail;
        const existingProduct = this.products.find((p) => p.codigo === code);
      
        if (existingProduct) {
          // Actualizar la cantidad y subtotal si el producto ya existe
          existingProduct.cantidad += quantity;
          existingProduct.subtotal = existingProduct.cantidad * existingProduct.vUnidad;
        } else {
          // Agregar un nuevo producto si no existe
          this.products = [
            ...this.products,
            { codigo: code, nombre: name, vUnidad: costPerUnit, cantidad: quantity, subtotal },
          ];
        }
      
        this.updateTotal();
      });
      
  }

  updateTotal() {
    // Calcular el subtotal
    const subtotal = this.products.reduce((sum, product) => sum + product.subtotal, 0);
  
    // Calcular el IVA
    const iva = subtotal * 0.19; // Suponiendo un IVA del 19%
  
    // Calcular el total
    const total = subtotal + iva;
  
    // Actualizar el total y emitir el evento
    this.total = total;
  
    this.dispatchEvent(
      new CustomEvent('resumen-actualizado', {
        detail: { subtotal, iva, total },
        bubbles: true,
        composed: true,
      })
    );
  }
  

  removeProduct(codigo) {
    this.products = this.products.filter((product) => product.codigo !== codigo);
    this.updateTotal();
  }

  render() {
    
    return html`
    <style>
      @import url('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
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
              <button type="button" class="btn btn-danger btn-sm" @click=${()=> this.removeProduct(product.codigo)}>
                X
              </button>
            </td>
          </tr>`)}
        </tbody>
      </table>
    </div>
    `;
  }
}

customElements.define('summary-element', SummaryElement);
