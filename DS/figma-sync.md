# Сверка Figma и документации DS

Дата: 2026-09-09. Источник: [PDPortfolio-Prod / DS](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=0-1).
Канонический каталог и токены находятся в [PDPortfolio-DS/ds](../../PDPortfolio-DS/ds/). Здесь хранится карта обследования и очередь переноса в сайт, без второго каталога токенов.

## Объём проверки

Прочитаны индексы всех пяти страниц, все локальные Variables (49 Primitive + 22 Semantic), все 18 Text Styles и 2 Effect Styles. Для DS прочитаны masters, variant matrices, component properties, layout и выборочно вложенные текстовые/цветовые привязки. На Case прочитаны структура основных экранов, поверхности просмотра и их toolbar. На Cards прочитаны все 12 masters/sets; проверены ссылки из Related cases.

Визуально просмотрены секция Components, четыре набора Chirp, главный экран 148:796, desktop Product/UX/Brand, общий mobile Product и backdrop 289:770. Длинные кейсы просмотрены на уровне композиции: это не построчная проверка всего контента и не полный аудит доступности. Реакции прототипов и все экспортируемые ассеты отдельно не проверялись.

## Изменения документов

Последующие согласованные решения: fullscreen непрозрачный, шапка topStikyBar 778:3521 закреплена и имеет высоту 138px. Поведение описано в `E:/GitHub/Cases/Docs-to-developing/illustrations/ill-task-description.md`; вопрос прозрачности ниже закрыт. Для Tab создан surface/action-hover → accent/lavender и привязан ко всем четырём Hover-вариантам; теперь 50 Primitive и 24 Semantic. Остальные состояния и компоненты согласовываются по одному.

- CONTRACT.md: Figma как источник правды, актуальная секция UI-kit, буквальное сохранение идентификаторов.
- foundation.md: полный перечень Variables/aliases и Text Styles, действительные оси шрифта, тени, отсутствующие bindings.
- components.md: актуальный каталог, все варианты и свойства, навигация, медиа-панели, иконки, обе группы карточек Chirp; разделение готовых masters и планируемых компонентов.
- brand-brief.md: визуальные решения приведены к Roboto Flex и актуальным акцентам; цели аудитории и локалей сохранены.
- DS.md: актуальные ссылки, корректные master IDs, статус несинхронизированного кода; Notion исключён из будущего процесса.

## Карта файла

Имена сохранены как в Figma. Повторяющиеся названия перечислены с ID; новые суффиксы и версии не назначались. Наличие фрейма не означает, что он утверждён для публикации.

### Layouts-main-portfolio (46:487)

| Узел | ID | Тип | Размер из API |
|---|---|---|---|
| Main | [`46:489`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=46-489) | FRAME | 1440×2464 |
| Main | [`115:474`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=115-474) | FRAME | 1440×1575 |
| About | [`46:515`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=46-515) | FRAME | 1440×2826 |
| About | [`148:1093`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=148-1093) | FRAME | 1440×2237 |
| About | [`117:628`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=117-628) | FRAME | 1440×2347 |
| Main | [`148:796`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=148-796) | FRAME | 1440×1188 |
| Main | [`148:481`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=148-481) | FRAME | 1440×1575 |

### Case (148:1206)

| Узел | ID | Тип | Размер из API |
|---|---|---|---|
| 1920 | [`344:2965`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=344-2965) | FRAME | 1920×15236 |
| 1920-UX | [`295:1251`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=295-1251) | FRAME | 1920×15726 |
| 1920-Brand | [`559:2332`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=559-2332) | FRAME | 1920×14190 |
| 1920-DS | [`763:5072`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=763-5072) | FRAME | 1920×6626 |
| 1920-DS | [`790:3287`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=790-3287) | FRAME | 1920×6322 |
| 1920-DS | [`800:2435`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=800-2435) | FRAME | 1920×8028 |
| 1920-DS | [`790:2913`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=790-2913) | FRAME | 1920×11718 |
| background | [`528:1811`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=528-1811) | FRAME | 1920×1650.71 |
| 1920-backdrop-UX | [`422:3030`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=422-3030) | FRAME | 1920×4235.25 |
| 1920-backdrop-PR | [`289:770`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=289-770) | FRAME | 1920×1086 |
| 1920-backdrop-PR | [`492:1663`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=492-1663) | FRAME | 1920×1013 |
| 1920-backdrop-PR | [`407:1824`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=407-1824) | FRAME | 1920×1057 |
| 1920-backdrop-PR | [`407:1973`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=407-1973) | FRAME | 1920×926 |
| 1920-backdrop-PR | [`407:2258`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=407-2258) | FRAME | 1920×1012 |
| 1920-backdrop-PR | [`411:2416`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=411-2416) | FRAME | 1920×617 |
| 1920-backdrop-PR | [`411:2540`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=411-2540) | FRAME | 1920×607 |
| 720 | [`274:203`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=274-203) | FRAME | 720×20924 |
| chirp-hero | [`790:2075`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=790-2075) | FRAME | 720×727 |
| logo-P01-m 1 | [`790:2012`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=790-2012) | FRAME | 585×328 |
| 720-2 | [`297:1733`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=297-1733) | FRAME | 720×15312 |
| 720-backdrop-PR | [`407:1714`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=407-1714) | FRAME | 720×1202 |
| 720-backdrop-PR | [`544:1906`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=544-1906) | FRAME | 720×1202 |
| 1920-backdrop-PR | [`453:2437`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=453-2437) | FRAME | 1920×982 |

### Cards (687:2396)

| Узел | ID | Тип | Размер из API |
|---|---|---|---|
| Vendor App | [`32:264`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=32-264) | COMPONENT_SET | 440×1700 |
| LeCar OMS | [`32:425`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=32-425) | COMPONENT_SET | 440×1874 |
| Lada Business | [`32:499`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=32-499) | COMPONENT_SET | 440×1832 |
| Cash Desk | [`32:576`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=32-576) | COMPONENT_SET | 420×1680 |
| coming-soon | [`90:404`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=90-404) | COMPONENT | 98×98 |
| Self-service kiosk | [`32:627`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=32-627) | COMPONENT_SET | 440×2006 |
| 1200x760-Chirp | [`687:2406`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-2406) | FRAME | 1200×760 |
| 1200x760-VendrApp | [`687:2814`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-2814) | FRAME | 1200×760 |
| lecar-online-oms | [`687:3157`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3157) | FRAME | 1200×760 |
| platforma-lada-business | [`687:3160`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3160) | FRAME | 1200×760 |
| 1200x760-Self-service kiosk | [`687:3165`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3165) | FRAME | 1200×760 |
| 1200x760-Cash Desk | [`687:3170`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3170) | FRAME | 1200×760 |
| 1200x760-Cash Desk 2 | [`687:3174`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3174) | RECTANGLE | 1200×760 |
| 1200x760-VendrApp 1 | [`687:3175`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3175) | RECTANGLE | 1200×760 |
| 1200x760-Chirp 1 | [`687:3176`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3176) | RECTANGLE | 1200×760 |
| 1200x760-Self-service kiosk 1 | [`687:3177`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3177) | RECTANGLE | 1200×760 |
| 120x760 | [`687:3178`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3178) | TEXT | 375×109 |
| lecar-online-oms | [`687:3179`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3179) | RECTANGLE | 1200×760 |
| platforma-lada-business | [`687:3180`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3180) | RECTANGLE | 1200×760 |
| Chirp AI health assistant | [`694:4459`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=694-4459) | COMPONENT_SET | 440×1702 |
| Chirp Explainable AI UX | [`694:4486`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=694-4486) | COMPONENT_SET | 440×1702 |
| Chirp AI Medical Brand | [`694:4487`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=694-4487) | COMPONENT_SET | 440×1702 |
| Chirp AI Design System | [`805:3357`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=805-3357) | COMPONENT_SET | 442×1702 |
| Group 4216 | [`687:3601`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3601) | GROUP | 527.99×687.82 |
| Chirp AI health assistant Product | [`32:332`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=32-332) | COMPONENT_SET | 440×2171 |
| Chirp AI health assistant UX | [`326:2459`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=326-2459) | COMPONENT_SET | 440×2171 |
| AQUA MARIS | [`687:3262`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3262) | FRAME | 400×539 |
| AQUA MARIS | [`687:3231`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-3231) | FRAME | 400×539 |

### DS (0:1)

| Узел | ID | Тип | Размер из API |
|---|---|---|---|
| Tab | [`33:1544`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=33-1544) | COMPONENT_SET | 2064×70 |
| Icon button | [`43:803`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=43-803) | COMPONENT_SET | 510×90 |
| cross button | [`290:1960`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=290-1960) | COMPONENT_SET | 252×104 |
| Filter | [`43:867`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=43-867) | COMPONENT_SET | 882×80 |
| Avatar-Lg | [`124:563`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=124-563) | COMPONENT | 120×120 |
| Tabs | [`124:669`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=124-669) | COMPONENT | 433×50 |
| Filters | [`124:1059`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=124-1059) | COMPONENT | 1050×40 |
| Avatar-Sm | [`124:712`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=124-712) | COMPONENT_SET | 90×230 |
| TopNav/Default | [`124:824`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=124-824) | COMPONENT | 1376×658 |
| TopNav/Scroll | [`124:1104`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=124-1104) | COMPONENT | 1138×154 |
| BtnNav | [`281:506`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=281-506) | COMPONENT_SET | 420×90 |
| Badge | [`312:1991`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=312-1991) | COMPONENT_SET | 143×101 |
| Breadcrumbs | [`317:2055`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=317-2055) | COMPONENT_SET | 173×160 |
| Tooltip | [`324:2111`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=324-2111) | COMPONENT_SET | 107×240 |
| BreadcrumbsMenu | [`325:1622`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=325-1622) | COMPONENT | 135×135 |
| BreadcrumbsOverflow | [`325:1634`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=325-1634) | COMPONENT | 235×26 |
| BreadcrumbsMenuItem | [`325:1613`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=325-1613) | COMPONENT_SET | 175×175 |
| ImgTitle | [`357:2013`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=357-2013) | COMPONENT | 676×74 |
| Toolbar | [`778:3542`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=778-3542) | COMPONENT | 432×50 |
| topStikyBar | [`778:3521`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=778-3521) | COMPONENT | 1397×138 |
| Related cases | [`809:4476`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=809-4476) | COMPONENT | 924×532 |
| download-01 | [`33:1942`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=33-1942) | COMPONENT | 24×24 |
| printer | [`104:472`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=104-472) | COMPONENT | 24×24 |
| f-icon | [`140:1286`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=140-1286) | COMPONENT | 32×32 |
| arrow-right | [`269:1564`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=269-1564) | COMPONENT | 24×24 |
| ArrowLeftNav | [`275:874`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=275-874) | COMPONENT | 24×24 |
| ArrowUpNav | [`281:499`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=281-499) | COMPONENT | 24×24 |
| Cross | [`290:1948`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=290-1948) | COMPONENT | 24×24 |
| magnifying-glass | [`263:507`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=263-507) | COMPONENT | 24×24 |
| sun | [`263:508`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=263-508) | COMPONENT | 24×24 |
| moon | [`263:509`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=263-509) | COMPONENT | 24×24 |
| Github | [`755:2339`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=755-2339) | COMPONENT | 24×24 |
| Figma | [`755:2343`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=755-2343) | COMPONENT | 24×24 |
| ExternalLink | [`781:2830`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=781-2830) | COMPONENT | 16×16 |
| Palette | [`51:283`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=51-283) | FRAME | 1056×108 |
| Typography | [`51:325`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=51-325) | FRAME | 1375×359 |
| Radii | [`51:336`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=51-336) | FRAME | 328×90 |
| Spacing | [`51:349`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=51-349) | FRAME | 220×86 |
| Chirp AI health assistant | [`815:2062`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=815-2062) | COMPONENT_SET | 440×1702 |
| Chirp Explainable AI UX | [`815:2114`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=815-2114) | COMPONENT_SET | 440×1702 |
| Chirp AI Medical Brand | [`815:2160`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=815-2160) | COMPONENT_SET | 440×1702 |
| Chirp AI Design System | [`815:2280`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=815-2280) | COMPONENT_SET | 442×1702 |

### SUFF (687:2392)

| Узел | ID | Тип | Размер из API |
|---|---|---|---|
| image 4 | [`687:2393`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-2393) | RECTANGLE | 591×443 |
| image 5 | [`687:2394`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=687-2394) | RECTANGLE | 1200×1752 |
| Group 9 | [`816:3371`](https://www.figma.com/design/V28Wl8M0ipiH4neDPjxKys/PDPortfolio-Prod?node-id=816-3371) | GROUP | 1376×1301 |

## Что нужно решить перед соответствующим этапом вёрстки

1. **Главная и About.** Есть несколько Main/About. Старые ссылки в DS.md оставлены как ранее документированные ориентиры, но окончательный reference нужно подтвердить. У 148:796 API возвращал 1440×1188 и внутреннюю полосу 1744×532, тогда как screenshot вернул 1440×1752 и раскладку карточек в два ряда. Эти результаты нельзя использовать как однозначную спецификацию геометрии; перед кодом повторно считать целевой фрейм.
2. **DS-кейс Chirp.** Четыре экрана называются 1920-DS: 763:5072, 790:3287, 800:2435, 790:2913. Это могут быть разные представления; индекс не устанавливает их назначение и не выбирает финальный.
3. **Masters карточек.** Одноимённые наборы есть на DS и Cards. Related cases использует Cards. Не удалять, не перепривязывать и не переименовывать наборы по одному имени.
4. **Backdrop.** Ранее согласована полупрозрачность, но текущие FRAME часто непрозрачны. Нужны точный reference и значение прозрачности до реализации общей поверхности.
5. **Контракт Variables.** Badge/Hero исправлен по решению пользователя: surface/badge-chirp → accent/mint, только для Chirp, цвет сохранён. Теперь 50 Primitive + 23 Semantic. Четыре Text Styles не имеют fontFamily/fontSize bindings, некоторые controls привязаны напрямую к Primitive, градиенты/тени имеют локальные значения. Оставшиеся проблемы обсуждаем по одной: ссылка и проблема → решение пользователя → исправление и проверка.
6. **Адаптивность.** В индексе Case есть 720/720-2 и 720-backdrop; это не доказательство готовности макетов для 360–430 CSS px. Mobile Brand/DS и mobile Main/About не найдены среди верхнеуровневых экранов. У Filter Type=2nd варианты имеют разную высоту.

## Очередь переноса

- [x] Синхронизировать канонические документы с прочитанным состоянием Figma.
- [x] Зафиксировать неоднозначности и устаревшие соответствия кода.
- [ ] Выбрать целевые Main/About и представления DS-кейса по node ID.
- [ ] Обновить token layer и все потребители типографики совместно; не подменять старую шкалу по совпадению суффиксов.
- [ ] Перенести актуальные Badge, Tab, Icon button, Filter, TopNav, Breadcrumbs и Tooltip в Vue/DS.
- [ ] Реализовать карточки и Related cases по выбранным masters.
- [ ] Согласовать поверхности медиа; выделить CaseMediaFrame/Backdrop и реализовать viewer на базе ImgTitle/topStikyBar.
- [ ] Собрать страницы с текстом из Figma и типографикой перед сборкой.
- [ ] Проверить desktop/mobile, клавиатуру, viewer, ассеты и статическую генерацию для GitHub Pages.

## Статус кода

Код в этом проходе не мигрирован. В tokens.css остались старая шкала (--size-lg=16, --size-xl=18, --size-2xl=20, --size-3xl=28, --size-4xl=48), старое имя --text-accent, тиловые тени и прежние heading-классы. В Figma уже другая шкала и новые роли; нельзя считать три слоя полностью синхронизированными до переноса и проверки страниц.
