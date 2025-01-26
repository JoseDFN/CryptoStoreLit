import { LitElement, html } from 'lit';

export class DetailInvoiceElement extends LitElement {
  static properties = {
    subtotal: { type: Number },
    iva: { type: Number },
    total: { type: Number },
  };

  constructor() {
    super();
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;

    // Manejar el evento personalizado
    this.handleResumenActualizado = this.handleResumenActualizado.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    // Escuchar el evento 'resumen-actualizado'
    document.addEventListener('resumen-actualizado', this.handleResumenActualizado);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // Eliminar el evento al desconectar el componente
    document.removeEventListener('resumen-actualizado', this.handleResumenActualizado);
  }

  handleResumenActualizado(event) {
    const { subtotal, total } = event.detail;
    this.subtotal = subtotal;
    this.iva = subtotal * 0.19; // 19% de IVA
    this.total = total;
  }

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

  guardarLocalStorage(factura) {
    const facturas = JSON.parse(localStorage.getItem('facturas')) || [];
    facturas.push(factura);
    localStorage.setItem('facturas', JSON.stringify(facturas));
  }

  handlePagarClick() {
    const factura = this.generarFactura();
    if (factura) {
      this.guardarLocalStorage(factura);
      alert('Factura guardada exitosamente.');
  
      // Limpiar campos después de guardar
      this.limpiarCampos();
    } else {
      alert('Error: Verifique que todos los campos estén completos.');
    }
  }
  
  limpiarCampos() {
    // Reiniciar campos del HeaderElement
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
  
    // Reiniciar campos del SummaryElement
    const summaryElement = document.querySelector('summary-element');
    if (summaryElement) {
      summaryElement.products = [];
      summaryElement.total = 0;
      summaryElement.requestUpdate(); // Actualizar manualmente la interfaz
    }
  
    // Reiniciar los totales del DetailInvoiceElement
    this.subtotal = 0;
    this.iva = 0;
    this.total = 0;
  
    // Solicitar actualización de la interfaz
    this.requestUpdate();
  }  

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

customElements.define('detailinvoice-element', DetailInvoiceElement);
