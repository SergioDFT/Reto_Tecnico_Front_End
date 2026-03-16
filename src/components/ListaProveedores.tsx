import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Container, Row, Col, Table, Button } from "reactstrap";
import type { IEmpresa } from "../interfaces/IEmpresa";
import { eliminarProveedor, obtenerProveedores } from "../api/proveedorApi";
import NuevoProveedor from "./NuevoProveedor";
import EditarProveedor from "./EditarProveedor";
import Screening from "./Screening";
import { formatPeruDateTime } from "../utils/date";

export function ListaProveedores() {
  const [proveedores, setProveedores] = useState<IEmpresa[]>([]);

  const obtenerLista = async () => {
    try {
      const data = await obtenerProveedores();
      setProveedores(data);
    } catch (error: any) {
      Swal.fire("Error", error.message || "No se pudo obtener la lista de proveedores", "error");
    }
  };

  useEffect(() => {
    obtenerLista();
  }, []);

  const eliminar = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Eliminar proveedor",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarProveedor(id);
          await obtenerLista();

          Swal.fire({
            title: "Eliminado",
            text: "El proveedor fue eliminado correctamente",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
        } catch (error: any) {
          Swal.fire("Error", error.message || "No se pudo eliminar el proveedor", "error");
        }
      }
    });
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          <h4>Lista de Proveedores</h4>
          <hr />
          <NuevoProveedor />

          <Table hover responsive borderless striped className="table-light mt-5 text-center">
            <thead>
              <tr>
                <th>Razón Social</th>
                <th>RUC</th>
                <th>País</th>
                <th>Última Edición</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((item) => (
                <tr key={item.id}>
                  <td>{item.businessName}</td>
                  <td>{item.taxId}</td>
                  <td>{item.country}</td>
                  <td>{formatPeruDateTime(item.lastModifiedAt ?? "")}</td>
                  <td>
                    <Screening id={item.id!} />
                    <EditarProveedor id={item.id!} />
                    <Button className="ms-3" color="danger" onClick={() => eliminar(item.id!)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}