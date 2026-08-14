# gitdealflow.com (landing), граблі та правила

## Деплой
- `vercel deploy --prod` з цієї папки; git author = `sales@sipiteno.com`
- `.vercel/` тут колись вказував на ЧУЖИЙ проєкт (wrong-project trap), перед деплоєм перевір `.vercel/project.json`

## Критичні граблі
- CSP має `require-trusted-types-for`, інʼєкція скриптів (PostHog тощо) ламається без Trusted Types policy; сайт вже був ~40h без трекінгу через це
- CTA темні-на-помаранчевому, це СВІДОМИЙ дизайн, не баг
- **НЕ видаляй mcp-demo.gif**
- Tailwind збирається через tailwindcss@3.4.19, не апгрейдь мимохідь
- Sender email = `signal@gitdealflow.com` (однина), це намір власника; дефолт у коді `signals@` застарілий, не "виправляй" назад

## Верифікація
- Скріншот live-домену після деплою, не тільки vercel preview
