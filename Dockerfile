FROM node:18-alpine

RUN mkdir -p /app
WORKDIR /app

COPY . .

RUN yarn

EXPOSE 3006

ENTRYPOINT ["yarn"]
CMD ["start"]
