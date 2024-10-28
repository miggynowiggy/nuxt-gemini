FROM node:20-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY ./package.json /app/
COPY ./pnpm-lock.yaml /app/

RUN pnpm install --shamefully-hoist

COPY . ./

RUN pnpm run build

FROM node:20-slim

WORKDIR /app

COPY --from=build /app/.output ./

ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "/app/server/index.mjs"]

