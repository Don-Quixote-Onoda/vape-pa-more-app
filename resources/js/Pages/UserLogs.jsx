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

export default function UserLogs(props) {

    const [userLogs, setUserLogs] = useState([]);

    useEffect(() => {
        setUserLogs(props.userlogs);
        console.log(userLogs);
    }, []);

    let emptyUserLog = {
        id: null,
        order_detail_id: null,
        payment_id: null,
        user_id: null,
    };

    const [userLogDialog, setUserLogDialog] = useState(false);
    const [deleteUserLogDialog, setDeleteUserLogDialog] = useState(false);
    const [deleteUserLogsDialog, setDeleteUserLogsDialog] = useState(false);
    const [userLog, setUserLog] = useState(emptyUserLog);
    const [selectedUserLogs, setSelectedUserLogs] = useState(null);
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
        setUserLog(emptyUserLog);
        setSubmitted(false);
        setUserLogDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserLogDialog(false);
    };

    const hideDeleteUserLogDialog = () => {
        setDeleteUserLogDialog(false);
    };

    const hideDeleteUserLogsDialog = () => {
        setDeleteUserLogsDialog(false);
    };

    const saveUserLog = () => {
        setSubmitted(true);

        if (userLog.name.trim()) {
            let _userLogs = [...userLogs];
            let _userLog = { ...userLog };

            if (userLog.id) {
                const index = findIndexById(userLog.id);

                _userLogs[index] = _userLog;
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "UserLog Updated",
                    life: 3000,
                });
            } else {
                _userLog.id = createId();
                _userLog.image = "userLog-placeholder.svg";
                _userLogs.push(_userLog);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "UserLog Created",
                    life: 3000,
                });
            }

            setUserLogs(_userLogs);
            setUserLogDialog(false);
            setUserLog(emptyUserLog);
        }
    };

    const editUserLog = (userLog) => {
        setUserLog({ ...userLog });
        setUserLogDialog(true);
    };

    const confirmDeleteUserLog = (userLog) => {
        setUserLog(userLog);
        setDeleteUserLogDialog(true);
    };

    const deleteUserLog = () => {
        let _userLogs = userLogs.filter((val) => val.id !== userLog.id);

        setUserLogs(_userLogs);
        setDeleteUserLogDialog(false);
        setUserLog(emptyUserLog);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "UserLog Deleted",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < userLogs.length; i++) {
            if (userLogs[i].id === id) {
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
        { field: "payment_id", header: "Payment ID" },
        { field: "user_id", header: "User ID" },
    ];

    const exportColumns = cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
    }));

    const exportPdf = () => {
        import("jspdf").then((jsPDF) => {
            import("jspdf-autotable").then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, userLogs);
                doc.save("userLogs.pdf");
            });
        });
    };

    const confirmDeleteSelected = () => {
        setDeleteUserLogsDialog(true);
    };

    const deleteSelectedUserLogs = () => {
        let _userLogs = userLogs.filter(
            (val) => !selectedUserLogs.includes(val)
        );

        setUserLogs(_userLogs);
        setDeleteUserLogsDialog(false);
        setSelectedUserLogs(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "UserLogs Deleted",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _userLog = { ...userLog };

        _userLog["category"] = e.value;
        setUserLog(_userLog);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _userLog = { ...userLog };

        _userLog[`${name}`] = val;

        setUserLog(_userLog);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _userLog = { ...userLog };

        _userLog[`${name}`] = val;

        setUserLog(_userLog);
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
                    disabled={!selectedUserLogs || !selectedUserLogs.length}
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
                src={`https://primefaces.org/cdn/primereact/images/userLog/${rowData.image}`}
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
                    onClick={() => editUserLog(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteUserLog(rowData)}
                />
            </React.Fragment>
        );
    };

    const getSeverity = (userLog) => {
        switch (userLog.inventoryStatus) {
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
    const userLogDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={hideDialog}
            />
            <Button label="Save" icon="pi pi-check" onClick={saveUserLog} />
        </React.Fragment>
    );
    const deleteUserLogDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteUserLogDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteUserLog}
            />
        </React.Fragment>
    );
    const deleteUserLogsDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteUserLogsDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteSelectedUserLogs}
            />
        </React.Fragment>
    );

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 classNameName="font-semibold text-xl text-gray-800 leading-tight">
                    UserLogs
                </h2>
            }
        >
            <div className="container px-6 mx-auto grid">
                <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    UserLogs
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
                                value={userLogs}
                                selection={selectedUserLogs}
                                onSelectionChange={(e) =>
                                    setSelectedUserLogs(e.value)
                                }
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} userLogs"
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
                                    field="payment_id"
                                    header="Payment ID"
                                    sortable
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    field="user_id"
                                    header="User ID"
                                    sortable
                                    style={{ minWidth: "10rem" }}
                                ></Column>
                                <Column
                                    body={actionBodyTemplate}
                                    exportable={false}
                                    style={{ minWidth: "12rem" }}
                                ></Column>
                            </DataTable>
                        </div>
                        <Dialog
                            visible={userLogDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="UserLog Details"
                            modal
                            className="p-fluid"
                            footer={userLogDialogFooter}
                            onHide={hideDialog}
                        >
                            {userLog.image && (
                                <img
                                    src={`https://primefaces.org/cdn/primereact/images/userLog/${userLog.image}`}
                                    alt={userLog.image}
                                    className="userLog-image block m-auto pb-3"
                                />
                            )}
                            <div className="field">
                                <label htmlFor="name" className="font-bold">
                                    Name
                                </label>
                                <InputText
                                    id="name"
                                    value={userLog.name}
                                    onChange={(e) => onInputChange(e, "name")}
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !userLog.name,
                                    })}
                                />
                                {submitted && !userLog.name && (
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
                                    value={userLog.description}
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
                                                userLog.category ===
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
                                                userLog.category === "Clothing"
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
                                                userLog.category ===
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
                                                userLog.category === "Fitness"
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
                                        value={userLog.price}
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
                                        value={userLog.quantity}
                                        onValueChange={(e) =>
                                            onInputNumberChange(e, "quantity")
                                        }
                                    />
                                </div>
                            </div>
                        </Dialog>

                        <Dialog
                            visible={deleteUserLogDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteUserLogDialogFooter}
                            onHide={hideDeleteUserLogDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {userLog && (
                                    <span>
                                        Are you sure you want to delete{" "}
                                        <b>{userLog.name}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>
                        <Dialog
                            visible={deleteUserLogsDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteUserLogsDialogFooter}
                            onHide={hideDeleteUserLogsDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {userLog && (
                                    <span>
                                        Are you sure you want to delete the
                                        selected userLogs?
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
