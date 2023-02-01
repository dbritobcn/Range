import React from "react";
import {queryByTestId, render} from '@testing-library/react';
import {CustomRange} from "./range";
import {RangeDto} from "../mappers/range.dto";
import userEvent from "@testing-library/user-event";

const onChangeMock: jest.Mock = jest.fn();
let rangeFixture: RangeDto;
let user: any;

describe('CustomRange', () => {
  describe('Regular type', () => {
    beforeEach(() => {
      rangeFixture = RangeDto.fromServer({rangeValues: [1, 10]});
      user = userEvent.setup()
    });

    afterEach(() => {
      onChangeMock.mockRestore();
      user.clear;
    });

    it('should render correctly', () => {
      const {container, queryByTestId} = render(<CustomRange data={rangeFixture} onChange={onChangeMock}/>);
      expect(container).toMatchSnapshot();
      expect(queryByTestId('range')).toBeInTheDocument();
      expect(queryByTestId('minBullet')).toBeInTheDocument();
      expect(queryByTestId('maxBullet')).toBeInTheDocument();
    });

    it('should be a regular type range', () => {
      const {container, queryByTestId} = render(<CustomRange data={rangeFixture} onChange={onChangeMock}/>);
      expect(container).toMatchSnapshot();
      expect(queryByTestId('minValueLabel')).not.toBeInTheDocument();
      expect(queryByTestId('maxValueLabel')).not.toBeInTheDocument();
      expect(queryByTestId('minValueInput')).toBeInTheDocument();
      expect(queryByTestId('maxValueInput')).toBeInTheDocument();
      expect(onChangeMock).toHaveBeenLastCalledWith({min: 1, max: 10});
    });

    it('should type a min value and return it', async () => {
      const {container, queryByTestId} = render(<CustomRange data={rangeFixture} onChange={onChangeMock}/>);
      await user.click(queryByTestId('minValueInput') as HTMLElement);
      await user.keyboard('[Backspace]');
      await user.keyboard('3');
      await user.keyboard('4');
      await user.keyboard('[Enter]');
      await expect(onChangeMock).toHaveBeenLastCalledWith({min: 9, max: 10});
    });

    it('should type a NaN value and cancel', async () => {
      const {container, queryByTestId} = render(<CustomRange data={rangeFixture} onChange={onChangeMock}/>);
      await user.click(queryByTestId('maxValueInput') as HTMLElement);
      await user.keyboard('[Backspace]');
      await user.keyboard('[Backspace]');
      await user.keyboard('[Backspace]');
      await user.keyboard('[Enter]');
      await expect(onChangeMock).toHaveBeenLastCalledWith({min: 1, max: 10});
    });

    it('should increase the min value through arrow keys and return it', async () => {
      const {container, queryByTestId} = render(<CustomRange data={rangeFixture} onChange={onChangeMock}/>);
      const minValueInput = queryByTestId('minValueInput') as HTMLElement;
      await user.click(minValueInput);
      expect(minValueInput).toHaveFocus();
      await user.keyboard('[Backspace]');
      await user.type(minValueInput, '{arrowup}');
      await user.type(minValueInput, '{arrowup}');
      await user.keyboard('[ArrowUp]');
      await user.keyboard('[ArrowUp]');
      await user.keyboard('[Enter]');
      expect(onChangeMock).toHaveBeenLastCalledWith({min: 1, max: 10});
      const maxValueInput = queryByTestId('maxValueInput') as HTMLElement;
      await user.click(maxValueInput);
      expect(maxValueInput).toHaveFocus();
      await user.type(maxValueInput, '{arrowdown}');
      await user.type(maxValueInput, '{arrowdown}');
      await user.type(maxValueInput, '{arrowdown}');
      await user.keyboard('[Enter]');
      expect(onChangeMock).toHaveBeenLastCalledWith({min: 1, max: 10});
    });

    it('should increase the min value through arrow keys and cancel clicking somewhere else', async () => {
      const {container, queryByTestId} = render(<CustomRange data={rangeFixture} onChange={onChangeMock}/>);
      const minValueInput = queryByTestId('minValueInput') as HTMLElement;
      await user.click(minValueInput);
      expect(minValueInput).toHaveFocus();
      await user.type(minValueInput, '{arrowup}');
      await user.type(minValueInput, '{arrowup}');
      await user.click(queryByTestId('rangeLine'));
      expect(onChangeMock).toHaveBeenLastCalledWith({min: 1, max: 10});
    });

    it('should type a value and cancel', async () => {
      const {container, queryByTestId} = render(<CustomRange data={rangeFixture} onChange={onChangeMock}/>);
      await user.click(queryByTestId('minValueInput') as HTMLElement);
      await user.keyboard('[ArrowUp]');
      await user.keyboard('4');
      await user.keyboard('[Escape]');
      await expect(onChangeMock).toHaveBeenLastCalledWith({min: 1, max: 10});
    });
  });

  describe('Fixed type', () => {
    beforeEach(() => {
      rangeFixture = RangeDto.fromServer({rangeValues: [1.99, 5.99, 2.99, 30.99, 50.99, 70.99]});
    });

    it('should become a fixed type slider', () => {
      const {queryByTestId} = render(<CustomRange data={rangeFixture} onChange={onChangeMock}/>);
      expect(queryByTestId('minValueLabel')).toBeInTheDocument();
      expect(queryByTestId('maxValueLabel')).toBeInTheDocument();
      expect(queryByTestId('minValueInput')).not.toBeInTheDocument();
      expect(queryByTestId('maxValueInput')).not.toBeInTheDocument();
      expect(onChangeMock).toBeCalledWith({min: 1.99, max: 70.99});
    });
  });
});
