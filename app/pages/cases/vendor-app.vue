<template>
  <main class="case-page">
    <NuxtLink to="/" class="back">← На главную</NuxtLink>

    <header>
      <h1>Vendor App</h1>
      <h2 class="lead">
        Снижение Cancellation Rate на 12% через изменение поведения пользователя
      </h2>
      <p><strong>Delivery Club — Vendor App B2B/B2E</strong></p>
      <p>Партнёрское приложение для обработки входящих заказов delivery & takeaway (HoReCa)</p>
      <ul>
        <li><strong>Роль:</strong> Senior Product Designer (UX + Product thinking)</li>
        <li><strong>Команда:</strong> PM, аналитик</li>
        <li><strong>Срок:</strong> \~4 месяца</li>
        <li><strong>Пользователи:</strong> 90 000+ операторов и кассиров</li>
      </ul>
    </header>

    <section class="content">
      <h3>💥 Проблема</h3>
      <p>
        Отмена заказов (<strong>Cancellation Rate</strong>) была одной из самых дорогих точек потерь платформы:
      </p>
      <ul>
        <li>прямое снижение GMV</li>
        <li>операционные потери партнёров</li>
        <li>ухудшение пользовательского опыта</li>
      </ul>
      <p>
        👉 При этом большинство сценариев отмены происходило <strong>внутри интерфейса оператора</strong> — значит, проблему можно было решить на уровне продукта.
      </p>

      <h3>🔍 Что мы выяснили</h3>
      <p>Через анализ метрик и интервью с партнёрами:</p>
      <h4>Причины отмен разделились на 2 типа:</h4>
      <p><strong>❌ Не контролируются продуктом</strong></p>
      <ul>
        <li>нехватка курьеров</li>
        <li>закрытие точки</li>
        <li>перегруз</li>
      </ul>
      <p><strong>✅ Контролируются через UX</strong></p>
      <ul>
        <li>блюдо отсутствует</li>
        <li>изменилась цена</li>
      </ul>
      <p>👉 Именно здесь лежала точка роста.</p>

      <h3>🎯 Задача</h3>
      <blockquote>
        <p>Перевести сценарий из</p>
        <p><strong>"отменить заказ" → "сохранить заказ"</strong></p>
        <p>Не ломая привычный workflow операторов.</p>
      </blockquote>

      <h3>💡 Решение</h3>
      <p>Перехватить момент отмены и встроить альтернативные действия прямо в этот сценарий:</p>

      <h4>1. Замена блюда (Out-of-stock)</h4>
      <p>Вместо мгновенной отмены — оператору предлагается заменить блюдо.</p>
      <img src="/notion-assets/vendor-app/img-01-f682092d36.png" alt="Замена блюда" />
      <p><strong>Что сделали:</strong></p>
      <ul>
        <li>встроили call to action “Заменить блюдо” прямо в диалог отмены</li>
        <li>добавили альтернативный сценарий без выхода из флоу</li>
        <li>сократили путь к действию до 1 шага</li>
      </ul>
      <p><strong>Почему это сработало:</strong></p>
      <ul>
        <li>пользователь уже в контексте проблемы</li>
        <li>не требуется обучение</li>
        <li>минимальный friction</li>
      </ul>
      <p>👉 Мы не запрещаем отмену — мы делаем <strong>сохранение заказа приоритетом KPI</strong></p>

      <h4>2. Упреждающее действие (Proactive UX)</h4>
      <p>Вынесли действие <strong>“Заменить блюдо”</strong> на первый уровень интерфейса.</p>
      <img src="/notion-assets/vendor-app/img-02-9c02234b1e.png" alt="Упреждающее действие" />
      <p><strong>Что изменилось:</strong></p>
      <ul>
        <li>оператор видит альтернативу до отмены</li>
        <li>формируется новый паттерн поведения</li>
      </ul>
      <p>👉 Сдвиг:</p>
      <p><strong>Cancel-first → Resolve-first</strong></p>

      <h4>3. Изменение цены (Price Change)</h4>
      <p>Аналогичный паттерн применили для сценария изменения цены.</p>
      <img src="/notion-assets/vendor-app/img-03-ec681e347f.png" alt="Изменение цены" />
      <p><strong>Что сделали:</strong></p>
      <ul>
        <li>вместо отмены — оформление разницы как скидки</li>
        <li>тот же UX-паттерн, меньше когнитивной нагрузки</li>
      </ul>

      <h4>4. Stop-list (предотвращение повторных ошибок)</h4>
      <p>Мы не только спасали заказы, но и устраняли причину проблемы.</p>
      <img src="/notion-assets/vendor-app/img-04-8681b420c3.png" alt="Stop-list" />
      <p><strong>Как работает:</strong></p>
      <ul>
        <li>при одной позиции в заказе товар автоматически попадает в стоп-лист</li>
        <li>при нескольких позициях — быстрый выбор</li>
      </ul>
      <p><strong>Эффект:</strong></p>
      <ul>
        <li>меньше повторных отмен</li>
        <li>меньше ручной работы</li>
        <li>выше предсказуемость системы</li>
      </ul>

      <h3>⚙️ Системное проектирование</h3>
      <img src="/notion-assets/vendor-app/img-05-df4898ce20.png" alt="BPMN схема" />
      <p>
        <a
          href="https://www.figma.com/design/ePMi9EX33q0LyOPAHHMrux/BazarovCaseVAppItemReplaceBPMn?node-id=1-5541&t=ZKevXrZ92jTp2FBq-1"
          target="_blank"
          rel="noreferrer"
        >
          Figma с оригиналом схемы
        </a>
      </p>
      <p>Я формализовал полный сценарий обработки заказа через BPMN.</p>
      <p>Это позволило:</p>
      <ul>
        <li>синхронизировать продукт, бизнес и разработку</li>
        <li>найти точки автоматизации</li>
        <li>спроектировать масштабируемую архитектуру</li>
      </ul>
      <p>👉 MVP: звонок оператором</p>
      <p>👉 Далее: push / чат-бот / voice automation</p>

      <h3>🧪 Валидация</h3>
      <p>Тестировали на 3 уровнях:</p>
      <ul>
        <li>бизнес (Delivery Club)</li>
        <li>партнёры (рестораны)</li>
        <li>конечные пользователи (операторы)</li>
      </ul>
      <p><strong>Методы:</strong></p>
      <ul>
        <li>UX-тесты (Figma)</li>
        <li>интервью</li>
        <li>демо стейкхолдерам</li>
      </ul>
      <p>👉 Барьеров внедрения не выявлено</p>

      <h3>📈 Результат</h3>
      <div class="result-callout">
        <strong>Cancellation Rate уменьшен на 12%</strong>
      </div>
      <p>Что это дало:</p>
      <ul>
        <li>больше завершённых заказов без роста маркетинга</li>
        <li>рост GMV</li>
        <li>снижение операционных потерь</li>
        <li>меньше нагрузки на поддержку</li>
      </ul>
      <p>👉 UX стал прямым драйвером экономики платформы</p>
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

header h1 {
  margin: 0 0 8px;
  font-size: clamp(30px, 4vw, 44px);
}

.lead {
  margin: 0 0 12px;
  color: #15803d;
  font-size: clamp(20px, 3vw, 28px);
  line-height: 1.25;
}

header p {
  margin: 0 0 10px;
  color: #475569;
}

.content {
  display: grid;
  gap: 10px;
}

.content h3 {
  margin: 22px 0 0;
  font-size: 26px;
}

.content h4 {
  margin: 12px 0 0;
  font-size: 20px;
}

.content p {
  margin: 0;
  color: #334155;
}

.content ul {
  margin: 0;
  padding-left: 20px;
}

.content li {
  margin: 0 0 4px;
  color: #334155;
}

.content blockquote {
  margin: 0;
  padding: 12px 14px;
  border-left: 4px solid #22c55e;
  background: #f0fdf4;
  border-radius: 8px;
  color: #14532d;
}

.content img {
  margin: 4px 0;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.result-callout {
  margin-top: 4px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #fca5a5;
  background: #fef2f2;
  color: #7f1d1d;
}
</style>
