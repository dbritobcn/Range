import {RangeService} from "./range.service";

describe('Range service', () => {
  describe('setBulletsToStep', () => {
    it('should return the steps correctly', () => {
      const range = [1.99, 2.99, 5.99, 30.99, 50.99, 70.99];
      expect(RangeService.setBulletsToStep({
          min: 2.3,
          max: 57.1
        }, range))
        .toEqual({
          min: 1.99,
          max: 50.99
        });
      expect(RangeService.setBulletsToStep({
        min: 4,
        max: 62
      }, range))
        .toEqual({
          min: 2.99,
          max: 70.99
        });
      expect(RangeService.setBulletsToStep({
        min: 10,
        max: 25
      }, range))
        .toEqual({
          min: 5.99,
          max: 30.99
        });
      expect(RangeService.setBulletsToStep({
        min: 22,
        max: 25
      }, range))
        .toEqual({
          min: 5.99,
          max: 30.99
        });
    });
  });
});
