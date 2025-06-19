# memory

Npm 22.12 is nodig om dit project te runnen

```bash
nvm install 22.12.0
nvm use 22.12.0
```

To install bun, typescript, angular and http-server:

```bash
npm install -g bun
npm install -g typescript
npm install -g http-server
```

To install dependencies:

```bash
bun install
```

This project was created using `bun init` in bun v1.2.13. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Build ts files to js files, this is required everytime a change is made to any `.ts` file.

```sh
tsc
```

To run all the projects, use the folloing command

```bash
http-server ./public -p 8080 -a 0.0.0.0
```
