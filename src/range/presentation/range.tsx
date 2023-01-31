import React, {useEffect, useRef, useState} from "react";
import './range.css';
import {useGetRange} from "../hooks/useGetRange";
import {RangeDto} from "../mappers/range.dto";
import {LoadingSpinner} from "../../shared/components/loading-spinner/loading-spinner";

export enum RangeType {
  'REGULAR' = 'regular',
  'FIXED' = 'fixed'
}

export enum InputType {
  'MIN' = 'min',
  'MAX' = 'max'
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
  const [dragType, setDragType] = useState<InputType.MIN | InputType.MAX | null>(null);
  const [editMode, setEditMode] = useState<InputType.MIN | InputType.MAX | null>(null);

  const getRange: Promise<RangeDto> = useGetRange(type);
  const rangeLineRef = useRef<HTMLDivElement>(null);
  const minBulletRef = useRef<HTMLDivElement>(null);
  const maxBulletRef = useRef<HTMLDivElement>(null);
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getRange.then((response: RangeDto) => {
      setRange(response);
      setValues({min: response.min, max: response.max});
      setState({min: response.min, max: response.max});
      setLoading(false);
      onChange({min: response.min, max: response.max});
    });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!isDragging) {
      onChange(values);
    }
  }, [isDragging]);

  const parseValues = (value: StateProps): void => {
    setState(value);
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

  const updateInput = (value: number, input: InputType.MIN | InputType.MAX) => {
    if (isNaN(value)) {
      escape();
      return;
    }
    switch(input) {
      case InputType.MIN:
        if (value < range.min) {
          value = range.min;
        }
        if (value >= values.max) {
          value = values.max - 1;
        }
        parseValues({...values, min: value});
        onChange({...values, min: value});
        break;
      case InputType.MAX:
        if (value > range.max) {
          value = range.max;
        }
        if (value <= values.min) {
          value = values.min + 1;
        }
        parseValues({...values, max: value});
        onChange({...values, max: value});
        break;
    }
    cleanTemps();
  }

  const cleanTemps = () => {
    setTempValues({
      min: null,
      max: null
    })
  };

  const escape = () => {
    setValues({
      min: tempValues.min || values.min,
      max: tempValues.max || values.max
    });
    cleanTemps();
    blurInputs();
  }

  const blurInputs = () => {
    minInputRef.current!.blur();
    maxInputRef.current!.blur();
    setEditMode(null);
  };

  const handleKeyboard = (event: React.KeyboardEvent<HTMLInputElement>, input: InputType.MIN | InputType.MAX) => {
    switch(event.key) {
      case 'Enter':
        updateInput(input === InputType.MIN ? values.min : values.max, input);
        break;
      case 'Escape':
        escape();
        break;
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, input: InputType) => {
    setTempValues({
      min: tempValues.min || values.min,
      max: tempValues.max || values.max
    });
    setValues({
      min: input === InputType.MIN ? parseInt(e.target.value) : values.min,
      max: input === InputType.MAX ? parseInt(e.target.value) : values.max
    });
  };

  const handleMouseMove = (event: any) => {
    if (!isDragging) return;
    let clientX: any;
    if (event.nativeEvent instanceof TouchEvent) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = event.clientX;
    }
    const rangeLineRect = rangeLineRef.current!.getBoundingClientRect();
    const position = (clientX - rangeLineRect.left) / rangeLineRect.width;
    if (position < 0 || position > 1) return;
    const newValue = range.min + (position * (range.max - range.min));
    if (dragType === InputType.MIN && newValue < values.max - 1) {
      parseValues({...values, min: newValue});
    } else if (dragType === InputType.MAX && newValue > values.min + 1) {
      parseValues({...values, max: newValue});
    }
  };

  const handleMouseUp = (event: Event) => {
    event.preventDefault();
    setIsDragging(false);
    setDragType(null);
  }

  const handleMouseDown = (event: any, type: InputType.MIN | InputType.MAX) => {
    event.preventDefault();
    setIsDragging(true);
    setDragType(type);
  }

  const setBulletPosition = (value: number, ref: any): string => {
    const displacement = isNaN(ref?.current?.clientWidth) ? '.5em' : `${ref.current.clientWidth / 2}px`;
    return `calc(${((value - range.min) / (range.max - range.min)) * 100}% - ${displacement})`;
  }

  return (
    <div className="range" data-testid="range">
      {loading && <LoadingSpinner/>}
      {!loading && (
        <>
          <div className="range__container">
            {type === RangeType.REGULAR && (
              <input
                type="number"
                className="range__value"
                ref={minInputRef}
                value={values.min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, InputType.MIN)}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyboard(event, InputType.MIN)}
                onFocus={() => setEditMode(InputType.MIN)}
                onBlur={() => escape()}
                data-testid="minValueInput"
              />
            )}
            {type !== RangeType.REGULAR && (
              <span className="range__value"
                    data-testid="minValueLabel">{values.min}</span>
            )}
            <div className="range__line"
                 ref={rangeLineRef}
                 onMouseMove={handleMouseMove}
                 onTouchMove={handleMouseMove}>
              <div
                className="range__bullet"
                ref={minBulletRef}
                onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, InputType.MIN)}
                onTouchStart={(e: React.TouchEvent) => handleMouseDown(e, InputType.MIN)}
                style={{left: setBulletPosition(state.min, minBulletRef)}}
                data-testid="min-bullet"
              ></div>
              <div
                className="range__bullet"
                ref={maxBulletRef}
                onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, InputType.MAX)}
                onTouchStart={(e: React.TouchEvent) => handleMouseDown(e, InputType.MAX)}
                style={{left: setBulletPosition(state.max, maxBulletRef)}}
                data-testid="max-bullet"
              ></div>
            </div>
            {type === RangeType.REGULAR && (
              <input
                type="number"
                className="range__value"
                ref={maxInputRef}
                value={values.max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, InputType.MAX)}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyboard(event, InputType.MAX)}
                onFocus={() => setEditMode(InputType.MAX)}
                onBlur={() => escape()}
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
