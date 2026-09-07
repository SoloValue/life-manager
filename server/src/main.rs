use actix_cors::Cors;
use actix_web::HttpResponse;
use actix_web::{App, HttpServer, http, web};

use server::Result;
use server::middlewares::logger::LoggerMiddleware;
use server::{core::db::connection::DbConnector, modules};
use tracing::error;

#[tokio::main]
async fn main() -> Result<()> {
    // TODO dev env
    unsafe {
        std::env::set_var("RUST_LOG", "DEBUG");
        std::env::set_var("RUST_BACKTRACE", "1");
    }

    // ###################
    // ### L O G G E R ###
    // ###################
    server::core::logger::initialize_logger_only_console();

    // #######################
    // ###  ! P A N I C !  ###
    // #######################
    std::panic::set_hook(Box::new(|panic_info| {
        error!("panic occurred: {}", panic_info);
        eprintln!("{}", panic_info);
        std::process::exit(1);
    }));

    // ###########
    // ### D B ###
    // ###########
    let db_url = "postgres://postgres:root@localhost:5432/life_manager";
    let db_pool = DbConnector::generate_pool(db_url).await?;

    // ####################
    // ###  S E R V E R ###
    // ####################
    let port: u16 = 8000;
    let db_data = web::Data::new(DbConnector {
        pool: db_pool.clone(),
    });

    HttpServer::new(move || {
        // Configure CORS
        let cors = Cors::default()
            .allowed_origin("http://localhost:4200") // DEV frontend
            .allowed_methods(vec!["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                http::header::CONTENT_TYPE,
                http::header::AUTHORIZATION,
            ]);

        App::new()
            .app_data(db_data.clone())
            /////// MIDDLEWARES \\\\\\\
            .wrap(LoggerMiddleware)
            .wrap(cors)
            /////// ROUTING \\\\\\\\
            .configure(modules::groceries::routes)
            .configure(modules::expenses::routes)
            ////// 404 \\\\\\\
            .default_service(web::to(|| async { HttpResponse::NotFound().finish() }))
    })
    .keep_alive(std::time::Duration::from_secs(300))
    .shutdown_timeout(2)
    .workers(4)
    .bind(("127.0.0.1", port))?
    .run()
    .await?;

    Ok(())
}

#[cfg(test)]
mod tests {
    // ################
    // ###  T E S T ###
    // ################

    // cargo test mytest -- --show-output
    use server::modules::expenses::db::{ExpenseCategory, NewExpenseDb};

    #[test]
    fn mytest() {
        // let new_item = NewExpenseDb {
        //     category: ExpenseCategory::Love,
        //     value: 1.23,
        //     description: String::from("Snaky"),
        //     created_at: None,
        // };
        // db_connector.insert_into_table(&new_item).await?;

        // let expenses = Expense::fetch_from_db(&db_connector).await?;

        // println!("{expenses:?}");
    }
}
