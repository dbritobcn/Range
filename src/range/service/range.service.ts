export interface StateProps {
  min: number,
  max: number
}

export class RangeService {
  static setBulletsToStep(value: StateProps, range: number[]): StateProps {
    const prevDiff = {
      min: Math.abs(value.min - range[0]),
      max: Math.abs(value.max - range[0])
    };
    let index = 0;
    const intervals: StateProps = range.reduce((prev: StateProps, curr: number, i: number): StateProps => {
      const currDiff: StateProps = {
        min: Math.abs(value.min - curr),
        max: Math.abs(value.max - curr)
      };
      const next: StateProps = {
        min: prev.min,
        max: prev.max
      };
      if (currDiff.min < prevDiff.min || (currDiff.min === prevDiff.min && curr < prev.min)) {
        prevDiff.min = currDiff.min;
        next['min'] = curr;
      }
      if (currDiff.max < prevDiff.max || (currDiff.max === prevDiff.max && curr < prev.max)) {
        prevDiff.max = currDiff.max;
        next['max'] = curr;
        index = i;
      }
      return next;
    }, {
      min: range[0],
      max: range[0]
    });
    if (intervals.min === intervals.max) {
      if (index > 0) {
        intervals.min = range[index - 1];
      } else {
        intervals.max = range[index + 1];
      }
    }
    return intervals;
  };
}
