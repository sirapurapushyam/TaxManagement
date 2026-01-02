import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import GenderBadge from './GenderBadge';
import ColumnFilter from './ColumnFilter';
import Spinner from './Spinner';

const columnHelper = createColumnHelper();

const multiSelectFilter = (row, columnId, filterValue) => {
  if (!filterValue || filterValue.length === 0) return true;
  const value = row.getValue(columnId);
  return filterValue.includes(value);
};

const TaxTable = ({ data, isLoading, onEdit }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const countryOptions = useMemo(() => {
    return [...new Set(data.map((item) => item.country))].filter(Boolean);
  }, [data]);

  const columns = useMemo(
    () => [
      // Using 'name' field - this is what gets updated in the modal
      columnHelper.accessor('name', {
        header: () => <span className="text-gray-600">Entity</span>,
        cell: (info) => (
          <span className="text-primary-600 font-medium hover:text-primary-700 cursor-pointer">
            {info.getValue() || '-'}
          </span>
        ),
      }),
      columnHelper.accessor('gender', {
        header: () => <span className="text-gray-600">Gender</span>,
        cell: (info) => <GenderBadge gender={info.getValue()} />,
      }),
      columnHelper.accessor('requestDate', {
        header: () => <span className="text-gray-600">Request date</span>,
        cell: (info) => {
          const value = info.getValue();
          if (!value) return <span className="text-gray-400">-</span>;
          
          const date = new Date(value);
          return (
            <span className="text-gray-600">
              {date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          );
        },
      }),
      columnHelper.accessor('country', {
        header: ({ column }) => (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Country</span>
            <ColumnFilter
              options={countryOptions}
              selectedOptions={(column.getFilterValue()) || []}
              onChange={(value) => column.setFilterValue(value.length ? value : undefined)}
            />
          </div>
        ),
        cell: (info) => (
          <span className="text-gray-700">{info.getValue() || '-'}</span>
        ),
        filterFn: multiSelectFilter,
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={() => onEdit(row.original)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            title="Edit"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        ),
      }),
    ],
    [countryOptions, onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/80"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="mt-4 text-gray-500 font-medium">No data available</p>
                    <p className="mt-1 text-gray-400 text-sm">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50/50 transition-colors duration-150 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{' '}
          <span className="font-medium">{data.length}</span> results
        </p>
        {columnFilters.length > 0 && (
          <button
            onClick={() => setColumnFilters([])}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            type="button"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TaxTable;