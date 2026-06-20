"use client";

import React, { useState, useEffect } from "react";
import { Range } from "react-range";
import { motion, AnimatePresence } from "framer-motion";

export type Category = "Bathroom" | "Backyard" | "Bedroom" | "Kitchen" | "Living Room";

export interface Project {
  id: string;
  title: string;
  imageUrl: string;
  category: Category;
  budget: number;
  link?: string;
}

interface ProjectGridProps {
  projects: Project[];
}

const categories: Category[] = ["Bathroom", "Backyard", "Bedroom", "Kitchen", "Living Room"];

const STEP = 100;
const MIN = 0;
const MAX = 10000;
const MIN_GAP = 1000;
const PROJECTS_PER_PAGE = 6;

const ProjectGridBlock: React.FC<ProjectGridProps> = ({ projects }) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [budgetRange, setBudgetRange] = useState<number[]>([0, 10000]);
  const [page, setPage] = useState(1);

  // Filter logic
  const filteredProjects = projects.filter((project) => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(project.category);
    const budgetMatch = project.budget >= budgetRange[0] && project.budget <= budgetRange[1];
    return categoryMatch && budgetMatch;
  });

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const startIndex = (page - 1) * PROJECTS_PER_PAGE;
  const displayedProjects = filteredProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [selectedCategories, budgetRange]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        padding: "65px",
        flexWrap: "wrap",
      }}
    >
      {/* Sidebar */}
      <div style={{ flex: "0 0 200px" }}>
        <h3 style={{ color: "#ffffff" }}>Filter by Category</h3>
        <ul style={{ listStyle: "none", padding: "10px" }}>
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <li
                key={cat}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                  cursor: "pointer",
                }}
                onClick={() => toggleCategory(cat)}
              >
                <span style={{ flex: 1, color: "#ffffff" }}>{cat}</span>
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "1px solid #555",
                    textAlign: "center",
                    lineHeight: "14px",
                    userSelect: "none",
                    fontSize: "14px",
                    color: "#ffffff",
                    backgroundColor: isSelected ? "#dc2626" : "transparent",
                  }}
                >
                  {isSelected ? "✓" : ""}
                </span>
              </li>
            );
          })}
          {/* Clear all button */}
          <li
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "10px", 
              marginTop: "16px", 
              cursor: "pointer", 
              fontStyle: "italic" 
            }}
            onClick={() => setSelectedCategories([])}
          >
            <span style={{ flex: 1, color: "#aaa" }}>Clear All</span>
          </li>
        </ul>

        {/* Dual-handle budget slider */}
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#ffffff" }}>Budget Range</h3>
          
          {/* Input fields for typing budget values */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#ffffff", fontSize: "12px", display: "block", marginBottom: "5px" }}>
                Min Budget ($)
              </label>
              <input
                type="number"
                value={budgetRange[0]}
                min={MIN}
                max={budgetRange[1] - MIN_GAP}
                step={STEP}
                onChange={(e) => {
                  const value = Math.max(MIN, Math.min(parseInt(e.target.value) || 0, budgetRange[1] - MIN_GAP));
                  setBudgetRange([value, budgetRange[1]]);
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #555",
                  backgroundColor: "#333",
                  color: "#ffffff",
                  fontSize: "14px"
                }}
                placeholder="0"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: "#ffffff", fontSize: "12px", display: "block", marginBottom: "5px" }}>
                Max Budget ($)
              </label>
              <input
                type="number"
                value={budgetRange[1]}
                min={budgetRange[0] + MIN_GAP}
                max={MAX}
                step={STEP}
                onChange={(e) => {
                  const value = Math.min(MAX, Math.max(parseInt(e.target.value) || 0, budgetRange[0] + MIN_GAP));
                  setBudgetRange([budgetRange[0], value]);
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #555",
                  backgroundColor: "#333",
                  color: "#ffffff",
                  fontSize: "14px"
                }}
                placeholder="10000"
              />
            </div>
          </div>

          {/* Slider display */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ color: "#aaa", fontSize: "14px" }}>
              ${budgetRange[0].toLocaleString()} - ${budgetRange[1].toLocaleString()}
            </span>
          </div>
          
          <Range
            step={STEP}
            min={MIN}
            max={MAX}
            values={budgetRange}
            onChange={(vals) => {
              let [minVal, maxVal] = vals;
              if (maxVal - minVal < MIN_GAP) {
                if (minVal !== budgetRange[0]) {
                  minVal = Math.min(maxVal - MIN_GAP, minVal);
                } else {
                  maxVal = Math.max(minVal + MIN_GAP, maxVal);
                }
              }
              setBudgetRange([minVal, maxVal]);
            }}
            renderTrack={({ props, children }) => {
              const [minVal, maxVal] = budgetRange;
              const minPercent = ((minVal - MIN) / (MAX - MIN)) * 100;
              const maxPercent = ((maxVal - MIN) / (MAX - MIN)) * 100;
              
              return (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "6px",
                    width: "100%",
                    backgroundColor: "#555",
                    borderRadius: "3px",
                    marginTop: "18px",
                    background: `linear-gradient(to right, 
                      #888 0%, 
                      #888 ${minPercent}%, 
                      #dc2626 ${minPercent}%, 
                      #dc2626 ${maxPercent}%, 
                      #888 ${maxPercent}%, 
                      #888 100%)`
                  }}
                >
                  {children}
                </div>
              );
            }}
            renderThumb={({ props }) => {
              const { key, ...restProps } = props;
              return (
                <div
                  key={key}
                  {...restProps}
                  style={{
                    ...restProps.style,
                    height: "20px",
                    width: "20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "4px",
                  }}
                />
              );
            }}
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ flex: 1, maxWidth: "750px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            minHeight: "620px", // Fixed layout
            alignContent: "start",
            position: "relative",
          }}
        >
          <AnimatePresence mode="wait">
            {displayedProjects.length > 0 ? (
              displayedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid black",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <div style={{ width: "100%", paddingTop: "65%", position: "relative" }}>
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ padding: "12px" }}>
                    <h4 style={{ margin: "4px 0", fontSize: "1.1rem", color: "#ffffff" }}>
                      {project.title}
                    </h4>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#ffffff",
                          fontSize: "0.9rem",
                          textDecoration: "none",
                          borderBottom: "1px solid #0070f3",
                        }}
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="no-projects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  color: "#aaa",
                  fontSize: "1.1rem",
                  padding: "40px 0",
                }}
              >
                No projects found for this filter.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Invisible placeholders for consistent layout */}
          {displayedProjects.length > 0 &&
            Array.from({ length: PROJECTS_PER_PAGE - displayedProjects.length }).map((_, i) => (
              <div key={`placeholder-${i}`} style={{ opacity: 0, pointerEvents: "none" }}>
                <div style={{ width: "100%", paddingTop: "65%" }}></div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
              gap: "10px",
            }}
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: "8px 14px",
                  backgroundColor: page === i + 1 ? "#b62828ff" : "#333",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectGridBlock;
