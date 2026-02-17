use thiserror::Error;

#[derive(Error, Debug)]
pub enum ExpensesError {
    #[error("SQL error: {0}")]
    SqlError(String),

    #[error("Expense not found")]
    ExpenseNotFound,

    #[error("Expense update failed")]
    ExpenseUpdateFailed,

    #[error("Bad expense request: {0}")]
    BadExpenseRequest(String),
}
