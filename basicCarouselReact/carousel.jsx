import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  animate,
  motion,
  PanInfo,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import Link from "next/link";

const pageStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
};

export const Page = ({
  index,
  renderPage,
  pos,
  x,
  y,
  onDragEnd,
  clientHeight,
  progress,
}) => {
  const child = useMemo(() => renderPage({ index }), [index, renderPage]);

  return (
    <motion.div
      style={{
        ...pageStyle,
        x,
        y,
        left: `${index * 100}%`,
      }}
      className="w-100 d-flex align-items-center justify-content-center"
      draggable
      drag="x"
      dragElastic={1}
      onDragEnd={onDragEnd}
    >
      {child}
    </motion.div>
  );
};

const Dots = (props) => {
  const { index, setIndex, count } = props;

  const dots = useMemo(() => [...Array(count).keys()], [count]);

  console.log("Dot count", count, dots);

  return (
    <div className={`flex flex-row-reverse content-center `}>
      {dots.map((_, ind) => {
        console.log("Rendering dots", ind, count);
        return (
          <div
            className={` ${
              (count + (index % count)) % count === ind ? "" : ""
            }`}
            onClick={() => setIndex(ind + index + count - (index % count))}
          ></div>
        );
      })}
    </div>
  );
};

const range = [-1, 0, 1];

const containerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
  overflowX: "hidden",
};

const transition = {
  type: "spring",
  bounce: 0,
};

const VirtualizedPage = ({ children, count }) => {
  const x = useMotionValue(0);
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);

  const calculateNewX = () => -index * (containerRef.current?.clientWidth || 0);

  const handleEndDrag = (e, dragProps) => {
    const clientWidth = containerRef.current?.clientWidth || 0;

    const { offset, velocity } = dragProps;

    if (Math.abs(velocity.y) > Math.abs(velocity.x)) {
      animate(x, calculateNewX(), transition);
      return;
    }

    if (offset.x > clientWidth / 4) {
      setIndex(index - 1);
    } else if (offset.x < -clientWidth / 4) {
      setIndex(index + 1);
    } else {
      animate(x, calculateNewX(), transition);
    }
  };

  useEffect(() => {
    const controls = animate(x, calculateNewX(), transition);
    return controls.stop;
  }, [index]);

  return (
    <div className={`flex w-full h-full items-center content-between `}>
      <HiOutlineChevronRight
        // className={styles.carouselBtn}
        onClick={() => setIndex(index + 1)}
      />
      <motion.div
        ref={containerRef}
        className="flex grow items-center content-center"
        style={containerStyle}
      >
        {range.map((rangeValue) => (
          <Page
            key={rangeValue + index}
            x={x}
            // y={y}
            pos={rangeValue}
            // progress={progress}
            onDragEnd={handleEndDrag}
            // onDrag={handleDrag}
            clientHeight={containerRef.current?.clientHeight || 1}
            index={rangeValue + index}
            renderPage={children}
          />
        ))}
      </motion.div>
      <Dots setIndex={setIndex} index={index} count={count} />
      <HiOutlineChevronLeft
        // className={styles.carouselBtn}
        onClick={() => setIndex(index - 1)}
      />
    </div>
  );
};

const AparatSlider = (props) => {
  return (
    <div className="flex flex-col items-center justify-center  w-full h-[400px] ">
      <VirtualizedPage>
        {({ index }) => {
          return (
            <div
              className={`m-2 ${
                ["bg-primary", "bg-secondary", "bg-grayDark"][
                  ((index % 3) + 3) % 3
                ]
              }`}
            >
              {index}
            </div>
          );
        }}
      </VirtualizedPage>
    </div>
  );
};
export default AparatSlider;
