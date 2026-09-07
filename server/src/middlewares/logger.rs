/// An actix_web middleware required 2 components:
///  - the Transform implementation. Where the 'new_transform' method initialize the Middleware when it gets registred into the HttpService.
///  - the Service implementation. Where the actual request handling logic is implemented and called for each request.
///
/// Service implement 'pool_ready', to tell the service stack it is ready to take on the request, and 'call', to handle the request.
/// NB! 'call' can be invoker before 'pool_ready' is called, so it is important to handle both cases.
///
/// In this implementation, in addition to the Transform and Service implementation, we have added an extra layer: the LoggerFuture.
/// The scope of this future is to manage the "service" Future
/// which will finish only when all the more internal middlewares and handlers are done processing the request.
///
/// Here an example of the flow for this implementation:
///
/// actix-web runtime
///     │
///     └─► middleware.call(req)          ← synchronous
///             │  PRE-processing here
///             │
///             └─► returns LoggerFuture { inner_fut, ... }
///                         │
///     ┌───────────────────┘  (runtime polls the future)
///     │
///     └─► LoggerFuture::poll()
///             │
///             ├─► inner_fut.poll()  →  Poll::Pending  →  suspend, try later
///             │
///             └─► inner_fut.poll()  →  Poll::Ready    →  POST-processing here
///
use std::{
    future::{Ready, ready},
    task::{Context, Poll},
    time::Instant,
};

use actix_web::{
    Error,
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    http::Method,
};
use pin_project::pin_project;
use tracing::debug;

// #############################
// ###  M I D D L E W A R E  ###
// #############################
pub struct LoggerMiddleware;

impl<S, B> Transform<S, ServiceRequest> for LoggerMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = LoggerService<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(LoggerService { service }))
    }
}

// #######################
// ###  S E R V I C E  ###
// #######################
pub struct LoggerService<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for LoggerService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LoggerFuture<S::Future>;

    // or `forward_ready!(service);`
    fn poll_ready(&self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        // PRE processing
        let info = LoggerInfo {
            method: req.method().clone(),
            path: req.path().to_owned(),
            query: req.query_string().to_owned(),
            start: Instant::now(),
        };

        // delegate to the specialized Future poll
        LoggerFuture {
            fut: self.service.call(req),
            info,
        }
    }
}

// #####################
// ###  F U T U R E  ###
// #####################
struct LoggerInfo {
    pub method: Method,
    pub path: String,
    pub query: String,
    pub start: Instant,
}

#[pin_project]
pub struct LoggerFuture<F> {
    #[pin]
    fut: F,
    info: LoggerInfo,
}

impl<F, B> Future for LoggerFuture<F>
where
    F: Future<Output = Result<ServiceResponse<B>, Error>>,
{
    type Output = Result<ServiceResponse<B>, Error>;

    fn poll(self: std::pin::Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let start = self.info.start.clone();
        let this = self.project();
        match this.fut.poll(cx) {
            Poll::Pending => Poll::Pending,
            Poll::Ready(result) => {
                // POST processing
                let duration = start.elapsed();
                debug!(
                    method = %this.info.method,
                    path = %this.info.path,
                    query = %this.info.query,
                    result = %result.as_ref().unwrap().status().as_u16(),
                    duration_ms = %duration.as_millis(),
                    "API request"
                );

                Poll::Ready(result)
            }
        }
    }
}
