pub mod db;
pub mod error;
pub mod handlers;
pub mod model;

use actix_web::web;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/expenses")
            .route("", web::get().to(handlers::get_date_requests))
            .route("", web::post().to(handlers::create_date_request))
            .route(
                "/{id_date_request}",
                web::delete().to(handlers::delete_date_request),
            ),
    );
}
