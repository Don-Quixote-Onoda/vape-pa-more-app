import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
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
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useForm } from "@inertiajs/react";

export default function Users(props) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(props.users);
        console.log(users);
    }, []);

    let emptyUser = {
        id: null,
        firstname: "",
        lastname: "",
        sex: 0,
        birthdate: null,
        address: "",
        phoneNumber: null,
        email: null,
        role: "",
        password: null,
        confirm_password: null,
        image: null,
    };

    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const { data, setData, post, processing, errors } = useForm(emptyUser);

    const roles = [{ name: "Administrator" }, { name: "Employee" }];

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const saveUser = () => {
        setSubmitted(true);

        if (
            user.image &&
            user.firstname.trim() &&
            user.lastname.trim() &&
            user.sex &&
            user.birthdate &&
            user.address &&
            user.role &&
            user.phoneNumber &&
            user.email &&
            user.confirm_password
        ) {
            let _users = [...users];  
            let _user = { ...user };

            if (user.id) {
                const index = findIndexById(user.id);

                _users[index] = _user;
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Updated",
                    life: 3000,
                });

            } else {
                _user.id = createId();
                _user.image = "user-placeholder.svg";
                _users.push(_user);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Created",
                    life: 3000,
                });
            }
            setData(user);
            post('api/user');
            setUserDialog(false);
            setUser(emptyUser);
        }
        // // console.log('Ok');
        

        

        
    };

    const editUser = (user) => {
        setUser({ ...user });
        setUserDialog(true);
    };
    

    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        let _users = users.filter((val) => val.id !== user.id);

        setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "User Deleted",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
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
        { field: "name", header: "Name" },
        { field: "email", header: "Email" },
        { field: "role", header: "Role" },
    ];

    const exportColumns = cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
    }));

    const exportPdf = () => {
        import("jspdf").then((jsPDF) => {
            import("jspdf-autotable").then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, users);
                doc.save("users.pdf");
            });
        });
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const deleteSelectedUsers = () => {
        let _users = users.filter((val) => !selectedUsers.includes(val));

        setUsers(_users);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Users Deleted",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _user = { ...user };

        _user["sex"] = e.value;

        setUser(_user);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _user = { ...user };

        _user[`${name}`] = val;

        setUser(_user);
    };

    const onRoleChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _user = { ...user };

        _user[`${name}`] = val.name;

        setUser(_user);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _user = { ...user };

        _user[`${name}`] = val;

        setUser(_user);
    };

    const confirmPassword = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _user = { ...user };

        if(user.password == val) {
            _user[`${name}`] = val;
        }

        setUser(_user);
    }

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
                    disabled={!selectedUsers || !selectedUsers.length}
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
                src={`http://127.0.0.1:8000/uploads/${rowData.image}`}
                alt={rowData.image}
                className="shadow-2 border-round"
                style={{ width: "64px" }}
            />
        );
    };

    const handleFileUpload = (e, name) => {
        const val = (e.target && e.target.files[0]) || "";
        let _user = { ...user };

        _user[`${name}`] = val;
        setUser(_user);

        console.log(_user);

    }

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
                    onClick={() => editUser(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteUser(rowData)}
                />
            </React.Fragment>
        );
    };

    const getSeverity = (user) => {
        switch (user.inventoryStatus) {
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
    const userDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={hideDialog}
            />
            <Button label="Save" icon="pi pi-check" onClick={saveUser} />
        </React.Fragment>
    );
    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteUserDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteUser}
            />
        </React.Fragment>
    );
    const deleteUsersDialogFooter = (
        <React.Fragment>
            <Button
                label="No"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteUsersDialog}
            />
            <Button
                label="Yes"
                icon="pi pi-check"
                severity="danger"
                onClick={deleteSelectedUsers}
            />
        </React.Fragment>
    );

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 classNameName="font-semibold text-xl text-gray-800 leading-tight">
                    Users
                </h2>
            }
        >
            <div className="container px-6 mx-auto grid">
                <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                    Users
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
                                value={users}
                                selection={selectedUsers}
                                onSelectionChange={(e) =>
                                    setSelectedUsers(e.value)
                                }
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                                globalFilter={globalFilter}
                                header={header}
                            >
                                <Column
                                    selectionMode="multiple"
                                    exportable={false}
                                ></Column>
                                 <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                                <Column
                                    field="firstname"
                                    header="First Name"
                                    sortable
                                    style={{ minWidth: "16rem" }}
                                ></Column>
                                <Column
                                    field="lastname"
                                    header="Last Name"
                                    sortable
                                    style={{ minWidth: "16rem" }}
                                ></Column>
                                <Column
                                    field="address"
                                    header="Address"
                                    sortable
                                    style={{ minWidth: "16rem" }}
                                ></Column>
                                <Column
                                    field="phone_number"
                                    header="Phone Number"
                                    sortable
                                    style={{ minWidth: "16rem" }}
                                ></Column>
                                <Column
                                    field="birthdate"
                                    header="Birthdate"
                                    sortable
                                    style={{ minWidth: "16rem" }}
                                ></Column>
                                <Column
                                    field="email"
                                    header="Email"
                                    sortable
                                    style={{ minWidth: "8rem" }}
                                ></Column>
                                <Column
                                    field="sex"
                                    header="Sex"
                                    sortable
                                    style={{ minWidth: "10rem" }}
                                ></Column>
                                <Column
                                    field="role"
                                    header="Role"
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
                            visible={userDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="User Details"
                            modal
                            className="p-fluid"
                            footer={userDialogFooter}
                            onHide={hideDialog}
                        >
                            <div className="field">
                            <label className="">User Image</label>
                            <input
                                type="file"
                                className={`w-full px-4 py-2 ${classNames({
                                    "p-invalid":
                                        submitted && !user.image,
                                })}`}
                                label="Image"
                                name="image"
                                onChange={(e) =>
                                    handleFileUpload(e, "image")
                                }
                            />
                                {submitted && !user.image && (
                                    <small className="p-error">
                                        User Image is required.
                                    </small>
                                )}
                            </div>
                            <div className="field">
                                <label
                                    htmlFor="firstname"
                                    className="font-bold"
                                >
                                    First Name
                                </label>
                                <InputText
                                    id="firstname"
                                    value={user.firstname}
                                    onChange={(e) =>
                                        onInputChange(e, "firstname")
                                    }
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid":
                                            submitted && !user.firstname,
                                    })}
                                />
                                {submitted && !user.firstname && (
                                    <small className="p-error">
                                        First Name is required.
                                    </small>
                                )}
                            </div>
                            <div className="field">
                                <label htmlFor="lastname" className="font-bold">
                                    Last Name
                                </label>
                                <InputText
                                    id="lastname"
                                    value={user.lastname}
                                    onChange={(e) =>
                                        onInputChange(e, "lastname")
                                    }
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid":
                                            submitted && !user.lastname,
                                    })}
                                />
                                {submitted && !user.lastname && (
                                    <small className="p-error">
                                        Last Name is required.
                                    </small>
                                )}
                            </div>
                            <div className="field mb-5">
                                <label className="mb-3 font-bold">Sex</label>
                                <div className="field-radiobutton col-6">
                                    <RadioButton
                                        inputId="sex1"
                                        name="sex"
                                        value="Male"
                                        onChange={onCategoryChange}
                                        checked={user.sex === "Male"}
                                        className={classNames({
                                            "p-invalid": submitted && !user.sex,
                                        })}
                                    />
                                    <label htmlFor="sex1" className="ml-1">
                                        Male
                                    </label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton
                                        inputId="sex2"
                                        name="sex"
                                        value="Female"
                                        onChange={onCategoryChange}
                                        checked={user.sex === "Female"}
                                        className={classNames({
                                            "p-invalid": submitted && !user.sex,
                                        })}
                                    />
                                    <label htmlFor="sex2" className="ml-1">
                                        Female
                                    </label>
                                </div>
                                {submitted && !user.sex && (
                                    <small className="p-error">
                                        Sex is required.
                                    </small>
                                )}
                            </div>
                            <div className="field mb-5">
                                <label htmlFor="last" className="font-bold">
                                    Birthdate
                                </label>
                                <Calendar
                                    id="last"
                                    value={user.birthdate}
                                    onChange={(e) =>
                                        onInputChange(e, "birthdate")
                                    }
                                    className={classNames({
                                        "p-invalid": submitted && !user.birthdate,
                                    })}
                                />
                                {submitted && !user.birthdate && (
                                    <small className="p-error">
                                        Birthdate is required.
                                    </small>
                                )}
                            </div>

                            <div className="field mb-5">
                                <label htmlFor="address" className="font-bold">
                                    Address
                                </label>
                                <InputText
                                    id="address"
                                    value={user.address}
                                    onChange={(e) =>
                                        onInputChange(e, "address")
                                    }
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !user.address,
                                    })}
                                />
                                {submitted && !user.address && (
                                    <small className="p-error">
                                        Address is required.
                                    </small>
                                )}
                            </div>

                            <div className="field mb-5">
                                <label htmlFor="email" className="font-bold">
                                    Role
                                </label>
                                <Dropdown
                                    value={user.role}
                                    onChange={(e) => onRoleChange(e, "role")}
                                    options={roles}
                                    optionLabel="name"
                                    editable
                                    placeholder="Select a City"
                                    className={`w-full md:w-14rem ${classNames({
                                        "p-invalid": submitted && !user.address,
                                    })} `}
                                />
                                {submitted && !user.sex && (
                                    <small className="p-error">
                                        Role is required.
                                    </small>
                                )}
                            </div>
                            <div className="field mb-5">
                                <label
                                    htmlFor="phoneNumber"
                                    className="font-bold"
                                >
                                    Phone Number
                                </label>
                                <InputNumber
                                    id="phoneNumber"
                                    value={user.phoneNumber}
                                    onChange={(e) =>
                                        onInputNumberChange(e, "phoneNumber")
                                    }
                                    useGrouping={false}
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid":
                                            submitted && !user.phoneNumber,
                                    })}
                                />
                                {submitted && !user.phoneNumber && (
                                    <small className="p-error">
                                        Phone Number is required.
                                    </small>
                                )}
                            </div>
                            <div className="field mb-5">
                                <label htmlFor="email" className="font-bold">
                                    Email Address
                                </label>
                                <InputText
                                    id="email"
                                    value={user.email}
                                    onChange={(e) => onInputChange(e, "email")}
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid": submitted && !user.email,
                                    })}
                                />
                                {submitted && !user.email && (
                                    <small className="p-error">
                                        Email Address is required.
                                    </small>
                                )}
                            </div>

                            <div className="field mb-5">
                                <label htmlFor="password" className="font-bold">
                                    Password
                                </label>
                                <InputText
                                    id="password"
                                    value={user.password}
                                    onChange={(e) =>
                                        onInputChange(e, "password")
                                    }
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid":
                                            submitted && !user.password,
                                    })}
                                />
                                {submitted && !user.password && (
                                    <small className="p-error">
                                        Password is required.
                                    </small>
                                )}
                            </div>

                            <div className="field">
                                <label
                                    htmlFor="confirm_password"
                                    className="font-bold"
                                >
                                    Confirm Password
                                </label>
                                <InputText
                                    id="confirm_password"
                                    value={user.confirm_password}
                                    onChange={(e) =>
                                        confirmPassword(e, "confirm_password")
                                    }
                                    required
                                    autoFocus
                                    className={classNames({
                                        "p-invalid":
                                            submitted && !user.confirm_password,
                                    })}
                                />
                                {submitted && !user.confirm_password && (
                                    <small className="p-error">
                                        Password don't match.
                                    </small>
                                )}
                            </div>
                        </Dialog>

                        <Dialog
                            visible={deleteUserDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteUserDialogFooter}
                            onHide={hideDeleteUserDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {user && (
                                    <span>
                                        Are you sure you want to delete{" "}
                                        <b>{user.name}</b>?
                                    </span>
                                )}
                            </div>
                        </Dialog>
                        <Dialog
                            visible={deleteUsersDialog}
                            style={{ width: "32rem" }}
                            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                            header="Confirm"
                            modal
                            footer={deleteUsersDialogFooter}
                            onHide={hideDeleteUsersDialog}
                        >
                            <div className="confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                />
                                {user && (
                                    <span>
                                        Are you sure you want to delete the
                                        selected users?
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
