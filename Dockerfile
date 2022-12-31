FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .
RUN npm run build
RUN npx prisma generate
# RUN npx prisma migrate dev --name init

CMD ["npm", "start"]