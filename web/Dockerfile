FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3001

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3001"]