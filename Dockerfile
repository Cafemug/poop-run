FROM node:lts




COPY ./poop-run /poop-run
WORKDIR /poop-run
RUN yarn install

CMD ["node", "main.js"]
