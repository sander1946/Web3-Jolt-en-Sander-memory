# Memory Admin door Sander Kleine en Jolt Kolk

## U kunt er voor kiezen om het project binnen docker te draaien of niet

### Om het project binnen docker te draaien, voer de volgende comando's uit

```bash
docker build . -t memory-admin
docker run -p 4200:4200 memory-admin
```

### Om het project buiten docker te runnen moeten de volgend commando's uitgevoerd worden

1. Npm 22.12 is nodig om dit project te runnen, Node Version Manager kan hiet het beste voor worden gebruikt

```bash
nvm install 22.12.0
nvm use 22.12.0
```

2. 

```bash
npm install

```

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Om het project buiten docker te runnen moeten de volgend commando's uitgevoerd worden

1. Npm 22.12 is nodig om dit project te runnen, Node Version Manager kan hiet het beste voor worden gebruikt

```bash
nvm install 22.12.0
nvm use 22.12.0
```

2. Installeer Angular CLI

```bash
npm install -g @angular/cli
```

3. Installeer alle npm benodigheden

```bash
npm install
```


5. Als laatste, run het project

```bash
ng serve --host 0.0.0.0 --port 4200
```
