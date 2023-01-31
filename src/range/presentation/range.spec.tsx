import React from "react";
import {act, fireEvent, getByTestId, render, screen} from '@testing-library/react';
// import 'jest-dom/extend-expect';
import {CustomRange} from "./range";
import {useGetRange} from "../hooks/useGetRange";

jest.mock("../hooks/useGetRange");
let useGetRangeMock: jest.Mock;
let onChangeMock: jest.Mock;

describe('CustomRange', () => {
  describe('Mount', () => {
    beforeEach(() => {
      useGetRangeMock = useGetRange as jest.Mock;
      useGetRangeMock.mockImplementation(jest.fn(() => Promise.resolve({
        min: 1,
        max: 10,
        data: []
      })));
      onChangeMock = jest.fn();
    });

    afterEach(() => {
      useGetRangeMock.mockRestore();
    });

    xit('should render correctly', async () => {
      const {container, debug, getByTestId} = render(<CustomRange onChange={onChangeMock}/>);
      expect(container).toMatchSnapshot();
      expect(getByTestId('range')).toBeInTheDocument();
      // expect(getByTestId('min-bullet')).toBeInTheDocument();
      // expect(getByTestId('max-bullet')).toBeInTheDocument();
    });

    xit('should call onChange with correct values when dragging min bullet', async () => {
      const {getByTestId} = render(<CustomRange onChange={onChangeMock}/>);
      let container: any;
      act(() => {
        container = render(<CustomRange onChange={onChangeMock} />);
      });
      const minBullet = getByTestId('min-bullet');
      fireEvent.mouseDown(minBullet);
      fireEvent.mouseMove(minBullet, {clientX: 75});

      expect(onChangeMock).toBeCalledWith({min: 4, max: 10});
    });

    xit('should become a fixed type slider', async () => {
      useGetRangeMock.mockRestore();
      useGetRangeMock.mockImplementation(jest.fn(async () => Promise.resolve({
        min: 1,
        max: 10,
        data: [4, 6, 7]
      })));
      const {container, debug, getByTestId} = render(<CustomRange onChange={onChangeMock}/>);
      expect(getByTestId('maxValueLabel')).toBeInTheDocument();
      expect(getByTestId('maxValueInput')).not.toBeInTheDocument();
      debug();
    });
  });

  describe('parseValues', () => {
    it('should return values parsed correctly', () => {});
  });
});
