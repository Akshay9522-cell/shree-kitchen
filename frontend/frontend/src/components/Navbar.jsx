import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {

  const [search, setSearch] =
    useState("");

  const navigate =
    useNavigate();

  const handleSearch = (e) => {

    e.preventDefault();

    navigate(
      `/?keyword=${search}`
    );

  };

  return (
    <nav className="bg-white shadow-md px-6 py-4">

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

        <Link
          to="/"
          className="text-2xl font-bold"
        >
          Shree Kitchen
        </Link>

        {/* Search Bar */}

        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-xl"
        >

          {/* <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border rounded-lg px-4 py-2"
          /> */}

        </form>

        {/* Navigation */}

        <div className="flex gap-6">

          <Link to="/">
            Home
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </nav>
  );
}