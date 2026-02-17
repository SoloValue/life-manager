pub mod date_requests;
pub mod expenses;
pub mod groceries;

use date_requests::error::DateRequestError;
use expenses::error::ExpensesError;
use groceries::error::GroceriesError;

use actix_web::{
    HttpResponse,
    error::ResponseError,
    http::{StatusCode, header::ContentType},
};
use thiserror::Error;

pub fn logging(msg: &str) {
    println!("{msg}");
}

#[derive(Error, Debug)]
pub enum ApiError {
    #[error(transparent)]
    Expenses(#[from] ExpensesError),

    #[error(transparent)]
    Groceries(#[from] GroceriesError),

    #[error(transparent)]
    DateRequest(#[from] DateRequestError),

    #[error("Internal Server Error")]
    Internal,
}
impl ResponseError for ApiError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::json())
            .body(self.to_string())
    }
    fn status_code(&self) -> StatusCode {
        match self {
            ApiError::Expenses(e) => match e {
                ExpensesError::SqlError(_) => StatusCode::INTERNAL_SERVER_ERROR,
                ExpensesError::ExpenseNotFound => StatusCode::NOT_FOUND,
                ExpensesError::ExpenseUpdateFailed => StatusCode::INTERNAL_SERVER_ERROR,
                ExpensesError::BadExpenseRequest(_) => StatusCode::BAD_REQUEST,
            },
            ApiError::Groceries(e) => match e {
                GroceriesError::SqlError(_) => StatusCode::INTERNAL_SERVER_ERROR,
                GroceriesError::GroceryNotFound => StatusCode::NOT_FOUND,
                GroceriesError::GroceryUpdateFailed => StatusCode::INTERNAL_SERVER_ERROR,
                GroceriesError::BadGroceryRequest(_) => StatusCode::BAD_REQUEST,
            },
            ApiError::DateRequest(e) => match e {
                DateRequestError::SqlError(_) => StatusCode::INTERNAL_SERVER_ERROR,
                DateRequestError::DateRequestNotFound => StatusCode::NOT_FOUND,
                DateRequestError::DateRequestUpdateFailed => StatusCode::INTERNAL_SERVER_ERROR,
                DateRequestError::BadDateRequestRequest(_) => StatusCode::BAD_REQUEST,
            },
            ApiError::Internal => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}

pub type ApiResult<T> = std::result::Result<T, ApiError>;
