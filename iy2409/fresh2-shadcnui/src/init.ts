import * as path from "@std/path";
import { ensureDirSync } from "@std/fs/ensure-dir";

/**
 * Verifies that the deno.json file exists in the specified directory and that the Fresh dependency version matches the expected version.
 *
 * @param dir The directory to check.
 * @throws {Error} If the deno.json file is missing or the Fresh version doesn't match.
 * @returns True if the deno.json exists and the version matches.
 */
function verifyFreshVersion(dir: string): boolean {
  const denoJsonPath = path.join(dir, "deno.json");
  const denoJson = JSON.parse(Deno.readTextFileSync(denoJsonPath));
  return denoJson["imports"]["fresh"] === "jsr:@fresh/core@^2.0.0-alpha.22";
}

async function downloadFile(
  url: string | URL | Request,
  outputPath: string | URL,
) {
  const fileResponse = await fetch(url);
  if (fileResponse.body) {
    const file = await Deno.open(outputPath, { write: true, create: true });
    await fileResponse.body.pipeTo(file.writable);
  }
}

const FILE_DENO_JSON = `{
  "tasks": {
    "check": "deno fmt --check && deno lint && deno check **/*.ts && deno check **/*.tsx",
    "dev": "deno run -A --watch=static/,routes/ dev.ts",
    "build": "deno run -A dev.ts build",
    "start": "deno run -A main.ts",
    "update": "deno run -A -r jsr:@fresh/update ."
  },
  "lint": { "rules": { "tags": [ "fresh", "recommended" ] } },
  "exclude": [ "**/_fresh/*" ],
  "imports": {
    "@/": "./",
    "@/lib/utils": "./lib/utils.ts",
    "@fresh/plugin-tailwind": "jsr:@fresh/plugin-tailwind@^0.0.1-alpha.7",
    "@preact/signals": "npm:@preact/signals@^1.3.0",
    "@radix-ui/react-checkbox": "https://esm.sh/v135/@radix-ui/react-checkbox@1.1.2?external=react,react-dom&target=es2022",
    "@radix-ui/react-dropdown-menu": "https://esm.sh/v135/@radix-ui/react-dropdown-menu@2.1.2?external=react,react-dom&target=es2022",
    "@radix-ui/react-icons": "https://esm.sh/v135/@radix-ui/react-icons@1.3.0?external=react,react-dom&target=es2022",
    "@radix-ui/react-label": "https://esm.sh/v135/@radix-ui/react-label@2.1.0?external=react,react-dom&target=es2022",
    "@radix-ui/react-select": "https://esm.sh/v135/@radix-ui/react-select@2.1.2?external=react,react-dom&target=es2022",
    "@radix-ui/react-slot": "npm:@radix-ui/react-slot@^1.1.0",
    "@typescript-eslint/parser": "npm:@typescript-eslint/parser@^8.8.0",
    "autoprefixer": "npm:autoprefixer@^10.4.20",
    "class-variance-authority": "npm:class-variance-authority@^0.7.0",
    "clsx": "npm:clsx@^2.1.1",
    "eslint": "npm:eslint@^9.12.0",
    "eslint-plugin-tailwindcss": "npm:eslint-plugin-tailwindcss@^3.17.4",
    "fresh": "jsr:@fresh/core@^2.0.0-alpha.22",
    "lucide-preact": "npm:lucide-preact@^0.447.0",
    "lucide-react": "npm:lucide-preact@^0.447.0",
    "postcss": "npm:postcss@^8.4.47",
    "preact": "npm:preact@^10.24.3",
    "react": "npm:preact@^10.24.3/compat",
    "react-dom": "npm:preact@^10.24.3/compat",
    "tailwind-merge": "npm:tailwind-merge@^2.5.3",
    "tailwindcss": "npm:tailwindcss@3.4.3",
    "tailwindcss/plugin": "npm:tailwindcss@3.4.3/plugin.js"
  },
  "nodeModulesDir": "auto",
  "compilerOptions": {
    "lib": [ "dom", "dom.asynciterable", "dom.iterable", "deno.ns" ],
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "jsxPrecompileSkipElements": [ "a", "img", "source", "body", "html", "head"
    ]
  }
  }`;

const FILE_LIB_UTILS_TS = `
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const FILE_TAILWIND_CONFIG_TS = `
import type { Config } from "tailwindcss";
import theme from "tailwindcss/defaultTheme.js";

export default {
  darkMode: ["class"],
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  safelist: ["dark"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", ...theme.fontFamily.sans],
      },
    },
  },
} satisfies Config;
`;

const FILE_POSTCSS_CONFIG_JS =`
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`

const FILE_ESLINT_CONFIG_MJS = `
import tailwind from "eslint-plugin-tailwindcss";
import parser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: parser,
    },
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-contradicting-classname": "warn",
    },
  },
];
`

const FILE_ISLANDS_COUNTER_TSX = `
import type { Signal } from "@preact/signals";
import { Button } from "@/islands/ui/button.tsx";
// import { Button } from "../components/Button.tsx";
import { Label } from "@/islands/ui/label.tsx";
import { Checkbox } from "@/islands/ui/checkbox.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/islands/ui/select.tsx";

interface CounterProps {
  count: Signal<number>;
}

export default function Counter(props: CounterProps) {
  return (
    <div class="flex gap-8 py-6">
      <div className="flex items-center space-x-2">
        <Button variant="destructive" onClick={() => props.count.value -= 1}>-1</Button>
        <p class="text-3xl tabular-nums">{props.count}</p>
        <Button variant="outline" onClick={() => props.count.value += 1}>+1</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
`

const FILE_STATIC_STYLES_CSS=`
@tailwind base;
@tailwind components;
@tailwind utilities;
.fresh-gradient {
  background-color: rgb(134, 239, 172);
  background-image: linear-gradient(
    to right bottom,
    rgb(219, 234, 254),
    rgb(187, 247, 208),
    rgb(254, 249, 195)
  );
}


@layer base {
  :root,
  .light {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;

    --dark-background: 240 10% 3.9%;
    --dark-foreground: 0 0% 98%;

    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;

    --dark-card: 240 10% 3.9%;
    --dark-card-foreground: 0 0% 98%;

    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;

    --dark-popover: 240 10% 3.9%;
    --dark-popover-foreground: 0 0% 98%;

    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;

    --dark-primary: 0 0% 98%;
    --dark-primary-foreground: 240 5.9% 10%;

    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;

    --dark-secondary: 240 3.7% 15.9%;
    --dark-secondary-foreground: 0 0% 98%;

    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;

    --dark-muted: 240 3.7% 15.9%;
    --dark-muted-foreground: 240 5% 64.9%;

    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;

    --dark-accent: 240 3.7% 15.9%;
    --dark-accent-foreground: 0 0% 98%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --dark-destructive: 0 62.8% 30.6%;
    --dark-destructive-foreground: 0 0% 98%;

    --radius: 0.5rem;

    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;

    --dark-border: 240 3.7% 15.9%;
    --dark-input: 240 3.7% 15.9%;
    --dark-ring: 240 4.9% 83.9%;

    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;

    --dark-chart-1: 220 70% 50%;
    --dark-chart-2: 160 60% 45%;
    --dark-chart-3: 30 80% 55%;
    --dark-chart-4: 280 65% 60%;
    --dark-chart-5: 340 75% 55%;
  }

  .dark {
    --background: var(--dark-background);
    --foreground: var(--dark-foreground);

    --card: var(--dark-card);
    --card-foreground: var(--dark-card-foreground);

    --popover: var(--dark-popover);
    --popover-foreground: var(--dark-popover-foreground);

    --primary: var(--dark-primary);
    --primary-foreground: var(--dark-primary-foreground);

    --secondary: var(--dark-secondary);
    --secondary-foreground: var(--dark-secondary-foreground);

    --muted: var(--dark-muted);
    --muted-foreground: var(--dark-muted-foreground);

    --accent: var(--dark-accent);
    --accent-foreground: var(--dark-accent-foreground);

    --destructive: var(--dark-destructive);
    --destructive-foreground: var(--dark-destructive-foreground);

    --border: var(--dark-border);
    --input: var(--dark-input);
    --ring: var(--dark-ring);

    --chart-1: var(--dark-chart-1);
    --chart-2: var(--dark-chart-2);
    --chart-3: var(--dark-chart-3);
    --chart-4: var(--dark-chart-4);
    --chart-5: var(--dark-chart-5);
  }

  @media (prefers-color-scheme: dark) {
    :root:not(.light) {
      --background: var(--dark-background);
      --foreground: var(--dark-foreground);

      --card: var(--dark-card);
      --card-foreground: var(--dark-card-foreground);

      --popover: var(--dark-popover);
      --popover-foreground: var(--dark-popover-foreground);

      --primary: var(--dark-primary);
      --primary-foreground: var(--dark-primary-foreground);

      --secondary: var(--dark-secondary);
      --secondary-foreground: var(--dark-secondary-foreground);

      --muted: var(--dark-muted);
      --muted-foreground: var(--dark-muted-foreground);

      --accent: var(--dark-accent);
      --accent-foreground: var(--dark-accent-foreground);

      --destructive: var(--dark-destructive);
      --destructive-foreground: var(--dark-destructive-foreground);

      --border: var(--dark-border);
      --input: var(--dark-input);
      --ring: var(--dark-ring);

      --chart-1: var(--dark-chart-1);
      --chart-2: var(--dark-chart-2);
      --chart-3: var(--dark-chart-3);
      --chart-4: var(--dark-chart-4);
      --chart-5: var(--dark-chart-5);
    }
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
`

function updateFiles(outputDir: string) {
  // deno.json
  Deno.writeTextFileSync(
    path.join(outputDir, "deno.json"),
    FILE_DENO_JSON,
  );

  // lib/utils.ts
  ensureDirSync(path.join(outputDir, "lib")); // Ensure the output directory exists

  Deno.writeTextFileSync(
    path.join(outputDir, "lib", "utils.ts"),
    FILE_LIB_UTILS_TS,
  );

  // tailwind.config.ts

  Deno.writeTextFileSync(
    path.join(outputDir, "tailwind.config.ts"),
    FILE_TAILWIND_CONFIG_TS,
  );

  // postcss.config.js
  Deno.writeTextFileSync(
    path.join(outputDir, "postcss.config.js"),
    FILE_POSTCSS_CONFIG_JS,
  );

  // eslint.config.mjs
  Deno.writeTextFileSync(
    path.join(outputDir, "eslint.config.mjs"),
    FILE_ESLINT_CONFIG_MJS,
  );

  // islands/Counter.tsx

  Deno.writeTextFileSync(
    path.join(outputDir, "islands" , "Counter.tsx"),
    FILE_ISLANDS_COUNTER_TSX,
  );

  // static/styles.css
  Deno.writeTextFileSync(
    path.join(outputDir, "static" , "styles.css"),
    FILE_STATIC_STYLES_CSS,
  );
}

/**
 * Downloads specified Shadcn UI components from the GitHub repository
 * and saves them to the `islands/ui` directory.
 */
async function downloadShadcnUiComponents(outputDir: string) {
  const uiComponents = [
    "button.tsx",
    "input.tsx",
    "checkbox.tsx",
    "label.tsx",
    "select.tsx",
    "dropdown-menu.tsx",
  ];
  const baseUrl =
    "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/registry/default/ui/";

  ensureDirSync(outputDir); // Ensure the output directory exists

  const downloadPromises = uiComponents.map(async (component) => {
    const outputFile = path.join(outputDir, component);
    const url = baseUrl + component;

    try {
      await downloadFile(url, outputFile);
      console.log(`Downloaded: ${component}`);
    } catch (error) {
      console.error(`Error downloading ${component}:`, error);
    }
  });

  await Promise.all(downloadPromises); // Wait for all downloads to complete
}

/**
 * Updates a Fresh project.
 * This function currently logs the current working directory, input arguments, and flags.
 * It also verifies the Fresh version in the specified Fresh project directory.
 *
 * @param cwd The current working directory. Defaults to `Deno.cwd()`.
 * @param input An array of input arguments.
 * @param flags An object containing the flags, including "fresh-dir" specifying the Fresh project directory.
 */
export function updateFreshProject(
  cwd = Deno.cwd(),
  input: string[]
) {
  const freshDir = path.join(cwd, input[0]);
  // Verify Fresh project setup
  const verfiyOk = verifyFreshVersion(freshDir);
  if (!verfiyOk) {
    throw new Error(
      "Fresh version mismatch. Please re-initialize your project using:\ndeno run -Ar jsr:@fresh/init@2.0.0-alpha.22 your_fresh_project_dir --force --tailwind --vscode",
    );
  }

  downloadShadcnUiComponents(
    path.join(freshDir, "islands", "ui"),
  );

  updateFiles(freshDir);
  
}
