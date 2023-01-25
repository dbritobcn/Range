import {RangeHttpFacade} from "./range.httpFacade";
import {setupServer} from 'msw/node';
import {rest} from "msw";
import 'isomorphic-fetch';
import {RangeDto} from "../mappers/range.dto";
import {RangeType} from "../presentation/range";

const apiUrl = `${process.env.REACT_APP_API_URL}`;
const facade = new RangeHttpFacade();

const server = setupServer(
  rest.get(apiUrl, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set('Content-Type', 'application/json'),
      ctx.json({min: 1, max: 100})
    );
  }),
);

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Range HTTP Facade', () => {
  describe('getRange', () => {
    it('should return a range successfully', async () => {
      const range = await facade.getRange(RangeType.REGULAR);
      expect(range).toBeInstanceOf(RangeDto);
      expect(range).toMatchSnapshot();
      expect(range).toEqual({min: 1, max: 100});
    });

    it('should request and fail', async () => {
      server.use(
        rest.get(apiUrl, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              errorMessage: `Unexpected error occurred`,
            }),
          )
        }),
      );
      await expect(() => facade.getRange(RangeType.REGULAR)).rejects.toThrow();
    });
  });
});
