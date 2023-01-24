import React, {Ref, useRef, useState} from "react";
import './range.css';

interface RangeProps {
  min: number;
  max: number;
  onChange: (range: { min: number; max: number }) => void;
}

export const CustomRange: React.FC<RangeProps> = (props: any) => {
  const {min, max, onChange} = props;
  const [range, setRange] = useState({min, max});
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<"min" | "max" | null>(null);
  const rangeLineRef = useRef<HTMLDivElement>(null);
  const minBulletRef = useRef<HTMLDivElement>(null);
  const maxBulletRef = useRef<HTMLDivElement>(null);

  const setValues = (value: {min: number, max: number}): void => {
    const roundedValue = { min: Math.round(value.min), max: Math.round(value.max) };
    setRange(value);
    onChange(roundedValue);
  }

  const roundValue = (value: number): number => Math.round(value);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = parseInt(e.target.value);
    if (newMin < min) {
      newMin = min;
    }
    if (newMin >= range.max) {
      newMin = range.max - 1;
    }
    setRange({...range, min: newMin});
    onChange({min: newMin, max: range.max});
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = parseInt(e.target.value);
    if (newMax > max) {
      newMax = max;
    }
    if (newMax <= range.min) {
      newMax = range.min + 1;
    }
    setRange({...range, max: newMax});
    onChange({min: range.min, max: newMax});
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const rangeLineRect = rangeLineRef.current!.getBoundingClientRect();
    const position = (event.clientX - rangeLineRect.left) / rangeLineRect.width;
    if (position < 0 || position > 1) return;
    console.log("position: ", position);
    const newValue = min + (position * (max - min));
    if (dragType === "min" && newValue < range.max) {
      setValues({ ...range, min: newValue });
      // setRange({ ...range, min: newValue });
      // onChange({ min: newValue, max: range.max });
    } else if (dragType === "max" && newValue > range.min) {
      setValues({ ...range, max: newValue });
      // setRange({ ...range, max: newValue });
      // onChange({ min: range.min, max: newValue });
    }
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(false);
    setDragType(null);
  }

  const handleMouseDown = (event: React.MouseEvent, type: "min" | "max") => {
    event.preventDefault();
    setIsDragging(true);
    setDragType(type);
  }

  const setBulletPosition = (value: number, ref: any): string => {
    const displacement = isNaN(ref?.current?.clientWidth) ? '.5em' : `${ref.current.clientWidth / 2}px`;
    return `calc(${((value - min) / (max - min)) * 100}% - ${displacement})`;
  }

  return (
    <div className="range__container">
      <input
        type="number"
        className="range__value"
        value={roundValue(range.min)}
        onChange={handleMinChange}
      />
      <div className="range__line"
           ref={rangeLineRef}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}>
        <div
          className="range__bullet"
          ref={minBulletRef}
          onMouseDown={(e) =>handleMouseDown(e, 'min')}
          style={{left: setBulletPosition(range.min, minBulletRef)}}
        ></div>
        <div
          className="range__bullet"
          ref={maxBulletRef}
          onMouseDown={(e) =>handleMouseDown(e, 'max')}
          style={{left: setBulletPosition(range.max, maxBulletRef)}}
        ></div>
      </div>
      <input
        type="number"
        className="range__value"
        value={roundValue(range.max)}
        onChange={handleMaxChange}
      />
    </div>
  )
}
