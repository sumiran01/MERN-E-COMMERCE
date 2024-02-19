import { Column } from "react-table";
import TableHOC from "../../Components/tableHOC"



interface DataTypes{
    id: string;
    quantity: number;
    discount: number;
    amount: number;
    status: string;
}



const columns: Column<DataTypes>[]=[
    {
    Header: 'Id',
    accessor: 'id',
},
    {
    Header: 'Quantity',
    accessor: 'quantity',
},
    {
    Header: 'Discount',
    accessor: 'discount',
},
    {
    Header: 'Amount',
    accessor: 'amount',
},
    {
    Header: 'Status',
    accessor: 'status',
},
];

const DashboardTables = ({data=[]}:{data: DataTypes[]}) => {
  return TableHOC <DataTypes> ( columns,data, "transaction-box", "Top Transaction", 
  )();
}

export default DashboardTables