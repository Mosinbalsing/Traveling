import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function PageHeader({ title, breadcrumbs }) {
  return (
    <div className="relative h-[300px] w-full overflow-hidden mt-[-46px]">
      {/* Background Image */}
      <img
        src="assets/images/bg/3.jpg"
        alt="Services background"
        className="absolute inset-0 h-full w-full object-cover brightness-75"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <h1 className="mb-6 text-4xl font-bold tracking-wider">{title}</h1>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className= "bgt absolute bottom-0 px-4 h-[50px] flex justify-center">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center font-bold text-[14px]">
                <Link
                  to={item.path}
                  className={`text-sm ${index === breadcrumbs.length - 1 ? "text-orange-500" : "text-white hover:text-orange-300"}`}
                >
                  {item.label}
                </Link>
                {index < breadcrumbs.length - 1 && <span className="ml-2 text-white">{<ChevronRight />}</span>}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

export default PageHeader;
