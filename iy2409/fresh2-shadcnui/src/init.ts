export async function initProject(
    cwd = Deno.cwd(),
    input: (string | number)[],
    flags: {
      foo?: boolean | null;
    } = {}
  ): Promise<void> {
    console.log(cwd);
    console.log(input);
    console.log(flags);
  }