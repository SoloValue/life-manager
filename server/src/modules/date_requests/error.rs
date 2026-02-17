use thiserror::Error;

#[derive(Error, Debug)]
pub enum DateRequestError {
    #[error("SQL error: {0}")]
    SqlError(String),

    #[error("Date request not found")]
    DateRequestNotFound,

    #[error("Date request update failed")]
    DateRequestUpdateFailed,

    #[error("Bad Date request request: {0}")]
    BadDateRequestRequest(String),
}
