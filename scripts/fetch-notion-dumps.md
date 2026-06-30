# Fetch Notion Dumps (manual workflow)

Цель: быстро подготовить raw JSON-дампы для `scripts/notion-to-content.mjs`.

## Куда складывать файлы

- Корень: `tmp/notion/root.json`
- Кейсы: `tmp/notion/cases/*.json`

Рекомендуемая структура:

```text
tmp/
  notion/
    root.json
    cases/
      30af7ee7bf04801db14fcb2ef97af0a5.json
      30af7ee7bf0480719e36df4878fba069.json
      312f7ee7bf04801e829beba4fdd56fcb.json
      309f7ee7bf048190bc1ef3146d1f11ac.json
      341f7ee7bf0480108648e3e1ec415f0d.json
```

## Шаг 1. Получить root-дамп

В чате Cursor попросите:

1) вызвать `notion-fetch` для страницы портфолио  
`https://www.notion.so/ad67228eaaf348d1962ca3ed15cba885`
2) сохранить полный JSON-ответ в файл `tmp/notion/root.json`

## Шаг 2. Получить дампы кейсов

Либо взять список кейсов из `root.json`, либо использовать текущие ID:

- `30af7ee7bf04801db14fcb2ef97af0a5` (Vendor App)
- `30af7ee7bf0480719e36df4878fba069` (LeCar Online. OMS)
- `312f7ee7bf04801e829beba4fdd56fcb` (Chirp AI health assistant)
- `309f7ee7bf048190bc1ef3146d1f11ac` (Платформа LADA Business)
- `341f7ee7bf0480108648e3e1ec415f0d` (Self-service kiosk for HoReCa)

Для каждого ID вызвать `notion-fetch` и сохранить JSON в:

`tmp/notion/cases/<PAGE_ID>.json`

## Шаг 3. Запустить v2 sync

```bash
node scripts/notion-to-content.mjs ./tmp/notion/root.json ./tmp/notion/cases ./content/notion ./public notion-assets
```

## Шаг 4. Проверка результата

- `content/notion/projects.json` обновился
- `content/notion/cases/*.md` содержит полный контент
- `public/notion-assets/*` содержит изображения
- в markdown изображений ссылки локальные (`/notion-assets/...`)

## Частые проблемы

- **403/404 на картинках:** ссылка из Notion протухла; повторно снимите свежий дамп кейса.
- **Пустой кейс:** в дампе нет блока `<content>` или сохранён не тот JSON.
- **Новый кейс не появился:** проверьте, что в root-дампе есть `<page url="https://www.notion.so/<ID>">...`.
