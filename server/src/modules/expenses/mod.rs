pub mod db;
pub mod error;
pub mod handlers;
pub mod model;

use actix_web::web;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/expenses")
            .route("", web::get().to(handlers::get_expenses))
            .route("", web::post().to(handlers::create_expense))
            .route("/{id_expense}", web::delete().to(handlers::delete_expense))
            .route("/categories", web::get().to(handlers::get_categories)),
    );
}
