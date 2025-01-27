// Import LitElement, html from lit
import { LitElement, html } from 'lit';

// Define the DetailInvoiceElement class that extends LitElement
export class DetailInvoiceElement extends LitElement {
  // Define static properties for the class
  static properties = {
    subtotal: { type: Number },
    iva: { type: Number },
    total: { type: Number },
  };

  // Constructor for the class
  constructor() {
    super();
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;

    // Bind the handleResumenActualizado method to this instance
    this.handleResumenActualizado = this.handleResumenActualizado.bind(this);
  }

  // Method to handle the connectedCallback lifecycle event
  connectedCallback() {
    super.connectedCallback();

    // Listen for the 'resumen-actualizado' event
    document.addEventListener('resumen-actualizado', this.handleResumenActualizado);
  }

  // Method to handle the disconnectedCallback lifecycle event
  disconnectedCallback() {
    super.disconnectedCallback();

    // Remove the event listener when the component is disconnected
    document.removeEventListener('resumen-actualizado', this.handleResumenActualizado);
  }

  // Method to handle the 'resumen-actualizado' event
  handleResumenActualizado(event) {
    const { subtotal, total } = event.detail;
    this.subtotal = subtotal;
    this.iva = subtotal * 0.19; // Assuming an IVA of 19%
    this.total = total;
  }

  // Method to generate the invoice
  generarFactura() {
    const headerElement = document.querySelector('header-element');
    const summaryElement = document.querySelector('summary-element');

    if (!headerElement || !summaryElement) {
      alert('Error: No se encontraron elementos necesarios para generar la factura.');
      return null;
    }

    const nroFactura = headerElement.shadowRoot.querySelector('#numberInvoice').value;
    const identificacion = headerElement.shadowRoot.querySelector('#Identification').value;
    const nombre = headerElement.shadowRoot.querySelector('#name').value;
    const apellido = headerElement.shadowRoot.querySelector('#lastname').value;
    const direccion = headerElement.shadowRoot.querySelector('#address').value;
    const email = headerElement.shadowRoot.querySelector('#email').value;

    const productos = summaryElement.products;

    if (!nroFactura || !identificacion || !nombre || !apellido || !direccion || !email || productos.length === 0) {
      alert('Error: Todos los campos son obligatorios.');
      return null;
    }

    return {
      nroFactura,
      header: { identificacion, nombre, apellido, direccion, email },
      detailFact: productos,
      summary: { subtotal: this.subtotal, iva: this.iva, total: this.total },
    };
  }

  // Method to save the invoice to local storage
  guardarLocalStorage(factura) {
    const facturas = JSON.parse(localStorage.getItem('facturas')) || [];
    facturas.push(factura);
    localStorage.setItem('facturas', JSON.stringify(facturas));
  }

  // Method to handle the 'Pagar' button click event
  handlePagarClick() {
    const factura = this.generarFactura();
    if (factura) {
      this.guardarLocalStorage(factura);
      alert('Factura guardada exitosamente.');

      // Clear the fields after saving
      this.limpiarCampos();
    } else {
      alert('Error: Verifique que todos los campos estén completos.');
    }
  }

  // Method to clear the fields in the HeaderElement and SummaryElement
  limpiarCampos() {
    // Clear the fields in the HeaderElement
    const headerElement = document.querySelector('header-element');
    if (headerElement) {
      headerElement.numberInvoice = new Date().getTime().toString(16).toUpperCase();
      const inputs = headerElement.shadowRoot.querySelectorAll('input');
      inputs.forEach(input => {
        if (input.type !== 'text' || input.disabled === false) {
          input.value = '';
        }
      });
    }

    // Clear the fields in the SummaryElement
    const summaryElement = document.querySelector('summary-element');
    if (summaryElement) {
      summaryElement.products = [];
      summaryElement.total = 0;
      summaryElement.requestUpdate(); // Manually update the interface
    }

    // Reset the totals in the DetailInvoiceElement
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;

    // Request an update to the interface
    this.requestUpdate();
  }

  // Method to render the component
  render() {
    return html`
      <style>
        @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
      </style>
      <div class="container mt-4">
        <div class="card">
          <div class="card-body text-center">
            <h5 class="mb-3">Resumen de Factura</h5>
            <div class="mb-2">
              <strong>Subtotal:</strong> $<span>${this.subtotal.toFixed(2)}</span>
            </div>
            <div class="mb-2">
              <strong>IVA (19%):</strong> $<span>${this.iva.toFixed(2)}</span>
            </div>
            <div class="mb-3">
              <strong>Total a Pagar:</strong> $<span>${this.total.toFixed(2)}</span>
            </div>
            <button type="button" class="btn btn-primary col-12 btn-lg" @click="${this.handlePagarClick}">
              Pagar
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

// Define the custom element
customElements.define('detailinvoice-element', DetailInvoiceElement);