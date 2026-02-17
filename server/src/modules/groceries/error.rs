use thiserror::Error;

#[derive(Error, Debug)]
pub enum GroceriesError {
    #[error("SQL error: {0}")]
    SqlError(String),

    #[error("Grocery not found")]
    GroceryNotFound,

    #[error("Grocery update failed")]
    GroceryUpdateFailed,

    #[error("Bad Grocery request: {0}")]
    BadGroceryRequest(String),
}
