# Notion content (v2)

Эта директория хранит данные для статической генерации без зависимости от Notion в runtime:

- `projects.json` - метаданные карточек для главной.
- `cases/*.md` - полный markdown-контент кейсов по `slug`.
- `public/notion-assets/<slug>/...` - локализованные изображения из Notion.

## Входные данные (raw dumps)

Скрипт ожидает локальные JSON-дампы из `notion-fetch`:

- `root.json` - дамп корневой страницы-портфолио (со списком `<page ...>`).
- `cases/*.json` - дампы вложенных страниц кейсов с блоком `<content>...</content>`.

## Команда v2 sync

```bash
node scripts/notion-to-content.mjs ./tmp/notion/root.json ./tmp/notion/cases ./content/notion ./public notion-assets
```

Подготовка raw-дампов: `scripts/fetch-notion-dumps.md`.

### One-click (PowerShell, Windows)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-notion-v2.ps1
```

Можно переопределить пути параметрами:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-notion-v2.ps1 -RootJson "tmp/notion/root.json" -CasesDir "tmp/notion/cases"
```

Аргументы:

1. `root-json` (обязательно)
2. `cases-dir` (обязательно)
3. `output-dir` (опционально, по умолчанию `content/notion`)
4. `public-dir` (опционально, по умолчанию `public`)
5. `assets-subdir` (опционально, по умолчанию `notion-assets`)

## Что делает скрипт

1. Парсит список проектов из root-дампа.
2. Для каждого кейса забирает полный markdown из `<content>`.
3. Находит все image URL в markdown (`![](...)` и `<img src="...">`).
4. Скачивает изображения в `public/notion-assets/<slug>/`.
5. Заменяет remote URL в markdown на локальные пути вида `/notion-assets/<slug>/<file>`.
6. Обновляет `projects.json` и `content/notion/cases/*.md`.

## Проверка после sync

- Запустить `node --check scripts/notion-to-content.mjs`.
- Выполнить sync-команду выше.
- Убедиться, что в markdown нет `https://...` для изображений и что файлы появились в `public/notion-assets/`.

## TODO для репозитория

Сейчас в репозитории нет raw JSON-дампов Notion (`tmp/notion/...`), поэтому полноценная v2-генерация с реальным контентом выполняется только после добавления этих входных файлов.
