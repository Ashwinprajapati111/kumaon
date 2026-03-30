import Admin_test from './Admin_test';
import React, { useState, useMemo } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import './Mycss.css';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
function Component1() {
    return <h2>This is Component 1</h2>;
}

function Component2() {
    return <h2>This is Component 2</h2>;
}

function Component3() {
    return <h2>This is Component 3</h2>;
}

export default function Example() {
    const [galleries, setGalleries] = useState([
        {
            id: 1,
            title: "Organic Farming Workshop",
            year: 2026,
            date: "2026-02-15",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 2,
            title: "Honey Harvest Event",
            year: 2025,
            date: "2025-01-10",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 3,
            title: "Village Awareness Program",
            year: 2024,
            date: "2024-03-12",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 4,
            title: "Organic Expo",
            year: 2026,
            date: "2026-01-20",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 5,
            title: "Organic Farming Workshop",
            year: 2026,
            date: "2026-02-15",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 6,
            title: "Honey Harvest Event",
            year: 2025,
            date: "2025-01-10",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 7,
            title: "Village Awareness Program",
            year: 2024,
            date: "2024-03-12",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 8,
            title: "Organic Expo",
            year: 2026,
            date: "2026-01-20",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 9,
            title: "Organic Farming Workshop",
            year: 2026,
            date: "2026-02-15",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 10,
            title: "Honey Harvest Event",
            year: 2025,
            date: "2025-01-10",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 11,
            title: "Village Awareness Program",
            year: 2024,
            date: "2024-03-12",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
        {
            id: 12,
            title: "Organic Expo",
            year: 2026,
            date: "2026-01-20",
            thumbnail: "../images/Raw Java Plum/01.jpg",
        },
    ]);

    const [filterYear, setFilterYear] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    // Unique Years
    const years = [...new Set(galleries.map((g) => g.year))];

    // Delete Gallery
    const handleDelete = (id) => {
        if (window.confirm("Delete this gallery?")) {
            setGalleries(galleries.filter((g) => g.id !== id));
        }
    };

    // Edit Gallery
    const handleEdit = (id) => {
        alert("Edit Gallery ID: " + id);
    };

    // Filter + Sort Logic
    const filteredData = useMemo(() => {
        let data = [...galleries];

        if (filterYear !== "All") {
            data = data.filter((g) => g.year === Number(filterYear));
        }

        data.sort((a, b) =>
            sortOrder === "latest"
                ? new Date(b.date) - new Date(a.date)
                : new Date(a.date) - new Date(b.date)
        );

        return data;
    }, [galleries, filterYear, sortOrder]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="bg-gray-100">
            <div>
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">View Photo Galleries</h1>
                        <button className="flex bg-[#d1a345] text-black px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-yellow-700 transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>

                            Add Gallery
                        </button>
                    </div>


                    <section aria-labelledby="products-heading" className="pt-6 pb-24">
                        <div className="min-h-screen bg-gray-100 p-1">
                            <div className="bg-white shadow-xl rounded-2xl p-4 max-w-6xl mx-auto">
                                {/* Filters */}
                                <div className="flex flex-wrap gap-4 mb-6">
                                    <select
                                        value={filterYear}
                                        onChange={(e) => {
                                            setFilterYear(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="border p-2 rounded-lg"
                                    >
                                        <option value="All">All Years</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={sortOrder}
                                        onChange={(e) => {
                                            setSortOrder(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="border p-2 rounded-lg"
                                    >
                                        <option value="latest">Latest</option>
                                        <option value="oldest">Oldest</option>
                                    </select>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="tabtop text-black">
                                                <th className="p-3">Thumbnail</th>
                                                <th className="p-3 text-left">Title</th>
                                                <th className="p-3 text-center">Year</th>
                                                <th className="p-3 text-center">Date</th>
                                                <th className="p-3 text-center">Date</th>
                                                <th className="p-3 text-center">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paginatedData.map((gallery) => (
                                                <tr key={gallery.id} className="border-b hover:bg-gray-50">

                                                    {/* Thumbnail */}
                                                    <td className="p-3 text-center">
                                                        <img
                                                            src={gallery.thumbnail}
                                                            alt="thumbnail"
                                                            className="h-16 w-16 object-cover rounded-lg mx-auto"
                                                        />
                                                    </td>

                                                    <td className="p-3">{gallery.title}</td>
                                                    <td className="p-3 text-center">{gallery.year}</td>
                                                    <td className="p-3 text-center">{gallery.date}</td>
                                                    <td className="p-3 text-center">{gallery.date}</td>

                                                    {/* Actions */}
                                                    <td className="p-3 text-center">
                                                        <div className="flex justify-center gap-4 text-lg">
                                                            <button
                                                                onClick={() => handleEdit(gallery.id)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                <FaEdit />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(gallery.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </td>

                                                </tr>
                                            ))}

                                            {paginatedData.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="text-center p-4 text-gray-500">
                                                        No Galleries Found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center mt-6 gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        Prev
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`px-4 py-2 rounded ${currentPage === index + 1
                                                ? "tabtop text-black"
                                                : "bg-gray-200"
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>

                            </div>
                        </div>


                    </section>
                </main>
            </div>
        </div >
    )
}
