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


export default function OrderDetails(props) {
  const [orderDetails, setOrderDetails] = useState([]);
  useEffect(() => {
    setOrderDetails(props.orderdetails);
  });

  let emptyOrderDetail = {
    id: null,
    order_number: "",
    total_amount: null,
};

    const [orderDetailDialog, setOrderDetailDialog] = useState(false);
    const [deleteOrderDetailDialog, setDeleteOrderDetailDialog] = useState(false);
    const [deleteOrderDetailsDialog, setDeleteOrderDetailsDialog] = useState(false);
    const [orderDetail, setOrderDetail] = useState(emptyOrderDetail);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
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
        setOrderDetail(emptyOrderDetail);
        setSubmitted(false);
        setOrderDetailDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setOrderDetailDialog(false);
    };

    const hideDeleteOrderDetailDialog = () => {
        setDeleteOrderDetailDialog(false);
    };

    const hideDeleteOrderDetailsDialog = () => {
        setDeleteOrderDetailsDialog(false);
    };

    const saveOrderDetail = () => {
        setSubmitted(true);

        if (orderDetail.name.trim()) {
            let _orderDetails = [...orderDetails];
            let _orderDetail = { ...orderDetail };

            if (orderDetail.id) {
                const index = findIndexById(orderDetail.id);

                _orderDetails[index] = _orderDetail;
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Order Detail Updated",
                    life: 3000,
                });
            } else {
                _product.id = createId();
                _product.image = "product-placeholder.svg";
                _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Order Detail Created",
                    life: 3000,
                });
            }

            setOrderDetails(_orderDetails);
            setOrderDetailDialog(false);
            setOrderDetail(emptyOrderDetail);
        }
    };

    const editOrderDetail = (orderDetail) => {
        setOrderDetail({ ...orderDetail });
        setOrderDetailDialog(true);
    };

    const confirmDeleteOrderDetail = (orderDetail) => {
        setOrderDetail(orderDetail);
        setDeleteOrderDetailDialog(true);
    };

    const deleteOrderDetail = () => {
        let _products = products.filter((val) => val.id !== product.id);

        setOrderDetails(_products);
        setDeleteOrderDetailDialog(false);
        setOrderDetail(emptyOrderDetail);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Order Detail Deleted",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < orderDetails.length; i++) {
            if (orderDetails[i].id === id) {
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
        { field: "order_number", header: "Order Number" },
        { field: "total_amount", header: "Total Price" },
    ];

    const exportColumns = cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
    }));

    const exportPdf = () => {
        import("jspdf").then((jsPDF) => {
            import("jspdf-autotable").then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, orderDetails);
                doc.save("orderDetails.pdf");
            });
        });
    };

    const confirmDeleteSelected = () => {
        setDeleteOrderDetailsDialog(true);
    };

    const deleteSelectedOrderDetails = () => {
        let _orderDetails = orderDetails.filter(
            (val) => !selectedOrderDetails.includes(val)
        );

        setOrderDetails(_orderDetails);
        setDeleteOrderDetailsDialog(false);
        setSelectedOrderDetails(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Order Detail Deleted",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _orderDetail = { ...orderDetail };

        _orderDetail["category"] = e.value;
        setOrderDetail(_orderDetail);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _orderDetail = { ...orderDetail };

        _orderDetail[`${name}`] = val;

        setOrderDetail(_orderDetail);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _orderDetail = { ...orderDetail };

        _orderDetail[`${name}`] = val;

        setOrderDetail(_orderDetail);
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
                    disabled={!selectedOrderDetails || !selectedOrderDetails.length}
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
                src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`}
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
                    onClick={() => editOrderDetail(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteOrderDetail(rowData)}
                />
            </React.Fragment>
        );
    };

    const getSeverity = (orderDetail) => {
        switch (orderDetail.inventoryStatus) {
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
    const orderDetailDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={hideDialog}
            />
            <Button label="Save" icon="pi pi-check" onClick={saveOrderDetail} />
        </React.Fragment>
    );
    const deleteOrderDetailDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteOrderDetailDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteOrderDetail}
            />
        </React.Fragment>
    );
    const deleteOrderDetailsDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteOrderDetailsDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteSelectedOrderDetails}
            />
        </React.Fragment>
    );

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Order Details</h2>}
        >
            <div className="container px-6 mx-auto grid">
                <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    Order Details
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
                                value={orderDetails}
                                selection={selectedOrderDetails}
                                onSelectionChange={(e) =>
                                    setSelectedOrderDetails(e.value)
                                }
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} order details"
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
                                    field="total_amount"
                                    header="total_amount"
                                    sortable
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    body={actionBodyTemplate}
                                    exportable={false}
                                    style={{ minWidth: "12rem" }}
                                ></Column>
                            </DataTable>
                        </div>
                        <Dialog
                            visible={orderDetailDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Order Details"
                            modal
                            className="p-fluid"
                            footer={orderDetailDialogFooter}
                            onHide={hideDialog}
                        >
                            {orderDetail.image && (
                                <img
                                    src={`https://primefaces.org/cdn/primereact/images/orderDetail/${orderDetail.image}`}
                                    alt={orderDetail.image}
                                    className="orderDetail-image block m-auto pb-3"
                                />
                            )}
                            <div className="field">
                                <label htmlFor="name" className="font-bold">
                                    Name
                                </label>
                                <InputText
                                    id="name"
                                    value={orderDetail.name}
                                    onChange={(e) => onInputChange(e, "name")}
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !orderDetail.name,
                                    })}
                                />
                                {submitted && !orderDetail.name && (
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
                                    value={orderDetail.description}
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
                                                orderDetail.category ===
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
                                                orderDetail.category === "Clothing"
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
                                                orderDetail.category ===
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
                                                orderDetail.category === "Fitness"
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
                                        value={orderDetail.price}
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
                                        value={orderDetail.quantity}
                                        onValueChange={(e) =>
                                            onInputNumberChange(e, "quantity")
                                        }
                                    />
                                </div>
                            </div>
                        </Dialog>
                        <Dialog
                            visible={deleteOrderDetailDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteOrderDetailDialogFooter}
                            onHide={hideDeleteOrderDetailDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {orderDetail && (
                                    <span>
                                        Are you sure you want to delete{" "}
                                        <b>{orderDetail.name}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>
                        <Dialog
                            visible={deleteOrderDetailsDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteOrderDetailsDialogFooter}
                            onHide={hideDeleteOrderDetailsDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {orderDetail && (
                                    <span>
                                        Are you sure you want to delete the
                                        selected order details?
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
