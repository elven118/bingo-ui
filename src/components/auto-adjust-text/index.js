import React, { useEffect, useRef } from "react";
import "./index.css";

const AutoAdjustText = ({ text, textClassName, fontSize, updateFontSize }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const defaultFontSize = 16;

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    // Function to dynamically adjust font size based on container size
    const adjustFontSize = () => {
      const availableWidth = container.clientWidth;
      const availableHeight = container.clientHeight;

      const contentWidth = content.clientWidth;
      const contentHeight = content.clientHeight;

      const widthRatio = availableWidth / contentWidth;
      const heightRatio = availableHeight / contentHeight;

      // Calculate the font size based on the smaller scaling factor
      const scalingFactor = Math.min(widthRatio, heightRatio);

      // Set the font size based on the scaling factor
      const newFontSize = (fontSize || defaultFontSize) * scalingFactor; // Adjust the base font size as needed

      updateFontSize(newFontSize);
    };

    if (!fontSize) {
      // Call the adjustFontSize function initially
      adjustFontSize();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize]);

  return (
    <div ref={containerRef} className="adjust-text-container">
      <span
        ref={contentRef}
        style={{ fontSize: fontSize || defaultFontSize }}
        className={textClassName}
      >
        {text}
      </span>
    </div>
  );
};

export default AutoAdjustText;
