# Memory frontend door Sander Kleine en Jolt Kolk

## U kunt er voor kiezen om het project binnen docker te draaien of niet

### Om het project binnen docker te draaien, voer de volgende comando's uit

```bash
docker build . -t memory-frontend
docker run -p 8080:8080 memory-frontend
```

### Om het project buiten docker te runnen moeten de volgend commando's uitgevoerd worden

1. Npm 22.12 is nodig om dit project te runnen, Node Version Manager kan hiet het beste voor worden gebruikt

```bash
nvm install 22.12.0
nvm use 22.12.0
```

2. Installeer bun, typescript en http-server

```bash
npm install -g bun
npm install -g typescript
npm install -g http-server
```

3. Installeer alle bun benodigheden

```bash
bun install
```

4. Maak van alle typescript bestanden javascript bestanden

```sh
tsc
```

5. Als laatste, run het project

```bash
http-server ./public -p 8080 -a 0.0.0.0
```
