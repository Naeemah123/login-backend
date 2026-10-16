import {
  Router,
  type RequestHandler,
  type Router as ExpressRouter,
} from 'express';

type RouteHandler = RequestHandler;

const wrapHandler = (handler: RouteHandler): RouteHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

export class AppRouter {
  private readonly instance: ExpressRouter = Router();

  get router(): ExpressRouter {
    return this.instance;
  }

  get(path: string, ...handlers: RouteHandler[]) {
    this.instance.get(path, ...handlers.map(wrapHandler));
    return this;
  }

  post(path: string, ...handlers: RouteHandler[]) {
    this.instance.post(path, ...handlers.map(wrapHandler));
    return this;
  }

  put(path: string, ...handlers: RouteHandler[]) {
    this.instance.put(path, ...handlers.map(wrapHandler));
    return this;
  }

  patch(path: string, ...handlers: RouteHandler[]) {
    this.instance.patch(path, ...handlers.map(wrapHandler));
    return this;
  }

  delete(path: string, ...handlers: RouteHandler[]) {
    this.instance.delete(path, ...handlers.map(wrapHandler));
    return this;
  }
}
