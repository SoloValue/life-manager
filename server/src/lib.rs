pub mod db;
pub mod modules;
// pub mod expenses;

pub type Error = Box<dyn std::error::Error>;
pub type Result<T> = std::result::Result<T, Error>;
