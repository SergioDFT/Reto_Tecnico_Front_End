import { useEffect, useState } from "react";
import {
  Button, Modal, ModalHeader, ModalBody, Container, Row, Col,
  Form, FormGroup, Label, Input, Table, Alert
} from "reactstrap";
import type { IEmpresa } from "../interfaces/IEmpresa";
import type { IScreeningItem } from "../interfaces/IScreening";
import { obtenerProveedorPorId } from "../api/proveedorApi";
import { ejecutarScreening } from "../api/screeningApi";

interface IScreeningProps {
  id: number;
}

const empresaInicial: IEmpresa = {
  businessName: "",
  tradeName: "",
  taxId: "",
  phone: "",
  email: "",
  website: "",
  addressLine: "",
  country: "",
  annualBillingUsd: undefined,
  lastModifiedAt: ""
};

const Screening: React.FC<IScreeningProps> = ({ id }) => {
  const [modal, setModal] = useState(false);
  const [empresa, setEmpresa] = useState<IEmpresa>(empresaInicial);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultados, setResultados] = useState<IScreeningItem[]>([]);
  const [source, setSource] = useState("");
  const [hits, setHits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");

  const toggle = () => setModal(!modal);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const data = await obtenerProveedorPorId(id);
        setEmpresa(data);
        setSearchTerm(data.businessName ?? "");
      } catch {
        setErrorMensaje("No se pudo cargar el proveedor");
      }
    };

    if (id && modal) {
      fetchEmpresa();
      setResultados([]);
      setSource("");
      setHits(0);
      setErrorMensaje("");
    }
  }, [id, modal]);

  const buscar = async () => {
    if (!searchTerm.trim()) {
      setErrorMensaje("Debe ingresar un texto para el screening.");
      return;
    }

    try {
      setLoading(true);
      setErrorMensaje("");
      setResultados([]);
      setSource("");
      setHits(0);

      const data = await ejecutarScreening(searchTerm.trim());

      setResultados(data.data);
      setSource(data.source);
      setHits(data.hits);
    } catch (error: any) {
      setErrorMensaje(error.message || "No se pudo ejecutar el screening");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button color="secondary" onClick={toggle}>
        Screening
      </Button>

      <Modal size="xl" centered scrollable isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Screening</ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col>
                <Form>
                  <FormGroup>
                    <Label>Proveedor</Label>
                    <Input type="text" value={empresa.businessName} readOnly />
                  </FormGroup>

                  <FormGroup>
                    <Label>Término de búsqueda</Label>
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Ingrese el texto a consultar"
                    />
                  </FormGroup>

                  <Button color="primary" className="me-3" onClick={buscar} disabled={loading}>
                    {loading ? "Buscando..." : "Buscar"}
                  </Button>
                  <Button color="secondary" onClick={toggle}>
                    Cancelar
                  </Button>
                </Form>

                {errorMensaje && (
                  <Alert color="danger" className="mt-4">
                    {errorMensaje}
                  </Alert>
                )}

                {!errorMensaje && (
                  <div className="mt-4">
                    <strong>Fuente:</strong> {source || "-"} <br />
                    <strong>Hits:</strong> {hits}
                  </div>
                )}

                <Table hover responsive borderless striped className="table-light mt-4 text-center">
                  <thead>
                    <tr>
                      <th>Entidad</th>
                      <th>Jurisdicción</th>
                      <th>Relacionado</th>
                      <th>Fuente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          {loading
                            ? "Consultando..."
                            : errorMensaje
                            ? "No se pudieron obtener resultados."
                            : "Sin resultados."}
                        </td>
                      </tr>
                    ) : (
                      resultados.map((item, index) => (
                        <tr key={index}>
                          <td>{item.entityName ?? ""}</td>
                          <td>{item.jurisdiction ?? ""}</td>
                          <td>{item.linkedTo ?? ""}</td>
                          <td>{item.dataFrom ?? ""}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Screening;