import React from "react";
import Link from "next/link";
import { Category } from "@/data/blogData";

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <ul className="category-list list-unstyled mb-0">
      {categories.map((category) => (
        <li key={category.name} className="d-flex align-items-center mb-2">
          <Link
            href={`/blog/category/${category.name.toLowerCase()}`}
            className="d-flex justify-content-between align-items-center w-100 px-3 py-2 rounded bg-light text-dark text-decoration-none category-link"
            style={{ transition: 'background 0.2s' }}
          >
            <span>{category.name}</span>
            <span className="badge bg-primary text-white ms-2">{category.count}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
