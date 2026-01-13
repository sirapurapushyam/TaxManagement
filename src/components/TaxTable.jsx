import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import GenderBadge from "./GenderBadge";
import ColumnFilter from "./ColumnFilter";
import Spinner from "./Spinner";
import { Pencil, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

const columnHelper = createColumnHelper();

const SortableHeader = ({ column, title }) => {
  const sortState = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
    >
      <span>{title}</span>

      {sortState === "asc" && <ChevronUp className="h-4 w-4" />}

      {sortState === "desc" && <ChevronDown className="h-4 w-4" />}

      {!sortState && <ChevronsUpDown className="h-4 w-4 text-gray-400" />}
    </button>
  );
};

// const TextFilter = ({ column, placeholder }) => (
//   <input
//     value={column.getFilterValue() ?? ""}
//     onChange={(e) => column.setFilterValue(e.target.value)}
//     placeholder={placeholder}
//     className="mt-1 w-full border rounded px-2 py-1 text-xs"
//   />
// );

const multiSelectFilter = (row, columnId, filterValue) => {
  if (!filterValue || filterValue.length === 0) return true;
  const value = row.getValue(columnId);
  return filterValue.includes(value);
};


const globalFilterFn = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (!value) return false;

  return String(value)
    .toLowerCase()
    .includes(String(filterValue).toLowerCase());
};


const TaxTable = ({ data, isLoading, onEdit }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const countryOptions = useMemo(
    () => [...new Set(data.map((item) => item.country))].filter(Boolean),
    [data]
  );


  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <div>
            <SortableHeader column={column} title="Entity" />
            {/* <TextFilter column={column} placeholder="Search entity..." /> */}
          </div>
        ),
        cell: (info) => (
          <span className="text-primary-600 font-medium cursor-pointer">
            {info.getValue() || "-"}
          </span>
        ),
      }),

      columnHelper.accessor("gender", {
        header: ({ column }) => (
          <SortableHeader column={column} title="Gender" />
        ),
        cell: (info) => <GenderBadge gender={info.getValue()} />,
      }),
      columnHelper.accessor(
        (row) => {
          if (!row.requestDate) return Number.POSITIVE_INFINITY; // ⬅️ KEY
          return new Date(row.requestDate).getTime();
        },
        {
          id: "requestDate",

          header: ({ column }) => (
            <SortableHeader column={column} title="Request Date" />
          ),

          sortingFn: "basic",

          cell: ({ row }) => {
            const value = row.original.requestDate;
            if (!value) return <span className="text-gray-400">-</span>;

            return new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          },
        }
      ),



//       columnHelper.accessor("requestDate", {
//   header: ({ column }) => (
//     <SortableHeader column={column} title="Request Date" />
//   ),
//   cell: ({ getValue }) => {
//     const value = getValue();
//     if (!value) return "-";
//     return new Date(value).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   },
//   sortingFn: (rowA, rowB, columnId) => {
//     const a = new Date(rowA.getValue(columnId) || 0);
//     const b = new Date(rowB.getValue(columnId) || 0);
//     return a - b;
//   },
// }),
      columnHelper.accessor("country", {
        header: ({ column }) => (
          <div className="flex items-center  gap-2">
            <SortableHeader column={column} title="Country" />

            <ColumnFilter
              options={countryOptions}
              selectedOptions={column.getFilterValue() || []}
              onChange={(value) =>
                column.setFilterValue(value.length ? value : undefined)
              }
            />
          </div>
        ),

        filterFn: multiSelectFilter,
      }),

      columnHelper.display({
        id: "actions",
        header: () => (
    <span className="text-gray-600 font-medium">Actions</span>
  ),
        cell: ({ row }) => (
          <button
            onClick={() => onEdit(row.original)}
            className="p-2 text-gray-400 hover:text-blue-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
        ),
      }),
    ],
    [countryOptions, onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, pagination, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
 globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
<div className="px-6 py-4 border-b bg-gray-50">
  <input
    type="text"
    value={globalFilter ?? ""}
    onChange={(e) => setGlobalFilter(e.target.value)}
    placeholder="Search all columns..."
    className="
      w-full
      px-4 py-2
      border
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
    "
  />
</div>


      <table className="w-full min-w-[700px]">
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} className="px-6 py-4 bg-gray-200 border-r border-gray-200 last:border-r-0">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {console.log(row.getValue("requestDate"))}
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4  border-r border-gray-200 last:border-r-0">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>


      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t">
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"<<"}
          </button>

          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {"<"}
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {">"}
          </button>

          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            {">>"}
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
            <strong>{table.getPageCount()}</strong>
          </span>

          <span>| Go to page:</span>

          <input
            type="number"
            min={1}
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 border rounded px-2 py-1"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Rows per page:</span>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border rounded px-2 py-1"
          >
            {[5, 10,20,30, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaxTable;
