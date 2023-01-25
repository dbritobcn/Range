import React, {useEffect, useRef, useState} from "react";
import './range.css';
import {useGetRange} from "../hooks/useGetRange";
import {RangeDto} from "../mappers/range.dto";
import {LoadingSpinner} from "../../shared/components/loading-spinner/loading-spinner";

export enum RangeType {
  'REGULAR', 'FIXED'
}

interface RangeProps {
  type?: RangeType,
  onChange: (range: { min: number; max: number }) => void;
}

export const CustomRange: React.FC<RangeProps> = ({onChange, type = RangeType.REGULAR}) => {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({min: 1, max: 10});
  const [values, setValues] = useState({min: 1, max: 10});
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<"min" | "max" | null>(null);
  const getRange: Promise<RangeDto> = useGetRange();
  const rangeLineRef = useRef<HTMLDivElement>(null);
  const minBulletRef = useRef<HTMLDivElement>(null);
  const maxBulletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRange.then((response: RangeDto) => {
      setRange(response);
      parseValues(response);
      setLoading(false);
    });
  }, []);

  const parseValues = (value: { min: number, max: number }): void => {
    const roundedValue = {min: Math.round(value.min), max: Math.round(value.max)};
    setValues(value);
    onChange(value);
  }

  const roundValue = (value: number): number => Math.round(value);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = parseInt(e.target.value);
    if (newMin < range.min) {
      newMin = range.min;
    }
    if (newMin >= values.max) {
      newMin = values.max - 1;
    }
    setValues({...values, min: newMin});
    onChange({min: newMin, max: values.max});
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = parseInt(e.target.value);
    if (newMax > range.max) {
      newMax = range.max;
    }
    if (newMax <= values.min) {
      newMax = values.min + 1;
    }
    setValues({...values, max: newMax});
    onChange({min: values.min, max: newMax});
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const rangeLineRect = rangeLineRef.current!.getBoundingClientRect();
    const position = (event.clientX - rangeLineRect.left) / rangeLineRect.width;
    if (position < 0 || position > 1) return;
    console.log("position: ", position);
    const newValue = range.min + (position * (range.max - range.min));
    if (dragType === "min" && newValue < values.max) {
      parseValues({...values, min: newValue});
      // setRange({ ...range, min: newValue });
      // onChange({ min: newValue, max: range.max });
    } else if (dragType === "max" && newValue > values.min) {
      parseValues({...values, max: newValue});
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
    return `calc(${((value - range.min) / (range.max - range.min)) * 100}% - ${displacement})`;
  }

  return (
    <>
      {loading && <LoadingSpinner/>}
      {!loading && (
        <>
          <div className="range__container">
            <input
              type="number"
              className="range__value"
              value={roundValue(values.min)}
              onChange={handleMinChange}
            />
            <div className="range__line"
                 ref={rangeLineRef}
                 onMouseMove={handleMouseMove}
                 onMouseUp={handleMouseUp}>
              <div
                className="range__bullet"
                ref={minBulletRef}
                onMouseDown={(e) => handleMouseDown(e, 'min')}
                style={{left: setBulletPosition(values.min, minBulletRef)}}
              ></div>
              <div
                className="range__bullet"
                ref={maxBulletRef}
                onMouseDown={(e) => handleMouseDown(e, 'max')}
                style={{left: setBulletPosition(values.max, maxBulletRef)}}
              ></div>
            </div>
            <input
              type="number"
              className="range__value"
              value={roundValue(values.max)}
              onChange={handleMaxChange}
            />
          </div>
        </>
      )}
    </>
  )
}
