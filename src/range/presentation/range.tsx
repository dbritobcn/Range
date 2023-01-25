import React, {useEffect, useRef, useState} from "react";
import './range.css';
import {useGetRange} from "../hooks/useGetRange";
import {RangeDto} from "../mappers/range.dto";
import {LoadingSpinner} from "../../shared/components/loading-spinner/loading-spinner";

export enum RangeType {
  'REGULAR' = 'regular',
  'FIXED' = 'fixed'
}

interface RangeProps {
  type?: RangeType,
  onChange: (range: { min: number; max: number }) => void;
}

interface StateProps {
  min: number,
  max: number
}

export const CustomRange: React.FC<RangeProps> = ({onChange, type = RangeType.REGULAR}) => {
  const [state, setState] = useState<StateProps>({min: 1, max: 10});
  const [values, setValues] = useState<StateProps>({min: 1, max: 10});
  const [range, setRange] = useState<RangeDto>({min: 1, max: 10, data: []});
  const [loading, setLoading] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragType, setDragType] = useState<"min" | "max" | null>(null);

  const getRange: Promise<RangeDto> = useGetRange(type);
  const rangeLineRef = useRef<HTMLDivElement>(null);
  const minBulletRef = useRef<HTMLDivElement>(null);
  const maxBulletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getRange.then((response: RangeDto) => {
      setRange(response);
      setValues({min: response.min, max: response.max});
      setState({min: response.min, max: response.max});
      setLoading(false);
    });
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const parseValues = (value: StateProps): void => {
    setState(value);
    let newValues: StateProps;
    if (type === RangeType.FIXED) {
      newValues = range.data!.reduce((acc: StateProps, currentRange: number): StateProps => {
        return {
          min: (value.min >= currentRange) ? currentRange : acc.min,
          max: (value.max >= currentRange) ? currentRange : acc.max
        }
      }, {min: values.min, max: values.max});
    } else {
      newValues = {min: Math.round(value.min), max: Math.round(value.max)};
    }
    if (newValues.min !== values.min || newValues.max !== values.max) {
      onChange(newValues);
      setValues(newValues);
    }
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMin = parseInt(e.target.value);
    if (newMin < range.min) {
      newMin = range.min;
    }
    if (newMin >= values.max) {
      newMin = values.max - 1;
    }
    parseValues({...values, min: newMin});
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMax = parseInt(e.target.value);
    if (newMax > range.max) {
      newMax = range.max;
    }
    if (newMax <= values.min) {
      newMax = values.min + 1;
    }
    parseValues({...values, max: newMax});
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const rangeLineRect = rangeLineRef.current!.getBoundingClientRect();
    const position = (event.clientX - rangeLineRect.left) / rangeLineRect.width;
    if (position < 0 || position > 1) return;
    const newValue = range.min + (position * (range.max - range.min));
    if (dragType === "min" && newValue < values.max) {
      parseValues({...values, min: newValue});
    } else if (dragType === "max" && newValue > values.min) {
      parseValues({...values, max: newValue});
    }
  };

  const handleMouseUp = (event: Event) => {
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
            {type === RangeType.REGULAR && (
              <input
                type="number"
                className="range__value"
                value={values.min}
                onChange={handleMinChange}
              />
            )}
            {type !== RangeType.REGULAR && (
              <span className="range__value">{values.min}</span>
            )}
            <div className="range__line"
                 ref={rangeLineRef}
                 onMouseMove={handleMouseMove}>
              <div
                className="range__bullet"
                ref={minBulletRef}
                onMouseDown={(e) => handleMouseDown(e, 'min')}
                style={{left: setBulletPosition(state.min, minBulletRef)}}
              ></div>
              <div
                className="range__bullet"
                ref={maxBulletRef}
                onMouseDown={(e) => handleMouseDown(e, 'max')}
                style={{left: setBulletPosition(state.max, maxBulletRef)}}
              ></div>
            </div>
            {type === RangeType.REGULAR && (
              <input
                type="number"
                className="range__value"
                value={values.max}
                onChange={handleMaxChange}
              />
            )}
            {type !== RangeType.REGULAR && (
              <span className="range__value">{values.max}</span>
            )}
          </div>
        </>
      )}
    </>
  )
}
