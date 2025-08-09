import { Link } from 'react-router-dom'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 text-center py-2 ">
      <div>
         © {new Date().getFullYear()} TaskStream. All rights reserved.
      </div>
    </footer>
  )
}
