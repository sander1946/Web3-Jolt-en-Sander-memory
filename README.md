# memory

Om dit projecte te kunnen draaien, is docker en docker compose nodig

Alle servers kun je starten met de volgende commando

```bash
docker compose up --build -d
```

Om de specifieke server te runnen, kun je de volgende commando's draaien

```bash
docker compose up frontend --build -d
docker compose up backend --build -d
docker compose up admin- -build -d
```

## Het is nodig om de backend appart te pullen als je deze wilt draaien, dit kan door de volgende commando te runnen

```bash
git submodule update
git submodule update --init --recursive # alternative
```
