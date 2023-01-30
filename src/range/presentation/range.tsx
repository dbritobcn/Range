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
  const [tempValues, setTempValues] = useState<{[key: string]: number | null}>({});
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
      onChange({min: response.min, max: response.max});
    });
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      console.log("DESTROY");
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!isDragging) {
      onChange(values);
    }
  }, [isDragging]);

  const parseValues = (value: StateProps): void => {
    setState(value);
    setTempValues({min: 0, max: 0});
    let newValues: StateProps;
    if (type === RangeType.FIXED) {
      newValues = range.data!.reduce((acc: StateProps, currentRange: number): StateProps => {
        return {
          min: (value.min >= currentRange) ? currentRange : acc.min,
          max: (Math.floor(value.max) >= Math.floor(currentRange)) ? currentRange : acc.max
        }
      }, {min: values.min, max: values.max});
    } else {
      newValues = {min: Math.round(value.min), max: Math.round(value.max)};
    }
    if (newValues.min !== values.min || newValues.max !== values.max) {
      setValues(newValues);
    }
  }

  const cleanTemps = () => {
    setTempValues({
      min: null,
      max: null
    })
  }

  const handleKeyboard = (key: string, input?: string) => {
    switch(key) {
      case 'Enter':
        parseValues({
          min: values.min,
          max: values.max
        });
        onChange({
          min: values.min,
          max: values.max
        });
        cleanTemps();
        break;
      case 'Escape':
        setValues({
          min: tempValues.min || values.min,
          max: tempValues.max || values.min
        });
        cleanTemps();
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
    setValues({...values, min: newMin});
    if (!tempValues.min) {
      setTempValues({...values, min: values.min});
    }
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
    if (!tempValues.max) {
      setTempValues({...values, max: values.max});
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    const rangeLineRect = rangeLineRef.current!.getBoundingClientRect();
    const position = (event.clientX - rangeLineRect.left) / rangeLineRect.width;
    if (position < 0 || position > 1) return;
    const newValue = range.min + (position * (range.max - range.min));
    if (dragType === "min" && newValue < values.max - 1) {
      parseValues({...values, min: newValue});
    } else if (dragType === "max" && newValue > values.min + 1) {
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
    <div data-testid="range">
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
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyboard(event.key, 'min')}
                data-testid="minValueInput"
              />
            )}
            {type !== RangeType.REGULAR && (
              <span className="range__value"
                    data-testid="minValueLabel">{values.min}</span>
            )}
            <div className="range__line"
                 ref={rangeLineRef}
                 onMouseMove={handleMouseMove}>
              <div
                className="range__bullet"
                ref={minBulletRef}
                onMouseDown={(e) => handleMouseDown(e, 'min')}
                style={{left: setBulletPosition(state.min, minBulletRef)}}
                data-testid="min-bullet"
              ></div>
              <div
                className="range__bullet"
                ref={maxBulletRef}
                onMouseDown={(e) => handleMouseDown(e, 'max')}
                style={{left: setBulletPosition(state.max, maxBulletRef)}}
                data-testid="max-bullet"
              ></div>
            </div>
            {type === RangeType.REGULAR && (
              <input
                type="number"
                className="range__value"
                value={values.max}
                onChange={handleMaxChange}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyboard(event.key, 'max')}
                data-testid="maxValueInput"
              />
            )}
            {type !== RangeType.REGULAR && (
              <span className="range__value"
                    data-testid="maxValueLabel">{values.max}</span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
