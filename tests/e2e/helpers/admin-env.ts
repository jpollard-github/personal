import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type AdminCredentials = {
  username: string;
  password: string;
};

function stripOptionalQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function readLocalEnvFile() {
  try {
    const envText = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    const envEntries = new Map<string, string>();

    for (const line of envText.split(/\r?\n/)) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf("=");

      if (separatorIndex <= 0) {
        continue;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const rawValue = trimmedLine.slice(separatorIndex + 1).trim();

      envEntries.set(key, stripOptionalQuotes(rawValue));
    }

    return envEntries;
  } catch {
    return new Map<string, string>();
  }
}

export function getAdminCredentials(): AdminCredentials {
  const envFile = readLocalEnvFile();

  return {
    username: process.env.ADMIN_USERNAME ?? envFile.get("ADMIN_USERNAME") ?? "",
    password: process.env.ADMIN_PASSWORD ?? envFile.get("ADMIN_PASSWORD") ?? "",
  };
}
