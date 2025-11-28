use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use sqlx::{self, FromRow, QueryBuilder, prelude::Type};

use crate::db::connection::ToRow;

#[derive(Debug, Type, Clone, Serialize, Deserialize)]
#[sqlx(type_name = "expenses_type")] // match to pg type
#[sqlx(rename_all = "lowercase")] // tell the converter that the pg names are all lowercase
pub enum ExpenseCategory {
    House,
    Groceries,
    Love,
}
impl ExpenseCategory {
    pub fn as_str(&self) -> &'static str {
        match self {
            ExpenseCategory::House => "house",
            ExpenseCategory::Groceries => "groceries",
            ExpenseCategory::Love => "love",
        }
    }

    pub fn get_all() -> Vec<ExpenseCategory> {
        vec![
            ExpenseCategory::Groceries,
            ExpenseCategory::House,
            ExpenseCategory::Love,
        ]
    }
}
impl TryFrom<&str> for ExpenseCategory {
    type Error = crate::Error;

    fn try_from(value: &str) -> std::result::Result<Self, Self::Error> {
        let category = match value.to_uppercase().as_str() {
            "HOUSE" => Ok(ExpenseCategory::House),
            "GROCERIES" => Ok(ExpenseCategory::Groceries),
            "LOVE" => Ok(ExpenseCategory::Love),
            _ => Err("failed to match expense category"),
        }?;
        Ok(category)
    }
}
// impl ExpenseCategory {
//     pub fn to_string_db(&self) -> String {
//         match self {
//             Self::Groceries => String::from("groceries"),
//             Self::Love => String::from("love"),
//             Self::House => String::from("house"),
//         }
//     }
// }

#[derive(Debug, FromRow)]
pub struct ExpenseDb {
    pub id: i32,
    pub category: ExpenseCategory,
    pub value: f32,
    pub description: String,
    pub created_at: DateTime<Local>,
}
// impl FromRow<'_, PgRow> for ExpenseDb {
//     fn from_row(row: &PgRow) -> sqlx::Result<Self> {
//         Ok(Self {
//             id: row.try_get("id")?,
//             category: row.try_get("category")?,
//             value: row.try_get("value")?,
//             description: row.try_get("description")?,
//             created_at: row.try_get("created_at")?,
//         })
//     }
// }

#[derive(Serialize)]
pub struct NewExpenseDb {
    pub category: ExpenseCategory,
    pub value: f32,
    pub description: String,
    pub created_at: Option<DateTime<Local>>,
}
impl ToRow for NewExpenseDb {
    fn table_name() -> &'static str {
        "expenses"
    }

    fn columns() -> &'static [&'static str] {
        &["category", "value", "description", "created_at"]
    }

    fn bind_values<'a>(&'a self, qb: &mut QueryBuilder<'a, sqlx::Postgres>) {
        let new_dt = match self.created_at {
            Some(date) => date,
            None => Local::now(),
        };
        let cat_str = match self.category {
            ExpenseCategory::Groceries => "groceries",
            ExpenseCategory::Love => "love",
            ExpenseCategory::House => "house",
        };
        // qb.push_bind(cat_str)
        //     .push_bind(&self.value)
        //     .push_bind(&self.description)
        //     .push_bind(new_dt.to_rfc3339());

        qb.push(format!("(\'{}\', ", cat_str))
            .push(format!("{}, ", &self.value))
            .push(format!("\'{}\', ", &self.description))
            .push(format!("\'{}\')", new_dt.to_rfc3339()));
    }
}
