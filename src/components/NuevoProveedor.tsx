import { type ChangeEvent, useState } from "react";
import {
  Button, Modal, ModalHeader, ModalBody, Container, Row, Col,
  Form, FormGroup, Label, Input, FormFeedback
} from "reactstrap";
import Swal from "sweetalert2";
import type { IEmpresa } from "../interfaces/IEmpresa";
import { crearProveedor } from "../api/proveedorApi";
import { validateProvider } from "../utils/providerValidation";

const proveedorInicial: Omit<IEmpresa, "id" | "lastModifiedAt"> = {
  businessName: "",
  tradeName: "",
  taxId: "",
  phone: "",
  email: "",
  website: "",
  addressLine: "",
  country: "",
  annualBillingUsd: undefined
};

function NuevoProveedor() {
  const [modal, setModal] = useState(false);
  const [proveedor, setProveedor] = useState(proveedorInicial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = () => {
    setModal(!modal);
    if (modal) {
      setProveedor(proveedorInicial);
      setErrors({});
    }
  };

  const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const nuevoValor =
      name === "annualBillingUsd"
        ? value === "" ? undefined : Number(value)
        : value;

    const updated = {
      ...proveedor,
      [name]: nuevoValor
    };

    setProveedor(updated);
    setErrors(validateProvider(updated));
  };

  const guardar = async () => {
    const validationErrors = validateProvider(proveedor);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Swal.fire({
        title: "Error",
        text: "Corrige los errores del formulario",
        icon: "error"
      });
      return;
    }

    try {
      await crearProveedor({
        ...proveedor,
        businessName: proveedor.businessName.trim(),
        taxId: proveedor.taxId.trim(),
        tradeName: proveedor.tradeName?.trim() || "",
        phone: proveedor.phone?.trim() || "",
        email: proveedor.email?.trim() || "",
        website: proveedor.website?.trim() || "",
        addressLine: proveedor.addressLine?.trim() || "",
        country: proveedor.country?.trim() || ""
      });

      toggle();

      Swal.fire({
        position: "top",
        icon: "success",
        title: "Proveedor creado correctamente",
        showConfirmButton: false,
        timer: 1500
      }).then(() => window.location.reload());
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo crear el proveedor",
        icon: "error"
      });
    }
  };

  return (
    <>
      <Button color="success" onClick={toggle}>
        Agregar proveedor
      </Button>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Nuevo Proveedor</ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col>
                <Form>
                  <FormGroup>
                    <Label>Razón Social *</Label>
                    <Input
                      type="text"
                      name="businessName"
                      onChange={inputChangeValue}
                      value={proveedor.businessName}
                      invalid={!!errors.businessName}
                    />
                    <FormFeedback>{errors.businessName}</FormFeedback>
                  </FormGroup>

                  <FormGroup>
                    <Label>Nombre Comercial</Label>
                    <Input
                      type="text"
                      name="tradeName"
                      onChange={inputChangeValue}
                      value={proveedor.tradeName ?? ""}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>RUC *</Label>
                    <Input
                      type="text"
                      name="taxId"
                      onChange={inputChangeValue}
                      value={proveedor.taxId}
                      invalid={!!errors.taxId}
                    />
                    <FormFeedback>{errors.taxId}</FormFeedback>
                  </FormGroup>

                  <FormGroup>
                    <Label>Teléfono</Label>
                    <Input
                      type="text"
                      name="phone"
                      onChange={inputChangeValue}
                      value={proveedor.phone ?? ""}
                      invalid={!!errors.phone}
                    />
                    <FormFeedback>{errors.phone}</FormFeedback>
                  </FormGroup>

                  <FormGroup>
                    <Label>Correo Electrónico</Label>
                    <Input
                      type="email"
                      name="email"
                      onChange={inputChangeValue}
                      value={proveedor.email ?? ""}
                      invalid={!!errors.email}
                    />
                    <FormFeedback>{errors.email}</FormFeedback>
                  </FormGroup>

                  <FormGroup>
                    <Label>Sitio Web</Label>
                    <Input
                      type="url"
                      name="website"
                      onChange={inputChangeValue}
                      value={proveedor.website ?? ""}
                      invalid={!!errors.website}
                    />
                    <FormFeedback>{errors.website}</FormFeedback>
                  </FormGroup>

                  <FormGroup>
                    <Label>Dirección Física</Label>
                    <Input
                      type="text"
                      name="addressLine"
                      onChange={inputChangeValue}
                      value={proveedor.addressLine ?? ""}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>País</Label>
                    <Input
                      type="text"
                      name="country"
                      onChange={inputChangeValue}
                      value={proveedor.country ?? ""}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Facturación Anual</Label>
                    <Input
                      type="number"
                      name="annualBillingUsd"
                      onChange={inputChangeValue}
                      value={proveedor.annualBillingUsd ?? ""}
                      invalid={!!errors.annualBillingUsd}
                    />
                    <FormFeedback>{errors.annualBillingUsd}</FormFeedback>
                  </FormGroup>
                </Form>

                <Button color="primary" className="me-3" onClick={guardar}>
                  Guardar
                </Button>
                <Button color="secondary" onClick={toggle}>
                  Cancelar
                </Button>
              </Col>
            </Row>
          </Container>
        </ModalBody>
      </Modal>
    </>
  );
}

export default NuevoProveedor;