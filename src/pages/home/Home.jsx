// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Layers, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Organize Your Tasks.  
            <span className="block text-indigo-200">Boost Your Productivity.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-indigo-100">
            TaskFlow helps you manage work, track progress, and hit deadlines —
            all in one streamlined platform.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/todos"
              className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            <Link
              to="/dashboard"
              className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-400 transition"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            Why Choose TaskFlow?
          </h2>
          <p className="text-center text-gray-500 mt-3 max-w-2xl mx-auto">
            Designed to make task management simple, fast, and effective for teams and individuals.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon={<Layers className="text-indigo-600" size={36} />}
              title="Organized Workflow"
              description="Categorize and prioritize tasks to keep everything in order."
            />
            <FeatureCard
              icon={<Clock className="text-indigo-600" size={36} />}
              title="Deadline Management"
              description="Stay ahead with due dates, reminders, and progress tracking."
            />
            <FeatureCard
              icon={<Zap className="text-indigo-600" size={36} />}
              title="Fast & Responsive"
              description="Enjoy a smooth experience on any device, anywhere."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800">About TaskFlow</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            TaskFlow is a modern task management solution that helps you organize your work,
            streamline collaboration, and deliver projects on time. Whether you're a solo professional
            or part of a large team, TaskFlow adapts to your workflow.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Start Managing Your Tasks Today</h2>
          <p className="mt-4 text-lg text-indigo-100">
            Join TaskFlow and experience stress-free task management.
          </p>
          <Link
            to="/todos"
            className="inline-flex items-center mt-6 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
