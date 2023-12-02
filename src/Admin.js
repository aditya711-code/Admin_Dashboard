import { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
const Admin = () => {
  let emptyDetails = {
    id: null,
    name: "",
    email: "",
    role: "",
  };
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.IN },
    role: { value: null, matchMode: FilterMatchMode.IN },
  });
  const [memberDialog, setMemberDialog] = useState(false);
  const [deletememberDialog, setDeleteMemberDialog] = useState(false);
  const [deletemembersDialog, setDeleteMembersDialog] = useState(false);
  const [member, setMember] = useState(emptyDetails);
  const [selectedMembers, setSelectedMembers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const getData = async () => {
    const response = await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    const data = await response.json();
    console.log("data", data);
    setMembers(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilter(value);
  };

  const searchMembers = (
    <div className='flex flex-wrap gap-2 align-items-center justify-content-between'>
      <Button
        label='Delete'
        icon='pi pi-trash'
        severity='danger'
        onClick={() => setDeleteMembersDialog(true)}
        disabled={!selectedMembers || !selectedMembers.length}
      />
      <span className='p-input-icon-left'>
        <i className='pi pi-search' />
        <InputText
          type='search'
          onChange={onGlobalFilterChange}
          placeholder='Search..'
        />
      </span>
    </div>
  );

  const editMember = (member) => {
    setMember({ ...member });
    setMemberDialog(true);
  };
  const hideDialog = () => {
    setSubmitted(false);
    setMemberDialog(false);
  };
  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < members.length; i++) {
      if (members[i].id == id) {
        index = i;
        break;
      }
    }
    return index;
  };
  const saveMember = () => {
    setSubmitted(true);
    console.log("member", member);
    if (member.name.trim()) {
      let _members = [...members];
      let _member = { ...member };
      if (member.id) {
        const index = findIndexById(member.id);
        _members[index] = _member;

        _member[index] = _member;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detial: "Member details updated",
          life: 3000,
        });
      }
      setMembers(_members);
      setMemberDialog(false);
      setMember(emptyDetails);
    }
  };

  const confirmDeleteMember = (member) => {
    setMember(member);
    setDeleteMemberDialog(true);
  };
  const deleteMember = () => {
    let _members = members.filter((val) => val.id != member.id);
    setMembers(_members);
    setDeleteMemberDialog(false);
    setMember(emptyDetails);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Member Deleted",
      life: 3000,
    });
  };
  const deleteSelectedMembers = () => {
    let _members = members.filter((val) => !selectedMembers.includes(val));
    setMembers(_members);
    setDeleteMembersDialog(false);
    setSelectedMembers(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Members Deleted",
      life: 3000,
    });
  };

  const memberDialogFooter = (
    <>
      <Button label='cancel' icon='pi pi-times' outlined onClick={hideDialog} />
      <Button
        label='save'
        icon='pi pi-check'
        severity='danger'
        outlined
        onClick={saveMember}
      />
    </>
  );
  const hideDeleteMemberDialog = () => {
    setDeleteMemberDialog(false);
  };

  const hideDeleteMembersDialog = () => {
    setDeleteMembersDialog(false);
  };

  const deleteMemberDialogFooter = (
    <>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={hideDeleteMemberDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        outlined
        onClick={
          deletememberDialog == true ? deleteMember : deleteSelectedMembers
        }
      />
    </>
  );

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _member = { ...member };
    _member[`${name}`] = val;

    setMember(_member);
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon='pi pi-pencil'
          rounded
          outlined
          className='mr-2 edit'
          onClick={() => editMember(rowData)}
        />
        <Button
          icon='pi pi-trash'
          rounded
          outlined
          severity='danger'
          className='mr-2 delete'
          onClick={() => confirmDeleteMember(rowData)}
        />
      </>
    );
  };
  return (
    <div>
      <h3 className='header' style={{ textAlign: "center", color: "#0f0f0f" }}>
        Admin Dashboard
      </h3>
      <Toast ref={toast} />
      <div className=' card'>
        <DataTable
          ref={dt}
          selection={selectedMembers}
          value={members}
          onSelectionChange={(e) => setSelectedMembers(e.value)}
          dataKey='id'
          selectionPageOnly
          paginator
          showGridlines
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} members'
          filters={filters}
          globalFilterFields={["name", "email", "role"]}
          header={searchMembers}
          tableStyle={{ minWidth: "50rem", maxWidth: "100vw" }}
        >
          <Column selectionMode='multiple' exportable={false}></Column>
          <Column
            field='name'
            header='Name'
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field='email'
            header='Email'
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column field='role' header='Role'></Column>
          <Column
            header='Actions'
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "2rem" }}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        visible={memberDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header='Member Details'
        modal
        className='p-fluid'
        footer={memberDialogFooter}
        onHide={hideDialog}
      >
        <div className='field'>
          <label htmlFor='name' className='font-bold'>
            Name
          </label>
          <InputText
            id='name'
            value={member.name}
            onChange={(e) => onInputChange(e, "name")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !member.name })}
          />
          {submitted && !member.name && (
            <small className='p-err'>Name is required</small>
          )}
        </div>
        <div className='field'>
          <label htmlFor='email' className='font-bold'>
            Email
          </label>
          <InputText
            id='email'
            value={member.email}
            onChange={(e) => onInputChange(e, "email")}
            required
            className={classNames({ "p-invalid": submitted && !member.email })}
          />
          {submitted && !member.email && (
            <small className='p-err'>Email is required</small>
          )}
        </div>
        <div className='field'>
          <label htmlFor='email' className='font-bold'>
            Role
          </label>
          <InputText
            id='role'
            value={member.role}
            onChange={(e) => onInputChange(e, "role")}
            required
            className={classNames({ "p-invalid": submitted && !member.role })}
          />
          {submitted && !member.role && (
            <small className='p-err'>Role is required</small>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={deletememberDialog || deletemembersDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header='Confirm'
        modal
        footer={deleteMemberDialogFooter}
        onHide={
          deletememberDialog == true
            ? hideDeleteMemberDialog
            : deletememberDialog
            ? hideDeleteMembersDialog
            : true
        }
      >
        <div className='confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-3'
            style={{ fontSize: "2rem" }}
          />
          {member && (
            <span>
              Are you sure you want to delete <b>{member.name}</b>
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};
export default Admin;
