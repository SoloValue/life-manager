pub mod date_requests;
pub mod expenses;
pub mod groceries;

use actix_web::{
    HttpResponse,
    error::ResponseError,
    http::{StatusCode, header::ContentType},
};

#[derive(Debug)] // TODO move to expenses/route.rs
pub enum ExpenseApiError {
    ServerError,
    ExpenseNotFound,
    ExpenseUpdateFailed,
    BadExpenseRequest,
}
impl std::fmt::Display for ExpenseApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self) // TODO do not depend on DEBUG, bad practice
    }
}
impl ResponseError for ExpenseApiError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::json())
            .body(self.to_string())
    }
    fn status_code(&self) -> StatusCode {
        match self {
            ExpenseApiError::ServerError => StatusCode::INTERNAL_SERVER_ERROR,
            ExpenseApiError::ExpenseNotFound => StatusCode::NOT_FOUND,
            ExpenseApiError::ExpenseUpdateFailed => StatusCode::FAILED_DEPENDENCY,
            ExpenseApiError::BadExpenseRequest => StatusCode::BAD_REQUEST,
        }
    }
}

pub fn logging(msg: &str) {
    println!("{msg}");
}

pub type ApiResult<T> = std::result::Result<T, ExpenseApiError>;
