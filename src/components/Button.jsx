/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import React from 'react';

const Button = ({ href, children, variant = 'primary', className = '' }) => {
  const baseStyles = 'inline-block px-4 py-2 rounded-md transition-colors font-medium !text-white';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 shadow-sm',
    outline: 'border-2 border-white hover:bg-white hover:!text-emerald-700',
  };

  return (
    <a href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </a>
  );
};

export default Button;
