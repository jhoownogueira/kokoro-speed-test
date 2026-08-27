# Kokoro Speed Test

POC simples para medir quanto tempo o Kokoro leva para gerar uma frase curta em português brasileiro.

A página usa a voz `pf_dora` e mostra o tempo, em milissegundos, entre o clique e o WAV completo chegar ao navegador.

## Executar com Docker

Com o Docker Desktop em execução, use um único comando na pasta do projeto:

```powershell
docker compose up --build
```

O Compose inicia o Kokoro e a interface web juntos. Quando os serviços estiverem prontos, abra:

```text
http://localhost:9595
```

Se a porta `9595` já estiver em uso, escolha outra ao iniciar, por exemplo: `APP_PORT=9596 docker compose up --build` (no PowerShell: `$env:APP_PORT=9596; docker compose up --build`).

Na primeira execução, a imagem/modelo pode levar alguns minutos para baixar e inicializar. Para encerrar, pressione `Ctrl+C`. Para executar em segundo plano, use `docker compose up --build -d`; depois, para parar, use `docker compose down`.

O Kokoro não expõe sua porta diretamente ao computador: a interface se comunica com ele pela rede interna do Compose.

## Executar sem Docker (opcional)

Requer Node.js 20+ e Docker.

```powershell
npm install
npm run kokoro:cpu
```

Em outro terminal:

```powershell
npm start
```

## Teste recomendado

Use primeiro:

```text
Senha A um. Dirigir-se ao guichê três.
```

Clique várias vezes.

A primeira chamada pode incluir warm-up. As chamadas seguintes são as mais interessantes para avaliar a latência real de uso.

## Observação

Este POC mede Kokoro de verdade com a voz brasileira `pf_dora`. O Node serve a página e faz proxy para o processo local do Kokoro. Nada usa Web Speech API / `speechSynthesis`.
