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

export default function Orders(props) {
  const [orders, setOrders] = useState([]);

    useEffect(() => {
        setOrders(props.orders);
    }, []);

    let emptyOrder = {
        id: null,
        order_number: "",
        product_id: null,
        quantity: "",
        total_price: 0,
    };

    const [orderDialog, setOrderDialog] = useState(false);
    const [deleteOrderDialog, setDeleteOrderDialog] = useState(false);
    const [deleteOrdersDialog, setDeleteOrdersDialog] = useState(false);
    const [order, setOrder] = useState(emptyOrder);
    const [selectedOrders, setSelectedOrders] = useState(null);
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
        setOrder(emptyOrder);
        setSubmitted(false);
        setOrderDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setOrderDialog(false);
    };

    const hideDeleteOrderDialog = () => {
        setDeleteOrderDialog(false);
    };

    const hideDeleteOrdersDialog = () => {
        setDeleteOrdersDialog(false);
    };

    const saveOrder = () => {
        setSubmitted(true);

        if (order.name.trim()) {
            let _orders = [...orders];
            let _order = { ...order };

            if (order.id) {
                const index = findIndexById(order.id);

                _orders[index] = _order;
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Order Updated",
                    life: 3000,
                });
            } else {
                _order.id = createId();
                _order.image = "order-placeholder.svg";
                _orders.push(_order);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Order Created",
                    life: 3000,
                });
            }

            setOrders(_orders);
            setOrderDialog(false);
            setOrder(emptyOrder);
        }
    };

    const editOrder = (order) => {
        setOrder({ ...order });
        setOrderDialog(true);
    };

    const confirmDeleteOrder = (order) => {
        setOrder(order);
        setDeleteOrderDialog(true);
    };

    const deleteOrder = () => {
        let _orders = orders.filter((val) => val.id !== order.id);

        setOrders(_orders);
        setDeleteOrderDialog(false);
        setOrder(emptyOrder);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Order Deleted",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < orders.length; i++) {
            if (orders[i].id === id) {
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
        { field: "order_number", header: "Name" },
        { field: "product_id", header: "Image" },
        { field: "quantity", header: "Type" },
        { field: "total_price", header: "Price" },
    ];

    const exportColumns = cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
    }));

    const exportPdf = () => {
        import("jspdf").then((jsPDF) => {
            import("jspdf-autotable").then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, orders);
                doc.save("orders.pdf");
            });
        });
    };

    const confirmDeleteSelected = () => {
        setDeleteOrdersDialog(true);
    };

    const deleteSelectedOrders = () => {
        let _orders = orders.filter(
            (val) => !selectedOrders.includes(val)
        );

        setOrders(_orders);
        setDeleteOrdersDialog(false);
        setSelectedOrders(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "orders Deleted",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _order = { ...order };

        _order["category"] = e.value;
        setOrder(_order);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _order = { ...order };

        _order[`${name}`] = val;

        setOrder(_order);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _order = { ...order };

        _order[`${name}`] = val;

        setOrder(_order);
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
                    disabled={!selectedOrders || !selectedOrders.length}
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
                src={`https://primefaces.org/cdn/primereact/images/order/${rowData.image}`}
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
                    onClick={() => editOrder(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteOrder(rowData)}
                />
            </React.Fragment>
        );
    };

    const getSeverity = (order) => {
        switch (order.inventoryStatus) {
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
    const orderDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={hideDialog}
            />
            <Button label="Save" icon="pi pi-check" onClick={saveOrder} />
        </React.Fragment>
    );
    const deleteOrderDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteOrderDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteOrder}
            />
        </React.Fragment>
    );
    const deleteOrdersDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteOrdersDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteSelectedOrders}
            />
        </React.Fragment>
    );
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Orders</h2>}
        >
            <div class="container px-6 mx-auto grid">
            <h2
              class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200"
            >
              Orders
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
                                value={orders}
                                selection={selectedOrders}
                                onSelectionChange={(e) =>
                                    setSelectedOrders(e.value)
                                }
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                                globalFilter={globalFilter}
                                header={header}
                            >
                                <Column
                                    selectionMode="multiple"
                                    exportable={false}
                                ></Column>
                                <Column
                                    field="order_number"
                                    header="Order Number"
                                    sortable
                                    style={{ minWidth: "16rem" }}
                                ></Column>
                                <Column
                                    field="product_id"
                                    header="Product Name"
                                    sortable
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    field="quantity"
                                    header="Quantity"
                                    sortable
                                    style={{ minWidth: "10rem" }}
                                ></Column>
                                <Column
                                    field="total_price"
                                    header="Total Price"
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
                            visible={orderDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Order Details"
                            modal
                            className="p-fluid"
                            footer={orderDialogFooter}
                            onHide={hideDialog}
                        >
                            {order.image && (
                                <img
                                    src={`https://primefaces.org/cdn/primereact/images/order/${order.image}`}
                                    alt={order.image}
                                    className="order-image block m-auto pb-3"
                                />
                            )}
                            <div className="field">
                                <label htmlFor="name" className="font-bold">
                                    Name
                                </label>
                                <InputText
                                    id="name"
                                    value={order.name}
                                    onChange={(e) => onInputChange(e, "name")}
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !order.name,
                                    })}
                                />
                                {submitted && !order.name && (
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
                                    value={order.description}
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
                                                order.category ===
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
                                                order.category === "Clothing"
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
                                                order.category ===
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
                                                order.category === "Fitness"
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
                                        value={order.price}
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
                                        value={order.quantity}
                                        onValueChange={(e) =>
                                            onInputNumberChange(e, "quantity")
                                        }
                                    />
                                </div>
                            </div>
                        </Dialog>

                        <Dialog
                            visible={deleteOrderDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteOrderDialogFooter}
                            onHide={hideDeleteOrderDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {order && (
                                    <span>
                                        Are you sure you want to delete{" "}
                                        <b>{order.name}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>
                        <Dialog
                            visible={deleteOrdersDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteOrdersDialogFooter}
                            onHide={hideDeleteOrdersDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {order && (
                                    <span>
                                        Are you sure you want to delete the
                                        selected orders?
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
