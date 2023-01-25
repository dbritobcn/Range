import {rest} from "msw";
import {RangeType} from "../range/presentation/range";

export const handlers = [
  rest.get(`${process.env.REACT_APP_API_URL}/:type`, (req, res, ctx) => {
    switch (req.params.type) {
      case RangeType.FIXED:
        return res(
          ctx.status(200),
          ctx.json({data: [1.99, 5.99, 2.99, 30.99, 50.99, 70.99]})
        );
        break;
      default:
        return res(
          ctx.status(200),
          ctx.json({data: [1, 100]})
        );
    }
  })
]
