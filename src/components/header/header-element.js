import {LitElement, html} from 'lit';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
export class HeaderElement extends LitElement {
  static properties = {
    numberInvoice: {}
  };

  constructor(){
    super();
    this.numberInvoice = new Date().getTime().toString(16).toUpperCase();
  }

  render(){
    return html /*html*/`
    <style>
      @import url('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
    </style>
    <div class="container mt-4">
        <div class="card">
          <div class="card-header text-center">
            <h3>Nro Factura</h3>
            <input type="text" id="numberInvoice" class="form-control text-center mt-2" placeholder="Número de factura generado" value="${this.numberInvoice}" disabled readonly>
          </div>
          <div class="card-body">
            <form>
              <!-- Número de Identificación -->
              <div class="mb-3">
                <label for="Identification" class="form-label">Número de Identificación</label>
                <input type="text" id="Identification" class="form-control" placeholder="Ingrese su número de identificación">
              </div>

              <!-- name y lastname -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="name" class="form-label">name</label>
                  <input type="text" id="name" class="form-control" placeholder="Ingrese su nombre">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="lastname" class="form-label">lastname</label>
                  <input type="text" id="lastname" class="form-control" placeholder="Ingrese su apellido">
                </div>
              </div>

              <!-- Dirección -->
              <div class="mb-3">
                <label for="address" class="form-label">Dirección</label>
                <input type="text" id="address" class="form-control" placeholder="Ingrese su dirección">
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Ingrese su email">
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('header-element', HeaderElement);