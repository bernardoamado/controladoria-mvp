export default function EditLancamento() {
    return (
        <div className="page">
            <h2>Editar lan&ccedil;amento</h2>
            <header>
            <h1>Informa&ccedil;&otilde;es do { selector == 'T' ? 't\u00EDtulo' : 'lan\u00E7amento' }</h1>
            <span class="primary">
              { selector == 'T' ? `N\u00FAmero: ${selectedDoc.numero}` : `Documento: ${selectedDoc.documento}` }
            </span>
            <span class="card-status"
              v-bind:class="{ 'warning': !selectedDoc.rateado, 'success': selectedDoc.rateado }"
            >{ selectedDoc.status }</span>
          </header>
          <main>
            <section class="doc-info">
              <ul class="data-info inline-list" v-if="selector == 'T'">
                <li class="card-info">
                  <label class="upper-label">Data de emiss&atilde;o</label>
                  <input class="card-data"
                    type="date"
                    readonly="readonly"
                    v-model="selectedDoc.emissao" />
                </li>
                <li class="card-info">
                  <label class="upper-label">Data de vencimento</label>
                  <input class="card-data"
                    type="date"
                    readonly="readonly"
                    v-model="selectedDoc.vencimento" />
                </li>
                <li class="card-info">
                  <label class="upper-label">Fluxo</label>
                  <input class="card-data"
                    type="text"
                    readonly="readonly"
                    size="5"
                    v-model="selectedDoc.fluxo"/>
                </li>
                <li class="card-info">
                  <label class="upper-label">Valor</label>
                  <input class="card-data"
                    type="number"
                    readonly="readonly"
                    size="8"
                    v-model="selectedDoc.valor" />
                </li>
                <li class="card-info eager-info">
                  <label class="upper-label">Estabelecimento</label>
                  <input class="card-data"
                    type="text"
                    readonly="readonly"
                    v-model="selectedDoc.estabelecimento" />
                </li>
              </ul>
              <ul class="data-info inline-list" v-if="selector == 'L'">
                <li class="card-info">
                  <label class="upper-label">Conta</label>
                  <input class="card-data"
                    type="text"
                    readonly="readonly"
                    size="10"
                    v-model="selectedDoc.conta" />
                </li>
                <li class="card-info">
                  <label class="upper-label">Fluxo</label>
                  <input class="card-data"
                    type="text"
                    readonly="readonly"
                    size="5"
                    v-model="selectedDoc.fluxo" />
                </li>
                <li class="card-info">
                  <label class="upper-label">Estabelecimento</label>
                  <input class="card-data"
                    type="text"
                    readonly="readonly"
                    size="10"
                    v-model="selectedDoc.estabelecimento" />
                </li>
                <li class="card-info">
                  <label class="upper-label">Data do lan&ccedil;amento</label>
                  <input class="card-data"
                    type="date"
                    readonly="readonly"
                    v-model="selectedDoc.data" />
                </li>
                <li class="card-info">
                  <label class="upper-label">Valor</label>
                  <input class="card-data"
                    type="number"
                    readonly="readonly"
                    size="8"
                    v-model="selectedDoc.valor" />
                </li>
                <li class="card-info eager-info">
                  <label class="upper-label">Hist&oacute;rico</label>
                  <input class="card-data"
                    type="text"
                    readonly="readonly"
                    v-model="selectedDoc.historico" />
                </li>
              </ul>
            </section>

            <section id="rateios">
              <header>
                <p>Distribui&ccedil;&atilde;o do documento</p>
                <hr />
              </header>
              <p>
                Distribua os valores nas dimens&otilde;es abaixo. Voc&ecirc; pode adicionar ou remover
                distribui&ccedil;&otilde;es em qualquer uma das dimens&otilde;es, n&atilde;o sendo
                necess&aacute;rio utilizar todas. A a&ccedil;&atilde;o s&oacute; ser&aacute; conclu&iacute;da
                quando a soma atingir 100%.
              </p>
              <div class="container-apports">
                <ul class="inline-list">
                  <li></li>
                </ul>
              </div>
            </section>
        </main>
        </div>
    );
}