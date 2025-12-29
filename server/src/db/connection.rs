use crate::Result;
use sqlx::{
    FromRow, Pool, Postgres, QueryBuilder,
    postgres::{PgPool, PgPoolOptions, PgRow},
};

pub trait ToRow {
    fn table_name() -> &'static str;
    fn columns() -> &'static [&'static str];
    fn bind_values<'a>(&'a self, qb: &mut QueryBuilder<'a, sqlx::Postgres>);
}

pub trait EditRow {
    fn table_name() -> &'static str;
    fn bind_edit_values<'a>(&'a self, qb: &mut QueryBuilder<'a, sqlx::Postgres>);
}

#[derive(Clone)]
pub struct DbConnector {
    pub pool: PgPool,
}
impl DbConnector {
    pub async fn build(url: &str) -> Result<DbConnector> {
        let pool = PgPoolOptions::new().connect(url).await?;
        Ok(DbConnector { pool })
    }

    pub async fn generate_pool(url: &str) -> Result<Pool<Postgres>> {
        let pool = PgPoolOptions::new().connect(url).await?;
        Ok(pool)
    }

    pub async fn insert_into_table<T>(&self, new_item: &T) -> Result<()>
    where
        T: ToRow,
    {
        let mut qb = QueryBuilder::<Postgres>::new("INSERT INTO ");
        qb.push(T::table_name())
            .push(" (")
            .push(T::columns().join(", "))
            .push(") VALUES ");
        // let mut separated = qb.separated(", ");
        // for _ in 0..T::columns().len() {
        //     separated.push("?");
        // }
        // qb.push(")");

        new_item.bind_values(&mut qb);

        println!("{}", &qb.sql());
        qb.build().execute(&self.pool).await?;
        Ok(())
    }

    pub async fn fetch_model_from_table<T>(&self, table: &str) -> Result<Vec<T>>
    where
        T: Send + Unpin + for<'r> FromRow<'r, PgRow>,
    {
        let select_query = format!("SELECT * FROM {}", table);
        let result: Vec<T> = sqlx::query_as(&select_query).fetch_all(&self.pool).await?;
        Ok(result)
    }

    pub async fn delete_from_table(&self, id: &u32, table: &str) -> Result<()> {
        // TODO make it more dynamic
        let delete_query = format!("DELETE FROM {} WHERE id = {}", table, id);
        let _ = sqlx::query(&delete_query)
            .fetch_optional(&self.pool)
            .await?;
        Ok(())
    }

    pub async fn edit_row<T>(&self, to_edit: T) -> Result<()>
    where
        T: EditRow,
    {
        let mut qb = QueryBuilder::<Postgres>::new("");
        to_edit.bind_edit_values(&mut qb);
        println!("{}", &qb.sql());
        qb.build().execute(&self.pool).await?;
        Ok(())
    }
}
