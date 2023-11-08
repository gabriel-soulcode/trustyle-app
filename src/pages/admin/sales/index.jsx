import { Eye } from "@phosphor-icons/react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { ENDPOINTS } from "../../../config/api";
import Modal from "../../../components/modal";

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [saleIdDetails, setSaleIdDetails] = useState(null);
  const [itemsSale, setItemsSale] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  function initializeTable() {
    const token = localStorage.getItem("token");
    axios
      .get(ENDPOINTS.getAdminPurchases(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setSales(data);
      });
  }

  useEffect(() => {
    if (saleIdDetails) {
      const token = localStorage.getItem("token");
      axios
        .get(ENDPOINTS.getAdminPurchaseItems(saleIdDetails), {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }) => {
          setItemsSale(data);
        });
    }
  }, [saleIdDetails]);

  useEffect(() => {
    initializeTable();
  }, []);

  function formatDate(str) {
    return new Date(str).toLocaleDateString();
  }

  function changeStatus(compraId, statusCompra) {
    const token = localStorage.getItem("token");
    axios
      .put(
        ENDPOINTS.putAdminPurchaseStatus(compraId),
        { statusCompra },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        initializeTable();
      });
  }

  return (
    <main className="container mx-auto flex-1 p-6 pb-16">
      <section className="w-full mt-8">
        <h1 className="text-xl text-slate-900 font-semibold uppercase">
          Vendas
        </h1>

        <div className="w-full mt-4 overflow-scroll">
          <table className="w-full min-w-table border-collapse">
            <colgroup>
              <col className="w-3/12" />
              <col className="w-3/12" />
              <col className="w-2/12" />
              <col className="w-2/12" />
              <col className="w-1/12" />
              <col className="w-1/12" />
            </colgroup>

            <thead>
              <tr>
                <th className="p-2 border border-slate-900">Nome</th>
                <th className="p-2 border border-slate-900">E-mail</th>
                <th className="p-2 border border-slate-900">Data</th>
                <th className="p-2 border border-slate-900">Status</th>
                <th className="p-2 border border-slate-900">Total</th>
                <th className="p-2 border border-slate-900">Detalhes</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((s) => (
                <tr>
                  <td className="px-2 py-1 border border-slate-900">
                    {s?.usuario?.nome}
                  </td>
                  <td className="px-2 py-1 border border-slate-900">
                    {s?.usuario?.email}
                  </td>
                  <td className="px-2 py-1 border border-slate-900">
                    {formatDate(s?.dataRegistro)}
                  </td>
                  <td className="px-2 py-1 border border-slate-900">
                    <select
                      onChange={(e) => changeStatus(s?.id, e.target.value)}
                      name="statusCompra"
                      id="statusCompra"
                      value={s?.statusCompra}
                      className="w-full h-full focus:outline-none"
                    >
                      <option value="Aguardando Pagamento">
                        Aguardando Pagamento
                      </option>
                      <option value="Aguardando Envio">Aguardando Envio</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregue">Entregue</option>
                    </select>
                  </td>
                  <td className="px-2 py-1 border border-slate-900">
                    R$ {s?.total}
                  </td>
                  <td className="px-2 py-1 border border-slate-900">
                    <button
                      onClick={() => {
                        setOpenModal(true);
                        setSaleIdDetails(s?.id);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-2 py-1 rounded text-slate-200 bg-slate-800"
                    >
                      <Eye />
                      Mais
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {openModal && (
        <Modal title="Detalhes da Compra">
          <div className="w-full">
            {itemsSale.map((i) => (
              <div
                key={i?.id}
                className="w-full mb-3 flex flex-col gap-2 border-b border-slate-400 py-2"
              >
                <strong className="font-medium text-slate-500 uppercase">
                  {i?.produto?.nome}
                </strong>
                <span className="text-slate-800">
                  Quantidade: {i?.quantidade}
                </span>
              </div>
            ))}
            <button
              onClick={() => {
                setOpenModal(false);
                setSaleIdDetails(null);
              }}
              className="text-center px-2 py-1 rounded text-slate-50 bg-slate-900 transition-colors hover:bg-slate-800"
            >
              Fechar
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}
