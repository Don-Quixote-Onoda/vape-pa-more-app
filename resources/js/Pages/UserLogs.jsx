import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function UserLogs(props) {

    const [userLogs, setUserLogs] = useState([]);

    useEffect(() => {
        // setUserLogs(props.userlogs);
        console.log(props.userlogs);
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


    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </span>
            <Button
                label="Export"
                icon="pi pi-upload"
                className="p-button-help"
                onClick={exportPdf}
            />
        </div>
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
                            {/* <DataTable
                                ref={dt}
                                value={userLogs}
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
                                    field="user_id"
                                    header="User ID"
                                    sortable
                                    style={{ minWidth: "10rem" }}
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
                               
                            </DataTable> */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
