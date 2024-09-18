const constants = {
  net: {
    IP: "127.0.0.1",
    HOST: "localhost",
    HTTP_PORT: 42000,
    SOCKET_PORT: 42420,
    routes: {
      dashboard: {
        NET_PERF_THRESH: 500 
      },
      uitests: {
        NET_PERF_THRESH: 25000
      }
    }
  },
  compute: {
    CPU_THRESH: 80,
    MEM_THRESH: 50000000,
    express: {
      VIEW_ENGINE: "ejs",
      VIEWS_DIR: "./views",
      URLENCODED_EXTENDED: true,
      session: {
        SECRET: "my-super-strong-secret-key",
	RESAVE: false,
	SAVE_UNINTIALIZED: "false",
	cookie: {
          SECURE: "false",
          HTTP_ONLY: "true",
          MAX_AGE: 600000
	}
      }
    }
  },
  store: {
    logs: {
      DATE: "YY-MM-DD", 
      TIME: "HH:MM:SS",
      NAME: "een-proto",
      LEVEL: "info",
      FILENAME: "./logs/%DATE%.log",
      MAX_SIZE: "20m",
      MAX_FILES: "14",
      ZIPPED_ARCHIVE: true
    }
  }
};

module.exports = constants;
