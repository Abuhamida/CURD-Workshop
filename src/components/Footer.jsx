import { Link } from 'react-router-dom'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-2 text-center">
      <p className="">
        © {new Date().getFullYear()} Task Manager. All rights reserved.
      </p>
    </footer>
  )
}
