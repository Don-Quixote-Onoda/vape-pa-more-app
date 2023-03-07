import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";

export default function Payments(props) {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        setPayments(props.payments);
        console.log(payments);
    }, []);

    let emptyPayment = {
        id: null,
        payment_name: "",
        payment_image: null,
        payment_type_id: "",
        price: 0,
        quantity: 0,
        status: 0,
    };

    const [paymentDialog, setPaymentDialog] = useState(false);
    const [deletePaymentDialog, setDeletePaymentDialog] = useState(false);
    const [deletePaymentsDialog, setDeletePaymentsDialog] = useState(false);
    const [payment, setPayment] = useState(emptyPayment);
    const [selectedPayments, setSelectedPayments] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setPayment(emptyPayment);
        setSubmitted(false);
        setPaymentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPaymentDialog(false);
    };

    const hideDeletePaymentDialog = () => {
        setDeletePaymentDialog(false);
    };

    const hideDeletePaymentsDialog = () => {
        setDeletePaymentsDialog(false);
    };

    const savePayment = () => {
        setSubmitted(true);

        if (payment.name.trim()) {
            let _payments = [...payments];
            let _payment = { ...payment };

            if (payment.id) {
                const index = findIndexById(payment.id);

                _payments[index] = _payment;
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Payment Updated",
                    life: 3000,
                });
            } else {
                _payment.id = createId();
                _payment.image = "payment-placeholder.svg";
                _payments.push(_payment);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Payment Created",
                    life: 3000,
                });
            }

            setPayments(_payments);
            setPaymentDialog(false);
            setPayment(emptyPayment);
        }
    };

    const editPayment = (payment) => {
        setPayment({ ...payment });
        setPaymentDialog(true);
    };

    const confirmDeletePayment = (payment) => {
        setPayment(payment);
        setDeletePaymentDialog(true);
    };

    const deletePayment = () => {
        let _payments = payments.filter((val) => val.id !== payment.id);

        setPayments(_payments);
        setDeletePaymentDialog(false);
        setPayment(emptyPayment);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Payment Deleted",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < payments.length; i++) {
            if (payments[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = "";
        let chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const cols = [
        { field: "id", header: "ID" },
        { field: "order_detail_id", header: "Order Detail ID" },
        { field: "purchase", header: "Purchase" },
    ];

    const exportColumns = cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
    }));

    const exportPdf = () => {
        import("jspdf").then((jsPDF) => {
            import("jspdf-autotable").then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, payments);
                doc.save("payments.pdf");
            });
        });
    };

    const confirmDeleteSelected = () => {
        setDeletePaymentsDialog(true);
    };

    const deleteSelectedPayments = () => {
        let _payments = payments.filter(
            (val) => !selectedPayments.includes(val)
        );

        setPayments(_payments);
        setDeletePaymentsDialog(false);
        setSelectedPayments(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Payments Deleted",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _payment = { ...payment };

        _payment["category"] = e.value;
        setPayment(_payment);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _payment = { ...payment };

        _payment[`${name}`] = val;

        setPayment(_payment);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _payment = { ...payment };

        _payment[`${name}`] = val;

        setPayment(_payment);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                />
                <Button
                    label="Delete"
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={confirmDeleteSelected}
                    disabled={!selectedPayments || !selectedPayments.length}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button
                label="Export"
                icon="pi pi-upload"
                className="p-button-help"
                onClick={exportPdf}
            />
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <img
                src={`https://primefaces.org/cdn/primereact/images/payment/${rowData.image}`}
                alt={rowData.image}
                className="shadow-2 border-round"
                style={{ width: "64px" }}
            />
        );
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price);
    };

    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <Tag
                value={rowData.inventoryStatus}
                severity={getSeverity(rowData)}
            ></Tag>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => editPayment(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeletePayment(rowData)}
                />
            </React.Fragment>
        );
    };

    const getSeverity = (payment) => {
        switch (payment.inventoryStatus) {
            case "INSTOCK":
                return "success";

            case "LOWSTOCK":
                return "warning";

            case "OUTOFSTOCK":
                return "danger";

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </span>
        </div>
    );
    const paymentDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={hideDialog}
            />
            <Button label="Save" icon="pi pi-check" onClick={savePayment} />
        </React.Fragment>
    );
    const deletePaymentDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeletePaymentDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deletePayment}
            />
        </React.Fragment>
    );
    const deletePaymentsDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeletePaymentsDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteSelectedPayments}
            />
        </React.Fragment>
    );

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 classNameName="font-semibold text-xl text-gray-800 leading-tight">
                    Payments
                </h2>
            }
        >
            <div className="container px-6 mx-auto grid">
                <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    Payments
                </h2>
                <div className="w-full mb-8 overflow-hidden rounded-lg shadow-xs">
                    <div className="w-full overflow-x-auto card">
                        <Toast ref={toast} />
                        <div className="card">
                            <Toolbar
                                className="mb-4"
                                left={leftToolbarTemplate}
                                right={rightToolbarTemplate}
                            ></Toolbar>

                            <DataTable
                                ref={dt}
                                value={payments}
                                selection={selectedPayments}
                                onSelectionChange={(e) =>
                                    setSelectedPayments(e.value)
                                }
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} payments"
                                globalFilter={globalFilter}
                                header={header}
                            >
                                <Column
                                    selectionMode="multiple"
                                    exportable={false}
                                ></Column>
                                <Column
                                    field="order_detail_id"
                                    header="Order Detail ID"
                                    sortable
                                    style={{ minWidth: "16rem" }}
                                ></Column>
                                <Column
                                    field="purchase"
                                    header="Purchase"
                                    sortable
                                    style={{ minWidth: "12rem" }}
                                ></Column>
                                <Column
                                    body={actionBodyTemplate}
                                    exportable={false}
                                    style={{ minWidth: "12rem" }}
                                ></Column>
                            </DataTable>
                        </div>
                        <Dialog
                            visible={paymentDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Payment Details"
                            modal
                            className="p-fluid"
                            footer={paymentDialogFooter}
                            onHide={hideDialog}
                        >
                            {payment.image && (
                                <img
                                    src={`https://primefaces.org/cdn/primereact/images/payment/${payment.image}`}
                                    alt={payment.image}
                                    className="payment-image block m-auto pb-3"
                                />
                            )}
                            <div className="field">
                                <label htmlFor="name" className="font-bold">
                                    Name
                                </label>
                                <InputText
                                    id="name"
                                    value={payment.name}
                                    onChange={(e) => onInputChange(e, "name")}
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !payment.name,
                                    })}
                                />
                                {submitted && !payment.name && (
                                    <small className="p-error">
                                        Name is required.
                                    </small>
                                )}
                            </div>
                            <div className="field">
                                <label
                                    htmlFor="description"
                                    className="font-bold"
                                >
                                    Description
                                </label>
                                <InputTextarea
                                    id="description"
                                    value={payment.description}
                                    onChange={(e) =>
                                        onInputChange(e, "description")
                                    }
                                    required
                                    rows={3}
                                    cols={20}
                                />
                            </div>
                            <div className="field">
                                <label className="mb-3 font-bold">
                                    Category
                                </label>
                                <div className="formgrid grid">
                                    <div className="field-radiobutton col-6">
                                        <RadioButton
                                            inputId="category1"
                                            name="category"
                                            value="Accessories"
                                            onChange={onCategoryChange}
                                            checked={
                                                payment.category ===
                                                "Accessories"
                                            }
                                        />
                                        <label htmlFor="category1">
                                            Accessories
                                        </label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton
                                            inputId="category2"
                                            name="category"
                                            value="Clothing"
                                            onChange={onCategoryChange}
                                            checked={
                                                payment.category === "Clothing"
                                            }
                                        />
                                        <label htmlFor="category2">
                                            Clothing
                                        </label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton
                                            inputId="category3"
                                            name="category"
                                            value="Electronics"
                                            onChange={onCategoryChange}
                                            checked={
                                                payment.category ===
                                                "Electronics"
                                            }
                                        />
                                        <label htmlFor="category3">
                                            Electronics
                                        </label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton
                                            inputId="category4"
                                            name="category"
                                            value="Fitness"
                                            onChange={onCategoryChange}
                                            checked={
                                                payment.category === "Fitness"
                                            }
                                        />
                                        <label htmlFor="category4">
                                            Fitness
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label
                                        htmlFor="price"
                                        className="font-bold"
                                    >
                                        Price
                                    </label>
                                    <InputNumber
                                        id="price"
                                        value={payment.price}
                                        onValueChange={(e) =>
                                            onInputNumberChange(e, "price")
                                        }
                                        mode="currency"
                                        currency="USD"
                                        locale="en-US"
                                    />
                                </div>
                                <div className="field col">
                                    <label
                                        htmlFor="quantity"
                                        className="font-bold"
                                    >
                                        Quantity
                                    </label>
                                    <InputNumber
                                        id="quantity"
                                        value={payment.quantity}
                                        onValueChange={(e) =>
                                            onInputNumberChange(e, "quantity")
                                        }
                                    />
                                </div>
                            </div>
                        </Dialog>

                        <Dialog
                            visible={deletePaymentDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deletePaymentDialogFooter}
                            onHide={hideDeletePaymentDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {payment && (
                                    <span>
                                        Are you sure you want to delete{" "}
                                        <b>{payment.name}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>
                        <Dialog
                            visible={deletePaymentsDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deletePaymentsDialogFooter}
                            onHide={hideDeletePaymentsDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {payment && (
                                    <span>
                                        Are you sure you want to delete the
                                        selected payments?
                                    </span>
                                )}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
