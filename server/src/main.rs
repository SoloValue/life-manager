use actix_cors::Cors;
use actix_web::{App, HttpServer, http, middleware::Logger, web::Data};

use server::Result;
use server::{core::db::connection::DbConnector, modules};

#[actix_web::main]
async fn main() -> Result<()> {
    // dev env
    // TODO find how to vrite env variables in async
    // std::env::set_var("RUST_LOG", "debug");
    // std::env::set_var("RUST_BACKTRACE", "1");

    // ###########
    // ### D B ###
    // ###########
    let db_url = "postgres://postgres:root@localhost:5432/life_manager";
    let db_pool = DbConnector::generate_pool(db_url).await?;

    // ####################
    // ###  S E R V E R ###
    // ####################
    let port: u16 = 8000;
    println!("Server running on localhost:{port}");

    HttpServer::new(move || {
        // Configure CORS
        let cors = Cors::default()
            .allowed_origin("http://localhost:4200") // DEV frontend
            .allowed_methods(vec!["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                http::header::CONTENT_TYPE,
                http::header::AUTHORIZATION,
            ]);

        let logger = Logger::default();
        App::new()
            .app_data(Data::new(DbConnector {
                pool: db_pool.clone(),
            }))
            .wrap(logger)
            .wrap(cors)
            .configure(modules::groceries::routes)
            .configure(modules::expenses::routes)
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await?;

    // ################
    // ###  T E S T ###
    // ################

    // let new_item = NewExpenseDb {
    //     category: ExpenseCategory::Love,
    //     value: 1.23,
    //     description: String::from("Snaky"),
    //     created_at: None,
    // };
    // db_connector.insert_into_table(&new_item).await?;

    // let expenses = Expense::fetch_from_db(&db_connector).await?;

    // println!("{expenses:?}");
    Ok(())
}
