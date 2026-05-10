pub mod db;
pub mod error;
pub mod handlers;
pub mod model;

use actix_web::web;

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/groceries")
            .route("", web::get().to(handlers::get_groceries))
            .route("", web::patch().to(handlers::edit_grocery))
            .route("", web::post().to(handlers::create_grocery))
            .route(
                "/{grocery_item_name}",
                web::delete().to(handlers::delete_grocery),
            ),
    );
}
