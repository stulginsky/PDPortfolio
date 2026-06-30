<template>
  <main class="case-page">
    <NuxtLink to="/" class="back">← На главную</NuxtLink>

    <section class="content">
      <h1>Платформа LADA Business</h1>
      <h2>B2B-платформа для управления партнёрской сетью рынка автозапчастей.</h2>
      <p><strong>Designing an Operational Marketplace for the Automotive Ecosystem</strong></p>
      <p>Она объединяет:</p>
      <ul>
        <li>оптовых операторов</li>
        <li>дилеров</li>
        <li>магазины</li>
        <li>сервисные станции</li>
      </ul>
      <p>в единую систему закупок и логистики.</p>
      <img src="/notion-assets/platforma-lada-business/img-01-f7f383fb07.png" alt="LADA Business intro" />
      <p>Интерфейс платформы для поиска и заказа автозапчастей внутри партнёрской сети.</p>

      <h2>Контекст индустрии</h2>
      <p><strong>Industry Context</strong></p>
      <p>Автомобильный рынок России столкнулся с серьёзными изменениями:</p>
      <ul>
        <li>разрыв международных поставок</li>
        <li>дефицит оригинальных деталей</li>
        <li>рост сроков доставки</li>
      </ul>
      <p>Большая часть взаимодействия между участниками рынка происходила через:</p>
      <ul>
        <li>Excel</li>
        <li>email</li>
        <li>телефон</li>
      </ul>
      <p>Это усложняло управление товарными потоками.</p>

      <h2>Архитектура партнёрской сети</h2>
      <p><strong>Partner Network Architecture</strong></p>
      <p>Исторически партнёрская сеть строилась по иерархической модели.</p>
      <p>Каждый регион имел своего оптового оператора, который выступал:</p>
      <ul>
        <li>основным покупателем продукции</li>
        <li>логистическим хабом региона</li>
        <li>посредником между производителем и рынком.</li>
      </ul>
      <img src="/notion-assets/platforma-lada-business/img-02-fb7e1ca362.png" alt="Структура сети" />
      <p>Структура сети.</p>

      <h2>Ограниченная прозрачность рынка</h2>
      <p><strong>Limited Market Visibility</strong></p>
      <p>Фактическими потребителями продукции являлись:</p>
      <ul>
        <li>магазины</li>
        <li>сервисные станции</li>
      </ul>
      <p>Но компания взаимодействовала преимущественно <strong>с оптовыми операторами</strong>.</p>
      <p>Это приводило к нескольким ограничениям:</p>
      <ul>
        <li>компания не видела реальный спрос</li>
        <li>управление ассортиментом происходило через посредников</li>
        <li>товарные потоки внутри сети были непрозрачны.</li>
      </ul>

      <h2>Ограничения существующей системы</h2>
      <p><strong>Legacy System</strong></p>
      <ul>
        <li>схемы старой системы</li>
        <li>legacy интерфейсы</li>
      </ul>
      <img src="/notion-assets/platforma-lada-business/img-03-240e20a620.png" alt="Legacy 1" />
      <img src="/notion-assets/platforma-lada-business/img-04-53f5a2cd1a.png" alt="Legacy 2" />
      <img src="/notion-assets/platforma-lada-business/img-05-75e931bc06.png" alt="Legacy 3" />
      <img src="/notion-assets/platforma-lada-business/img-06-6b8c5d0d47.png" alt="Legacy 4" />
      <p>Существующая система обработки заказов и её интерфейсы.</p>
      <p>Система исторически развивалась как <strong>инструмент обработки заявок</strong>, а не как торговая платформа.</p>
      <p>Она обслуживала только взаимодействие с оптовыми операторами и не отражала структуру всей партнёрской сети.</p>

      <h2>Продуктовая задача</h2>
      <p><strong>Product Challenge</strong></p>
      <p>Необходимо было создать платформу, которая:</p>
      <ul>
        <li>объединит участников партнёрской сети</li>
        <li>обеспечит прозрачность товарных потоков</li>
        <li>позволит управлять спросом</li>
        <li>ускорит процессы закупок и логистики.</li>
      </ul>
      <img src="/notion-assets/platforma-lada-business/img-07-48230c883d.png" alt="Product challenge" />

      <h2>Выравнивание со стейкхолдерами</h2>
      <p><strong>Stakeholder Alignment</strong></p>
      <img src="/notion-assets/platforma-lada-business/img-08-311c25dedd.png" alt="Stakeholder workshop" />
      <p>Воркшоп по формированию функциональной модели будущей платформы.</p>
      <p>Я провёл серию воркшопов со стейкхолдерами, где мы:</p>
      <ul>
        <li>сопоставили текущие функции системы</li>
        <li>определили реальные задачи партнёров</li>
        <li>сформировали продуктовое видение платформы.</li>
      </ul>

      <h3>Ролевая модель партнёров</h3>
      <p><strong>Partner Role Model</strong></p>
      <img src="/notion-assets/platforma-lada-business/img-09-478d1df853.png" alt="Role model" />
      <p>Ролевая модель участников платформы.</p>
      <p>Мы выделили ключевые роли системы:</p>
      <ul>
        <li>оптовики</li>
        <li>дилеры</li>
        <li>магазины</li>
        <li>сервисные станции.</li>
      </ul>

      <h2>Архитектура продукта</h2>
      <p><strong>Information Architecture</strong></p>
      <img src="/notion-assets/platforma-lada-business/img-10-03a5d361bf.png" alt="Information architecture" />
      <p>Информационная архитектура платформы и последовательность разработки модулей.</p>
      <p>На основе пользовательских сценариев была сформирована архитектура системы и структура основных модулей платформы.</p>

      <h2>Навигация платформы</h2>
      <p><strong>Navigation Structure</strong></p>
      <img src="/notion-assets/platforma-lada-business/img-11-562ffc8fa2.png" alt="Navigation structure" />
      <p>Формирование структуры меню и её реализация в интерфейсе.</p>

      <h2>UX-архитектура</h2>
      <p><strong>UX architecture</strong></p>
      <p>Навигация → Таблицы → Инспектор объектов → Контекстные действия<br />Большая часть операционной работы партнёров происходит в табличных интерфейсах.</p>

      <h3>Tables</h3>
      <p>Через таблицы пользователи управляют:</p>
      <ul>
        <li>заказами</li>
        <li>складскими остатками</li>
        <li>логистикой</li>
        <li>финансовыми данными</li>
      </ul>
      <p>Поэтому таблица становится <strong>ключевым интерфейсным компонентом платформы</strong>.</p>
      <p>Мы проектируем таблицу как <strong>универсальный компонент</strong>, способный масштабироваться для разных сценариев системы.</p>
      <p><NuxtLink to="/cases/nested-lada-table">Deep Dive (table)</NuxtLink></p>
      <img src="/notion-assets/platforma-lada-business/img-12-2c0fa76cd9.png" alt="Deep Dive table" />

      <h3>Filtering</h3>
      <p>Я спроектировал типизированный фильтр, одинаково эффективно работающий <br />как с табличным, так и со списочным представлением данных.</p>
      <p><NuxtLink to="/cases/nested-lada-filtering">Deep Dive (filtering)</NuxtLink></p>
      <img src="/notion-assets/platforma-lada-business/img-13-ab50966d87.png" alt="Deep Dive filtering" />

      <h3>Dynamic Toolbar</h3>
      <img src="/notion-assets/platforma-lada-business/img-14-d1538b8ca1.png" alt="Dynamic toolbar" />

      <h3>Catalog</h3>
      <p>Карточка товара спроектирована как часть рабочего пространства пользователя.</p>
      <p>Фокус интерфейса:</p>
      <ul>
        <li>быстрый подбор деталей</li>
        <li>сравнение поставщиков</li>
        <li>доступ к технической информации</li>
      </ul>
      <img src="/notion-assets/platforma-lada-business/img-15-b1ba334e21.png" alt="Catalog 1" />
      <img src="/notion-assets/platforma-lada-business/img-16-19d135f213.png" alt="Catalog 2" />

      <h3>Objects</h3>
      <p>Для заказов и заявок реализован единый интерфейсный паттерн:</p>
      <ul>
        <li>объект</li>
        <li>вложенные элементы</li>
        <li>инспектор параметров</li>
      </ul>
      <img src="/notion-assets/platforma-lada-business/img-17-76c481a6d6.png" alt="Objects" />

      <h3>Feedback and Validation</h3>
      <p>Единый интерфейсный паттерн:</p>
      <ul>
        <li>мгновенная обратная связь при ошибках</li>
        <li>подсказки по корректному заполнению данных</li>
        <li>уведомления о проблемах в заявках</li>
      </ul>
      <p>Это позволило снизить количество ошибок и обращений в поддержку.</p>
      <img src="/notion-assets/platforma-lada-business/img-18-a25b00ec0d.png" alt="Feedback and validation" />

      <h3>Data Drill-Down</h3>
      <p>Многоуровневая детализация данных через инспектор объектов</p>
      <p><NuxtLink to="/cases/nested-lada-inspector">Deep Dive (object inspector)</NuxtLink></p>
      <img src="/notion-assets/platforma-lada-business/img-19-59042c9268.png" alt="Data drill-down" />

      <h3>Simplifying Partner Onboarding</h3>
      <p>Я предложил радикально упростить процесс регистрации.</p>
      <p><NuxtLink to="/cases/nested-lada-partner-onboarding">Deep Dive (partner onboarding)</NuxtLink></p>
      <img src="/notion-assets/platforma-lada-business/img-20-9a622e7a30.png" alt="Partner onboarding" />

      <h2>Impact</h2>
      <p>New partner segments connected</p>
      <p>Platform marketplace launched</p>

      <h3>Market Impact</h3>
      <p>Компания получила инструмент более глубокого взаимодействия с партнёрской сетью — повысилась прозрачность продаж, ценообразования и товарных потоков.</p>
      <p>Открыт новый канал роста за счёт малого и среднего бизнеса: магазинов автозапчастей, независимых СТО и сервисных компаний.</p>
      <p>Платформа стала точкой входа в цифровую экосистему бренда для новых категорий партнёров.</p>

      <h3>Operational Impact</h3>
      <p>Перестроены процессы взаимодействия с партнёрами: больше прозрачности, меньше ручных операций, выше предсказуемость взаимодействия.</p>
      <p>Партнёры получили инструменты <strong>self-service</strong> — от регистрации до аналитики закупок и продаж.</p>
      <p>Создана основа для гибкой логистики и оптимизации цепочек поставок.</p>

      <h3>Product Impact</h3>
      <p>Сформирована цифровая B2B-экосистема вместо набора разрозненных сервисов.</p>
      <p>Расширена целевая аудитория: от крупных дилеров и оптовиков до небольших магазинов и сервисных мастерских.</p>
      <p>Архитектура платформы позволяет добавлять новые сервисы без усложнения UX.</p>

      <p>🚀 Продукт расширил <strong>TAM рынка</strong> и усилил позиции компании в B2B-сегменте автозапчастей.</p>
      <p>🚀 Дизайн решений повлиял <strong>на операционную модель бизнеса</strong>, а не только на интерфейсы.</p>
      <p>🚀 Это создало основу для масштабирования продукта.</p>

      <h3>Design System as Product Infrastructure</h3>
      <p>В рамках проекта я заложил основу дизайн-системы, инфраструктурнго элемента цифровой платформы:</p>
      <ul>
        <li>типизированные компоненты для быстрого развития интерфейсов;</li>
        <li>консистентность UX между продуктами экосистемы;</li>
        <li>снижение стоимости разработки новых функций;</li>
        <li>база для масштабирования цифровых сервисов компании.</li>
      </ul>
      <img src="/notion-assets/platforma-lada-business/img-21-add704a591.png" alt="Design system" />
    </section>
  </main>
</template>

<style scoped>
.case-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px 56px;
  font-family: Inter, Arial, sans-serif;
  color: #0f172a;
}

.back {
  display: inline-block;
  margin-bottom: 16px;
  color: #334155;
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}

.content {
  display: grid;
  gap: 10px;
}

h1 {
  margin: 0 0 8px;
  font-size: clamp(30px, 4vw, 44px);
}

h2 {
  margin: 20px 0 0;
  font-size: 28px;
}

h3 {
  margin: 14px 0 0;
  font-size: 22px;
}

p,
li {
  color: #334155;
}

ul {
  margin: 0;
  padding-left: 20px;
}

img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  margin: 4px 0;
}
</style>
