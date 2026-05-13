import dotenv from "dotenv";
import app from "./app";
import chalk from "chalk";

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(chalk.green(`🚀Server running on http://localhost:${PORT}`));
  console.log(chalk.blue(`📘Swagger docs http://localhost:${PORT}/api-docs`));
});
