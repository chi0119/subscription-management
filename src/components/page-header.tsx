import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-gray-600 mb-5 text-center hidden md:block">
        {title}
      </h1>
      <p className="text-sm text-gray-600 mb-8 text-center">{description}</p>
    </>
  );
};
