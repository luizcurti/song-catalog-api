interface IConfig {
  database: {
    type: string;
    port: string;
    host: string;
    username: string;
    password: string;
    names: {
      music: string;
    }
  };
}

const config = {
  database: {
    type: 'mysql',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    names: {
      music: process.env.DB_DATABASE,
    },
  },
} as IConfig;

export default config;
