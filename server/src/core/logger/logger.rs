use tracing_subscriber::{
    Registry, filter,
    fmt::{self, format::FmtSpan},
    prelude::*,
};

pub fn initialize_logger_with_file(fs: std::fs::File) {
    let subscriber = Registry::default()
        .with(
            // file
            fmt::layer()
                .with_ansi(false)
                .with_target(false)
                .with_writer(fs)
                .with_filter(filter::LevelFilter::DEBUG),
        )
        .with(
            // stdout
            fmt::layer()
                .with_target(false)
                .without_time()
                .with_span_events(FmtSpan::NEW | FmtSpan::CLOSE)
                .with_filter(filter::EnvFilter::from_default_env()),
        );
    tracing::subscriber::set_global_default(subscriber).unwrap();
}

pub fn initialize_logger_only_console() {
    let subscriber = Registry::default().with(
        // stdout
        fmt::layer()
            .with_target(false)
            .without_time()
            .with_span_events(FmtSpan::NEW | FmtSpan::CLOSE)
            .with_filter(filter::EnvFilter::from_default_env()),
    );
    tracing::subscriber::set_global_default(subscriber).unwrap();
}
